import { HabitsService } from '../habits.service';
import { IHabitsRepository } from '../habits.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AppError, ForbiddenError, NotFoundError } from '@/shared/utils/errors';
import { Habit, HabitEntry } from '@/shared/types';
import { HABITS } from '@/config/constants';

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

const mockEntry: HabitEntry = {
  id: 'entry-1',
  habit_id: 'habit-1',
  user_id: 'user-1',
  logged_date: '2024-07-25',
  note: null,
  created_at: '2024-07-25T10:00:00Z',
  updated_at: '2024-07-25T10:00:00Z',
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
  findCountByUser: jest.fn(),
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

  // ── getAll ──────────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('delegates to repository and returns all habits', async () => {
      mockRepo.findAllByUser.mockResolvedValue([mockHabit]);
      const result = await service.getAll('user-1');
      expect(mockRepo.findAllByUser).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockHabit]);
    });
  });

  // ── getById ─────────────────────────────────────────────────────────────────

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

  // ── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates habit when user is below the limit', async () => {
      mockRepo.findCountByUser.mockResolvedValue(0);
      mockRepo.create.mockResolvedValue(mockHabit);
      const result = await service.create('user-1', {
        name: 'Test Habit',
        frequency: 'daily',
        target_count: 1,
      });
      expect(mockRepo.create).toHaveBeenCalledWith('user-1', expect.objectContaining({ name: 'Test Habit' }));
      expect(result).toEqual(mockHabit);
    });

    it('throws AppError when user has reached MAX_PER_USER habits', async () => {
      mockRepo.findCountByUser.mockResolvedValue(HABITS.MAX_PER_USER);
      await expect(
        service.create('user-1', { name: 'Overflow Habit', frequency: 'daily', target_count: 1 }),
      ).rejects.toThrow(AppError);
    });

    it('does not call repository create when limit is exceeded', async () => {
      mockRepo.findCountByUser.mockResolvedValue(HABITS.MAX_PER_USER);
      await expect(
        service.create('user-1', { name: 'X', frequency: 'daily', target_count: 1 }),
      ).rejects.toThrow();
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  // ── update ──────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('verifies ownership then delegates to repository', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      mockRepo.update.mockResolvedValue({ ...mockHabit, name: 'Updated' });
      const result = await service.update('habit-1', 'user-1', { name: 'Updated' });
      expect(mockRepo.update).toHaveBeenCalledWith('habit-1', 'user-1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('throws ForbiddenError when habit belongs to another user', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      await expect(service.update('habit-1', 'user-2', { name: 'X' })).rejects.toThrow(ForbiddenError);
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when habit does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update('habit-1', 'user-1', { name: 'X' })).rejects.toThrow(NotFoundError);
    });
  });

  // ── delete ──────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('verifies ownership then deletes the habit', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      mockRepo.delete.mockResolvedValue(undefined);
      await service.delete('habit-1', 'user-1');
      expect(mockRepo.delete).toHaveBeenCalledWith('habit-1', 'user-1');
    });

    it('throws ForbiddenError when habit belongs to another user', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      await expect(service.delete('habit-1', 'user-2')).rejects.toThrow(ForbiddenError);
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when habit does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.delete('habit-1', 'user-1')).rejects.toThrow(NotFoundError);
    });
  });

  // ── logEntry ────────────────────────────────────────────────────────────────

  describe('logEntry', () => {
    it('verifies ownership then logs the entry', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      mockRepo.logEntry.mockResolvedValue(mockEntry);
      const result = await service.logEntry('habit-1', 'user-1', { logged_date: '2024-07-25' });
      expect(mockRepo.logEntry).toHaveBeenCalledWith('habit-1', 'user-1', '2024-07-25', undefined);
      expect(result).toEqual(mockEntry);
    });

    it('passes the note when provided', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      mockRepo.logEntry.mockResolvedValue({ ...mockEntry, note: 'Good run!' });
      await service.logEntry('habit-1', 'user-1', { logged_date: '2024-07-25', note: 'Good run!' });
      expect(mockRepo.logEntry).toHaveBeenCalledWith('habit-1', 'user-1', '2024-07-25', 'Good run!');
    });

    it('throws ForbiddenError when habit belongs to another user', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      await expect(
        service.logEntry('habit-1', 'user-2', { logged_date: '2024-07-25' }),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  // ── deleteEntry ─────────────────────────────────────────────────────────────

  describe('deleteEntry', () => {
    it('verifies ownership then deletes the entry', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      mockRepo.deleteEntry.mockResolvedValue(undefined);
      await service.deleteEntry('habit-1', 'user-1', '2024-07-25');
      expect(mockRepo.findById).toHaveBeenCalledWith('habit-1');
      expect(mockRepo.deleteEntry).toHaveBeenCalledWith('habit-1', '2024-07-25');
    });

    it('throws NotFoundError when habit does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.deleteEntry('habit-1', 'user-1', '2024-07-25')).rejects.toThrow(NotFoundError);
    });

    it('throws ForbiddenError when habit belongs to another user', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      await expect(service.deleteEntry('habit-1', 'user-2', '2024-07-25')).rejects.toThrow(ForbiddenError);
    });
  });

  // ── getEntries ──────────────────────────────────────────────────────────────

  describe('getEntries', () => {
    it('verifies ownership then returns entries for the habit', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      mockRepo.getEntriesByHabit.mockResolvedValue([mockEntry]);
      const result = await service.getEntries('habit-1', 'user-1', '2024-07-01', '2024-07-31');
      expect(mockRepo.getEntriesByHabit).toHaveBeenCalledWith('habit-1', '2024-07-01', '2024-07-31');
      expect(result).toEqual([mockEntry]);
    });

    it('throws ForbiddenError when habit belongs to another user', async () => {
      mockRepo.findById.mockResolvedValue(mockHabit);
      await expect(
        service.getEntries('habit-1', 'user-2', '2024-07-01', '2024-07-31'),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  // ── getAllEntries ────────────────────────────────────────────────────────────

  describe('getAllEntries', () => {
    it('delegates to repository and returns all entries for the user', async () => {
      mockRepo.getEntriesByUser.mockResolvedValue([mockEntry]);
      const result = await service.getAllEntries('user-1', '2024-07-01', '2024-07-31');
      expect(mockRepo.getEntriesByUser).toHaveBeenCalledWith('user-1', '2024-07-01', '2024-07-31');
      expect(result).toEqual([mockEntry]);
    });
  });
});
