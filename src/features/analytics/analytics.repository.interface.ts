import { UUID } from '@/shared/types';

export interface RawEntryCount {
  logged_date: string;
  count: number;
}

export interface IAnalyticsRepository {
  getEntryCountsByDate(userId: UUID, from: string, to: string): Promise<RawEntryCount[]>;
  getTotalHabits(userId: UUID): Promise<number>;
  getActiveHabits(userId: UUID): Promise<number>;
}
