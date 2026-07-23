import { BudgetCategory, BudgetSummary, BudgetTransaction, UUID } from '@/shared/types';
import { CreateCategoryDtoType } from './dtos/create-category.dto';
import { CreateTransactionDtoType } from './dtos/create-transaction.dto';
import { UpdateTransactionDtoType } from './dtos/update-transaction.dto';
import { BudgetQueryDtoType } from './dtos/budget-query.dto';

export interface IBudgetRepository {
  // Transactions
  findTransactions(userId: UUID, query: BudgetQueryDtoType): Promise<BudgetTransaction[]>;
  findTransactionById(id: UUID): Promise<BudgetTransaction | null>;
  createTransaction(userId: UUID, data: CreateTransactionDtoType): Promise<BudgetTransaction>;
  updateTransaction(id: UUID, data: UpdateTransactionDtoType): Promise<BudgetTransaction>;
  deleteTransaction(id: UUID): Promise<void>;

  // Categories
  findCategories(userId: UUID): Promise<BudgetCategory[]>;
  findCategoryById(id: UUID): Promise<BudgetCategory | null>;
  createCategory(userId: UUID, data: CreateCategoryDtoType): Promise<BudgetCategory>;

  // Summary
  getSummary(userId: UUID, month: number, year: number): Promise<BudgetSummary>;
}
