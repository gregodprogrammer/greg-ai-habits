import { HabitsService } from '../habits.service';
import { IHabitsRepository } from '../habits.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { ForbiddenError, NotFoundError } from '@/shared/utils/errors';
import { Habit } from '@/shared/types';

const mockHabit: Habit = {
  id: 'habit-1',
  user_id: 'user-1',
  name: 'Test Habit',
  description: null,
  frequency: 'daily',
  target_count: 1,
  color: null,
  is_archived: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

const mockRepo: jest.Mocked<IHabitsRepository> = {
  findAllByUser: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  logEntry: jest.fn(),
  deleteEntry: jest.fn(),
  getEntriesByUser: jest.fn(),
  getEntriesByHabit: jest.fn(),
};

describe('HabitsService', () => {
  let service: HabitsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HabitsService(mockRepo, mockLogger);
  });

  describe('getById', () => {
    it('returns habit when found and user matches', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      const result = await service.getById('habit-1', 'user-1');
      expect(result).toEqual(mockHabit);
    });

    it('throws NotFoundError when habit does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getById('habit-1', 'user-1')).rejects.toThrow(NotFoundError);
    });

    it('throws ForbiddenError when habit belongs to another user', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      await expect(service.getById('habit-1', 'user-2')).rejects.toThrow(ForbiddenError);
    });
  });

  describe('create', () => {
    it('delegates to repository and returns created habit', async () => {
      mockRepo.create.mockResolvedValue(mockHabit);
      const result = await service.create('user-1', {
        name: 'Test Habit',
        frequency: 'daily',
        target_count: 1,
      });
      expect(mockRepo.create).toHaveBeenCalledWith('user-1', expect.objectContaining({ name: 'Test Habit' }));
      expect(result).toEqual(mockHabit);
    });
  });
});
