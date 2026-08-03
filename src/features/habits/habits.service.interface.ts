import { Habit, HabitEntry, UUID } from '@/shared/types';
import { CreateHabitDtoType } from './dtos/create-habit.dto';
import { UpdateHabitDtoType } from './dtos/update-habit.dto';
import { LogEntryDtoType } from './dtos/log-entry.dto';

export interface IHabitsService {
  getAll(userId: UUID): Promise<Habit[]>;
  getById(id: UUID, userId: UUID): Promise<Habit>;
  create(userId: UUID, dto: CreateHabitDtoType): Promise<Habit>;
  update(id: UUID, userId: UUID, dto: UpdateHabitDtoType): Promise<Habit>;
  delete(id: UUID, userId: UUID): Promise<void>;
  logEntry(habitId: UUID, userId: UUID, dto: LogEntryDtoType): Promise<HabitEntry>;
  deleteEntry(habitId: UUID, userId: UUID, date: string): Promise<void>;
  getEntries(habitId: UUID, userId: UUID, from: string, to: string): Promise<HabitEntry[]>;
  getAllEntries(userId: UUID, from: string, to: string): Promise<HabitEntry[]>;
}
