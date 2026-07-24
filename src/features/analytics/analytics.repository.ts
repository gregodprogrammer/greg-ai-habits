import { SupabaseClient } from '@supabase/supabase-js';
import { IAnalyticsRepository, RawEntryCount, RawHabit, RawHabitEntry } from './analytics.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { UUID } from '@/shared/types';

export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async getEntryCountsByDate(userId: UUID, from: string, to: string): Promise<RawEntryCount[]> {
    const { data, error } = await this.db
      .from('habit_entries')
      .select('logged_date')
      .eq('user_id', userId)
      .gte('logged_date', from)
      .lte('logged_date', to);

    if (error) {
      this.logger.error('AnalyticsRepository.getEntryCountsByDate failed', error);
      return [];
    }

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const key = row.logged_date as string;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries()).map(([logged_date, count]) => ({ logged_date, count }));
  }

  async getTotalHabits(userId: UUID): Promise<number> {
    const { count } = await this.db
      .from('habits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    return count ?? 0;
  }

  async getActiveHabits(userId: UUID): Promise<number> {
    const { count } = await this.db
      .from('habits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false);
    return count ?? 0;
  }

  async getHabits(userId: UUID): Promise<RawHabit[]> {
    const { data, error } = await this.db
      .from('habits')
      .select('id, name')
      .eq('user_id', userId)
      .eq('is_archived', false);
    if (error) {
      this.logger.error('AnalyticsRepository.getHabits failed', error);
      return [];
    }
    return (data ?? []) as RawHabit[];
  }

  async getAllEntryDatesByHabits(userId: UUID): Promise<RawHabitEntry[]> {
    const { data, error } = await this.db
      .from('habit_entries')
      .select('habit_id, logged_date')
      .eq('user_id', userId)
      .order('logged_date', { ascending: true });
    if (error) {
      this.logger.error('AnalyticsRepository.getAllEntryDatesByHabits failed', error);
      return [];
    }
    return (data ?? []) as RawHabitEntry[];
  }
}
