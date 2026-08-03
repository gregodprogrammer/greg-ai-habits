import { Habit, HabitEntry, UUID } from '@/shared/types';
import { CreateHabitDtoType } from './dtos/create-habit.dto';
import { UpdateHabitDtoType } from './dtos/update-habit.dto';

export interface IHabitsRepository {
  findAllByUser(userId: UUID): Promise<Habit[]>;
  findById(id: UUID): Promise<Habit | null>;
  findCountByUser(userId: UUID): Promise<number>;
  create(userId: UUID, data: CreateHabitDtoType): Promise<Habit>;
  update(id: UUID, userId: UUID, data: UpdateHabitDtoType): Promise<Habit>;
  delete(id: UUID, userId: UUID): Promise<void>;

  logEntry(habitId: UUID, userId: UUID, date: string, note?: string): Promise<HabitEntry>;
  deleteEntry(habitId: UUID, date: string): Promise<void>;
  getEntriesByUser(userId: UUID, from: string, to: string): Promise<HabitEntry[]>;
  getEntriesByHabit(habitId: UUID, from: string, to: string): Promise<HabitEntry[]>;
}
