import { BudgetCategory, BudgetSummary, BudgetTransaction, UUID } from '@/shared/types';
import { CreateCategoryDtoType } from './dtos/create-category.dto';
import { CreateTransactionDtoType } from './dtos/create-transaction.dto';
import { UpdateTransactionDtoType } from './dtos/update-transaction.dto';
import { BudgetQueryDtoType } from './dtos/budget-query.dto';

export interface IBudgetService {
  getTransactions(userId: UUID, query: BudgetQueryDtoType): Promise<BudgetTransaction[]>;
  createTransaction(userId: UUID, dto: CreateTransactionDtoType): Promise<BudgetTransaction>;
  updateTransaction(id: UUID, userId: UUID, dto: UpdateTransactionDtoType): Promise<BudgetTransaction>;
  deleteTransaction(id: UUID, userId: UUID): Promise<void>;

  getCategories(userId: UUID): Promise<BudgetCategory[]>;
  createCategory(userId: UUID, dto: CreateCategoryDtoType): Promise<BudgetCategory>;

  getSummary(userId: UUID, month: number, year: number): Promise<BudgetSummary>;
}
