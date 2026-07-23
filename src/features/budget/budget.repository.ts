import { SupabaseClient } from '@supabase/supabase-js';
import { IBudgetRepository } from './budget.repository.interface';
import { BudgetCategory, BudgetSummary, BudgetTransaction, CategorySummary, MonthlyTrend, UUID } from '@/shared/types';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { CreateCategoryDtoType } from './dtos/create-category.dto';
import { CreateTransactionDtoType } from './dtos/create-transaction.dto';
import { UpdateTransactionDtoType } from './dtos/update-transaction.dto';
import { BudgetQueryDtoType } from './dtos/budget-query.dto';
import { NotFoundError } from '@/shared/utils/errors';

export class BudgetRepository implements IBudgetRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async findTransactions(userId: UUID, query: BudgetQueryDtoType): Promise<BudgetTransaction[]> {
    let q = this.db
      .from('budget_transactions')
      .select('*, category:budget_categories(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(query.limit ?? 50);

    if (query.type) q = q.eq('type', query.type);
    if (query.category_id) q = q.eq('category_id', query.category_id);

    if (query.month && query.year) {
      const from = `${query.year}-${String(query.month).padStart(2, '0')}-01`;
      const lastDay = new Date(query.year, query.month, 0).getDate();
      const to = `${query.year}-${String(query.month).padStart(2, '0')}-${lastDay}`;
      q = q.gte('date', from).lte('date', to);
    } else if (query.year) {
      q = q.gte('date', `${query.year}-01-01`).lte('date', `${query.year}-12-31`);
    }

    const { data, error } = await q;
    if (error) {
      this.logger.error('BudgetRepository.findTransactions failed', error);
      return [];
    }
    return (data ?? []) as BudgetTransaction[];
  }

  async findTransactionById(id: UUID): Promise<BudgetTransaction | null> {
    const { data, error } = await this.db
      .from('budget_transactions')
      .select('*, category:budget_categories(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as BudgetTransaction;
  }

  async createTransaction(userId: UUID, data: CreateTransactionDtoType): Promise<BudgetTransaction> {
    const { data: tx, error } = await this.db
      .from('budget_transactions')
      .insert({ ...data, user_id: userId })
      .select('*, category:budget_categories(*)')
      .single();

    if (error || !tx) {
      this.logger.error('BudgetRepository.createTransaction failed', error);
      throw new Error('Failed to create transaction');
    }
    return tx as BudgetTransaction;
  }

  async updateTransaction(id: UUID, data: UpdateTransactionDtoType): Promise<BudgetTransaction> {
    const { data: tx, error } = await this.db
      .from('budget_transactions')
      .update(data)
      .eq('id', id)
      .select('*, category:budget_categories(*)')
      .single();

    if (error || !tx) {
      this.logger.error('BudgetRepository.updateTransaction failed', error);
      throw new NotFoundError('Transaction');
    }
    return tx as BudgetTransaction;
  }

  async deleteTransaction(id: UUID): Promise<void> {
    const { error } = await this.db.from('budget_transactions').delete().eq('id', id);
    if (error) {
      this.logger.error('BudgetRepository.deleteTransaction failed', error);
      throw new Error('Failed to delete transaction');
    }
  }

  async findCategories(userId: UUID): Promise<BudgetCategory[]> {
    const { data, error } = await this.db
      .from('budget_categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('name', { ascending: true });

    if (error) {
      this.logger.error('BudgetRepository.findCategories failed', error);
      return [];
    }
    return (data ?? []) as BudgetCategory[];
  }

  async findCategoryById(id: UUID): Promise<BudgetCategory | null> {
    const { data, error } = await this.db
      .from('budget_categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as BudgetCategory;
  }

  async createCategory(userId: UUID, data: CreateCategoryDtoType): Promise<BudgetCategory> {
    const { data: cat, error } = await this.db
      .from('budget_categories')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error || !cat) {
      this.logger.error('BudgetRepository.createCategory failed', error);
      throw new Error('Failed to create category');
    }
    return cat as BudgetCategory;
  }

  async getSummary(userId: UUID, month: number, year: number): Promise<BudgetSummary> {
    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    // Monthly transactions with category info
    const { data: monthlyTxs } = await this.db
      .from('budget_transactions')
      .select('*, category:budget_categories(*)')
      .eq('user_id', userId)
      .gte('date', from)
      .lte('date', to);

    const txs = (monthlyTxs ?? []) as BudgetTransaction[];

    const totalIncome = txs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = txs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Running all-time balance
    const { data: allTxs } = await this.db
      .from('budget_transactions')
      .select('type, amount')
      .eq('user_id', userId);

    const runningBalance = ((allTxs ?? []) as Pick<BudgetTransaction, 'type' | 'amount'>[]).reduce(
      (sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0,
    );

    // By category breakdown
    const categoryMap = new Map<string, { name: string; color: string; type: 'income' | 'expense'; total: number }>();
    for (const tx of txs) {
      const key = tx.category_id ?? '__uncategorized__';
      const existing = categoryMap.get(key);
      if (existing) {
        existing.total += Number(tx.amount);
      } else {
        categoryMap.set(key, {
          name: tx.category?.name ?? 'Uncategorized',
          color: tx.category?.color ?? '#94a3b8',
          type: tx.type,
          total: Number(tx.amount),
        });
      }
    }

    const typeTotal = { income: totalIncome || 1, expense: totalExpenses || 1 };
    const byCategory: CategorySummary[] = Array.from(categoryMap.entries()).map(([key, v]) => ({
      category_id: key === '__uncategorized__' ? null : key,
      category_name: v.name,
      category_color: v.color,
      type: v.type,
      total: v.total,
      percentage: Math.round((v.total / typeTotal[v.type]) * 100),
    }));

    // Monthly trend — last 12 months
    const trendFrom = new Date(year, month - 13, 1).toISOString().split('T')[0];
    const { data: trendTxs } = await this.db
      .from('budget_transactions')
      .select('type, amount, date')
      .eq('user_id', userId)
      .gte('date', trendFrom)
      .lte('date', to);

    const trendMap = new Map<string, { income: number; expenses: number }>();
    for (const tx of (trendTxs ?? []) as Pick<BudgetTransaction, 'type' | 'amount' | 'date'>[]) {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const entry = trendMap.get(key) ?? { income: 0, expenses: 0 };
      if (tx.type === 'income') entry.income += Number(tx.amount);
      else entry.expenses += Number(tx.amount);
      trendMap.set(key, entry);
    }

    const monthlyTrend: MonthlyTrend[] = Array.from(trendMap.entries())
      .map(([key, v]) => {
        const [y, m] = key.split('-').map(Number);
        return { month: m, year: y, income: v.income, expenses: v.expenses, net: v.income - v.expenses };
      })
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

    // Monthly limit (from budgets table)
    const { data: plan } = await this.db
      .from('budgets')
      .select('monthly_limit')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();

    return {
      month,
      year,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_balance: totalIncome - totalExpenses,
      running_balance: runningBalance,
      monthly_limit: plan?.monthly_limit ? Number(plan.monthly_limit) : null,
      by_category: byCategory,
      monthly_trend: monthlyTrend,
    };
  }
}
