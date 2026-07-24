import { UUID } from '@/shared/types';

export interface RawEntryCount {
  logged_date: string;
  count: number;
}

export interface RawHabit {
  id: UUID;
  name: string;
}

export interface RawHabitEntry {
  habit_id: UUID;
  logged_date: string;
}

export interface IAnalyticsRepository {
  getEntryCountsByDate(userId: UUID, from: string, to: string): Promise<RawEntryCount[]>;
  getTotalHabits(userId: UUID): Promise<number>;
  getActiveHabits(userId: UUID): Promise<number>;
  getHabits(userId: UUID): Promise<RawHabit[]>;
  getAllEntryDatesByHabits(userId: UUID): Promise<RawHabitEntry[]>;
}
