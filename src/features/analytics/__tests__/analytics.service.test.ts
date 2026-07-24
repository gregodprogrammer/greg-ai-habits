import { AnalyticsService } from '../analytics.service';
import { IAnalyticsRepository } from '../analytics.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const today = dateOffset(0);
const d = (offset: number) => dateOffset(offset);

const mockLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

const mockRepo: jest.Mocked<IAnalyticsRepository> = {
  getEntryCountsByDate: jest.fn(),
  getTotalHabits: jest.fn(),
  getActiveHabits: jest.fn(),
  getHabits: jest.fn(),
  getAllEntryDatesByHabits: jest.fn(),
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AnalyticsService(mockRepo, mockLogger);
    mockRepo.getTotalHabits.mockResolvedValue(2);
    mockRepo.getActiveHabits.mockResolvedValue(2);
    mockRepo.getEntryCountsByDate.mockResolvedValue([]);
    mockRepo.getHabits.mockResolvedValue([]);
    mockRepo.getAllEntryDatesByHabits.mockResolvedValue([]);
  });

  describe('current_streak', () => {
    it('returns 0 when no entries exist', async () => {
      const result = await service.getSummary('user-1');
      expect(result.current_streak).toBe(0);
    });

    it('returns 1 when only today has an entry', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: today },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.current_streak).toBe(1);
    });

    it('counts consecutive days ending today', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-2) },
        { habit_id: 'h1', logged_date: d(-1) },
        { habit_id: 'h1', logged_date: today },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.current_streak).toBe(3);
    });

    it('counts consecutive days ending yesterday when today has no entry', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-3) },
        { habit_id: 'h1', logged_date: d(-2) },
        { habit_id: 'h1', logged_date: d(-1) },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.current_streak).toBe(3);
    });

    it('returns 0 when last entry has a gap before yesterday', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-4) },
        { habit_id: 'h1', logged_date: d(-3) },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.current_streak).toBe(0);
    });

    it('ignores duplicate entries for the same day when computing streak', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-1) },
        { habit_id: 'h2', logged_date: d(-1) },
        { habit_id: 'h1', logged_date: today },
        { habit_id: 'h2', logged_date: today },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.current_streak).toBe(2);
    });
  });

  describe('longest_streak', () => {
    it('returns 0 when no entries exist', async () => {
      const result = await service.getSummary('user-1');
      expect(result.longest_streak).toBe(0);
    });

    it('returns 1 for a single entry', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-10) },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.longest_streak).toBe(1);
    });

    it('returns the longest consecutive run across gaps', async () => {
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-10) },
        { habit_id: 'h1', logged_date: d(-9) },
        { habit_id: 'h1', logged_date: d(-8) },
        // gap at -7
        { habit_id: 'h1', logged_date: d(-6) },
        { habit_id: 'h1', logged_date: d(-5) },
        { habit_id: 'h1', logged_date: d(-4) },
        { habit_id: 'h1', logged_date: d(-3) },
        { habit_id: 'h1', logged_date: d(-2) },
      ]);
      const result = await service.getSummary('user-1');
      expect(result.longest_streak).toBe(5);
    });
  });

  describe('habit_stats', () => {
    it('returns empty array when no habits exist', async () => {
      const result = await service.getSummary('user-1');
      expect(result.habit_stats).toEqual([]);
    });

    it('computes completion_rate for each habit within the window', async () => {
      mockRepo.getHabits.mockResolvedValue([{ id: 'h1', name: 'Run' }]);
      // daysBetween(d(-10), today) = 10; 5 entries / 10 days = 0.5
      const from = d(-10);
      const to = today;
      // habit logged on 5 of the 10 days
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-9) },
        { habit_id: 'h1', logged_date: d(-8) },
        { habit_id: 'h1', logged_date: d(-7) },
        { habit_id: 'h1', logged_date: d(-6) },
        { habit_id: 'h1', logged_date: d(-5) },
      ]);
      const result = await service.getSummary('user-1', from, to);
      expect(result.habit_stats).toHaveLength(1);
      expect(result.habit_stats[0].habit_id).toBe('h1');
      expect(result.habit_stats[0].habit_name).toBe('Run');
      expect(result.habit_stats[0].completion_rate).toBe(0.5);
    });

    it('computes current_streak per habit', async () => {
      mockRepo.getHabits.mockResolvedValue([
        { id: 'h1', name: 'Run' },
        { id: 'h2', name: 'Read' },
      ]);
      mockRepo.getAllEntryDatesByHabits.mockResolvedValue([
        { habit_id: 'h1', logged_date: d(-2) },
        { habit_id: 'h1', logged_date: d(-1) },
        { habit_id: 'h1', logged_date: today },
        { habit_id: 'h2', logged_date: d(-5) },
      ]);
      const result = await service.getSummary('user-1');
      const h1Stat = result.habit_stats.find((s) => s.habit_id === 'h1')!;
      const h2Stat = result.habit_stats.find((s) => s.habit_id === 'h2')!;
      expect(h1Stat.current_streak).toBe(3);
      expect(h2Stat.current_streak).toBe(0);
    });
  });
});
