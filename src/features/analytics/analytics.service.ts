import { IAnalyticsService } from './analytics.service.interface';
import { IAnalyticsRepository } from './analytics.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AnalyticsSummary, UUID } from '@/shared/types';

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly logger: ILogger,
  ) {}

  async getSummary(userId: UUID, from?: string, to?: string): Promise<AnalyticsSummary> {
    const toDate = to ?? new Date().toISOString().split('T')[0];
    const fromDate = from ?? this.subtractDays(toDate, 30);

    const [totalHabits, activeHabits, countsByDate] = await Promise.all([
      this.analyticsRepository.getTotalHabits(userId),
      this.analyticsRepository.getActiveHabits(userId),
      this.analyticsRepository.getEntryCountsByDate(userId, fromDate, toDate),
    ]);

    const dayCount = this.daysBetween(fromDate, toDate);
    const totalCompletions = countsByDate.reduce((sum, r) => sum + r.count, 0);
    const possibleCompletions = activeHabits * dayCount;
    const overallRate = possibleCompletions > 0 ? totalCompletions / possibleCompletions : 0;

    const weeklyCompletions = countsByDate.map((r) => ({
      date: r.logged_date,
      count: r.count,
    }));

    this.logger.debug('AnalyticsService.getSummary', { userId, fromDate, toDate });

    return {
      total_habits: totalHabits,
      active_habits: activeHabits,
      overall_completion_rate: Math.round(overallRate * 100) / 100,
      current_streak: 0,
      longest_streak: 0,
      weekly_completions: weeklyCompletions,
      habit_stats: [],
    };
  }

  private subtractDays(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  private daysBetween(from: string, to: string): number {
    const msPerDay = 86_400_000;
    return Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / msPerDay));
  }
}
