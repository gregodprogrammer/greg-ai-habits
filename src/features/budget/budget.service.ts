import { IBudgetService } from './budget.service.interface';
import { IBudgetRepository } from './budget.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { BudgetCategory, BudgetSummary, BudgetTransaction, UUID } from '@/shared/types';
import { CreateCategoryDtoType } from './dtos/create-category.dto';
import { CreateTransactionDtoType } from './dtos/create-transaction.dto';
import { UpdateTransactionDtoType } from './dtos/update-transaction.dto';
import { BudgetQueryDtoType } from './dtos/budget-query.dto';
import { ForbiddenError, NotFoundError } from '@/shared/utils/errors';

export class BudgetService implements IBudgetService {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly logger: ILogger,
  ) {}

  async getTransactions(userId: UUID, query: BudgetQueryDtoType): Promise<BudgetTransaction[]> {
    return this.budgetRepository.findTransactions(userId, query);
  }

  async createTransaction(userId: UUID, dto: CreateTransactionDtoType): Promise<BudgetTransaction> {
    this.logger.info('BudgetService.createTransaction', { userId, type: dto.type });
    return this.budgetRepository.createTransaction(userId, dto);
  }

  async updateTransaction(id: UUID, userId: UUID, dto: UpdateTransactionDtoType): Promise<BudgetTransaction> {
    const tx = await this.budgetRepository.findTransactionById(id);
    if (!tx) throw new NotFoundError('Transaction');
    if (tx.user_id !== userId) throw new ForbiddenError();
    return this.budgetRepository.updateTransaction(id, dto);
  }

  async deleteTransaction(id: UUID, userId: UUID): Promise<void> {
    const tx = await this.budgetRepository.findTransactionById(id);
    if (!tx) throw new NotFoundError('Transaction');
    if (tx.user_id !== userId) throw new ForbiddenError();
    await this.budgetRepository.deleteTransaction(id);
  }

  async getCategories(userId: UUID): Promise<BudgetCategory[]> {
    return this.budgetRepository.findCategories(userId);
  }

  async createCategory(userId: UUID, dto: CreateCategoryDtoType): Promise<BudgetCategory> {
    this.logger.info('BudgetService.createCategory', { userId });
    return this.budgetRepository.createCategory(userId, dto);
  }

  async getSummary(userId: UUID, month: number, year: number): Promise<BudgetSummary> {
    return this.budgetRepository.getSummary(userId, month, year);
  }
}
