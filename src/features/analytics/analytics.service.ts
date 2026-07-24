import { IAnalyticsService } from './analytics.service.interface';
import { IAnalyticsRepository } from './analytics.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AnalyticsSummary, HabitStat, UUID } from '@/shared/types';

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly logger: ILogger,
  ) {}

  async getSummary(userId: UUID, from?: string, to?: string): Promise<AnalyticsSummary> {
    const today = new Date().toISOString().split('T')[0];
    const toDate = to ?? today;
    const fromDate = from ?? this.subtractDays(toDate, 30);

    const [totalHabits, activeHabits, countsByDate, habits, allEntries] = await Promise.all([
      this.analyticsRepository.getTotalHabits(userId),
      this.analyticsRepository.getActiveHabits(userId),
      this.analyticsRepository.getEntryCountsByDate(userId, fromDate, toDate),
      this.analyticsRepository.getHabits(userId),
      this.analyticsRepository.getAllEntryDatesByHabits(userId),
    ]);

    const dayCount = this.daysBetween(fromDate, toDate);
    const totalCompletions = countsByDate.reduce((sum, r) => sum + r.count, 0);
    const possibleCompletions = activeHabits * dayCount;
    const overallRate = possibleCompletions > 0 ? totalCompletions / possibleCompletions : 0;

    const weeklyCompletions = countsByDate.map((r) => ({
      date: r.logged_date,
      count: r.count,
    }));

    // User-level streak: a day counts if any habit was logged that day
    const uniqueDates = [...new Set(allEntries.map((e) => e.logged_date))].sort();
    const currentStreak = this.computeCurrentStreak(uniqueDates, today);
    const longestStreak = this.computeLongestStreak(uniqueDates);

    // Per-habit entry dates grouped by habit_id (all-time, for streak + windowed completion)
    const entriesByHabit = new Map<UUID, string[]>();
    for (const entry of allEntries) {
      const dates = entriesByHabit.get(entry.habit_id) ?? [];
      dates.push(entry.logged_date);
      entriesByHabit.set(entry.habit_id, dates);
    }

    const habitStats: HabitStat[] = habits.map((habit) => {
      const allHabitDates = (entriesByHabit.get(habit.id) ?? []).sort();
      const windowCount = allHabitDates.filter((d) => d >= fromDate && d <= toDate).length;
      const completionRate = dayCount > 0 ? Math.round((windowCount / dayCount) * 100) / 100 : 0;
      return {
        habit_id: habit.id,
        habit_name: habit.name,
        completion_rate: completionRate,
        current_streak: this.computeCurrentStreak(allHabitDates, today),
      };
    });

    this.logger.debug('AnalyticsService.getSummary', { userId, fromDate, toDate });

    return {
      total_habits: totalHabits,
      active_habits: activeHabits,
      overall_completion_rate: Math.round(overallRate * 100) / 100,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      weekly_completions: weeklyCompletions,
      habit_stats: habitStats,
    };
  }

  private computeCurrentStreak(sortedDates: string[], today: string): number {
    const dateSet = new Set(sortedDates);
    let streak = 0;
    let cursor = today;
    while (dateSet.has(cursor)) {
      streak++;
      cursor = this.subtractDays(cursor, 1);
    }
    // If today has no entry yet, the streak may still be live from yesterday
    if (streak === 0) {
      cursor = this.subtractDays(today, 1);
      while (dateSet.has(cursor)) {
        streak++;
        cursor = this.subtractDays(cursor, 1);
      }
    }
    return streak;
  }

  private computeLongestStreak(sortedDates: string[]): number {
    if (sortedDates.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = Math.round(
        (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86_400_000,
      );
      if (diffDays === 1) {
        current++;
        if (current > longest) longest = current;
      } else {
        current = 1;
      }
    }
    return longest;
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
