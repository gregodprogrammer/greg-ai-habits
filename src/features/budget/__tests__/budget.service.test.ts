import { BudgetService } from '../budget.service';
import { IBudgetRepository } from '../budget.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { ForbiddenError, NotFoundError } from '@/shared/utils/errors';
import { BudgetTransaction, BudgetSummary } from '@/shared/types';

const mockTransaction: BudgetTransaction = {
  id: 'tx-1',
  user_id: 'user-1',
  category_id: null,
  type: 'expense',
  amount: 50,
  description: 'Groceries',
  date: '2025-07-01',
  is_recurring: false,
  recurring_interval: null,
  notes: null,
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z',
};

const mockSummary: BudgetSummary = {
  month: 7,
  year: 2025,
  total_income: 3000,
  total_expenses: 1500,
  net_balance: 1500,
  running_balance: 5000,
  monthly_limit: null,
  by_category: [],
  monthly_trend: [],
};

const mockLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

const mockRepo: jest.Mocked<IBudgetRepository> = {
  findTransactions: jest.fn(),
  findTransactionById: jest.fn(),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  findCategories: jest.fn(),
  findCategoryById: jest.fn(),
  createCategory: jest.fn(),
  getSummary: jest.fn(),
};

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BudgetService(mockRepo, mockLogger);
  });

  describe('getTransactions', () => {
    it('delegates to repository', async () => {
      mockRepo.findTransactions.mockResolvedValue([mockTransaction]);
      const result = await service.getTransactions('user-1', { limit: 50 });
      expect(mockRepo.findTransactions).toHaveBeenCalledWith('user-1', { limit: 50 });
      expect(result).toEqual([mockTransaction]);
    });
  });

  describe('createTransaction', () => {
    it('delegates to repository and returns created transaction', async () => {
      mockRepo.createTransaction.mockResolvedValue(mockTransaction);
      const dto = { type: 'expense' as const, amount: 50, description: 'Groceries', date: '2025-07-01', is_recurring: false };
      const result = await service.createTransaction('user-1', dto);
      expect(mockRepo.createTransaction).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('updateTransaction', () => {
    it('updates when transaction belongs to user', async () => {
      mockRepo.findTransactionById.mockResolvedValue(mockTransaction);
      mockRepo.updateTransaction.mockResolvedValue({ ...mockTransaction, description: 'Updated' });
      const result = await service.updateTransaction('tx-1', 'user-1', { description: 'Updated' });
      expect(result.description).toBe('Updated');
    });

    it('throws NotFoundError when transaction does not exist', async () => {
      mockRepo.findTransactionById.mockResolvedValue(null);
      await expect(service.updateTransaction('tx-1', 'user-1', {})).rejects.toThrow(NotFoundError);
    });

    it('throws ForbiddenError when transaction belongs to another user', async () => {
      mockRepo.findTransactionById.mockResolvedValue(mockTransaction);
      await expect(service.updateTransaction('tx-1', 'user-2', {})).rejects.toThrow(ForbiddenError);
    });
  });

  describe('deleteTransaction', () => {
    it('deletes when transaction belongs to user', async () => {
      mockRepo.findTransactionById.mockResolvedValue(mockTransaction);
      mockRepo.deleteTransaction.mockResolvedValue();
      await expect(service.deleteTransaction('tx-1', 'user-1')).resolves.toBeUndefined();
      expect(mockRepo.deleteTransaction).toHaveBeenCalledWith('tx-1');
    });

    it('throws ForbiddenError when transaction belongs to another user', async () => {
      mockRepo.findTransactionById.mockResolvedValue(mockTransaction);
      await expect(service.deleteTransaction('tx-1', 'user-2')).rejects.toThrow(ForbiddenError);
    });
  });

  describe('getSummary', () => {
    it('delegates to repository with month and year', async () => {
      mockRepo.getSummary.mockResolvedValue(mockSummary);
      const result = await service.getSummary('user-1', 7, 2025);
      expect(mockRepo.getSummary).toHaveBeenCalledWith('user-1', 7, 2025);
      expect(result).toEqual(mockSummary);
    });
  });

  describe('createCategory', () => {
    it('delegates to repository', async () => {
      const mockCat = { id: 'cat-1', user_id: 'user-1', name: 'Food', type: 'expense' as const, color: '#6366f1', icon: null, is_archived: false, created_at: '', updated_at: '' };
      mockRepo.createCategory.mockResolvedValue(mockCat);
      const dto = { name: 'Food', type: 'expense' as const };
      const result = await service.createCategory('user-1', dto);
      expect(result).toEqual(mockCat);
    });
  });
});
