import { SupabaseClient } from '@supabase/supabase-js';
import { IHabitsRepository } from './habits.repository.interface';
import { Habit, HabitEntry, UUID } from '@/shared/types';
import { CreateHabitDtoType } from './dtos/create-habit.dto';
import { UpdateHabitDtoType } from './dtos/update-habit.dto';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { NotFoundError } from '@/shared/utils/errors';

export class HabitsRepository implements IHabitsRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async findAllByUser(userId: UUID): Promise<Habit[]> {
    const { data, error } = await this.db
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('HabitsRepository.findAllByUser failed', error);
      return [];
    }
    return (data ?? []) as Habit[];
  }

  async findById(id: UUID): Promise<Habit | null> {
    const { data, error } = await this.db.from('habits').select('*').eq('id', id).single();
    if (error) return null;
    return data as Habit;
  }

  async create(userId: UUID, data: CreateHabitDtoType): Promise<Habit> {
    const { data: habit, error } = await this.db
      .from('habits')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error || !habit) {
      this.logger.error('HabitsRepository.create failed', error);
      throw new Error('Failed to create habit');
    }
    return habit as Habit;
  }

  async update(id: UUID, data: UpdateHabitDtoType): Promise<Habit> {
    const { data: habit, error } = await this.db
      .from('habits')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error || !habit) {
      this.logger.error('HabitsRepository.update failed', error);
      throw new NotFoundError('Habit');
    }
    return habit as Habit;
  }

  async delete(id: UUID): Promise<void> {
    const { error } = await this.db.from('habits').delete().eq('id', id);
    if (error) {
      this.logger.error('HabitsRepository.delete failed', error);
      throw new Error('Failed to delete habit');
    }
  }

  async logEntry(habitId: UUID, userId: UUID, date: string, note?: string): Promise<HabitEntry> {
    const { data, error } = await this.db
      .from('habit_entries')
      .upsert({ habit_id: habitId, user_id: userId, logged_date: date, note: note ?? null })
      .select()
      .single();

    if (error || !data) {
      this.logger.error('HabitsRepository.logEntry failed', error);
      throw new Error('Failed to log habit entry');
    }
    return data as HabitEntry;
  }

  async deleteEntry(habitId: UUID, date: string): Promise<void> {
    await this.db.from('habit_entries').delete().eq('habit_id', habitId).eq('logged_date', date);
  }

  async getEntriesByUser(userId: UUID, from: string, to: string): Promise<HabitEntry[]> {
    const { data } = await this.db
      .from('habit_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_date', from)
      .lte('logged_date', to)
      .order('logged_date', { ascending: false });
    return (data ?? []) as HabitEntry[];
  }

  async getEntriesByHabit(habitId: UUID, from: string, to: string): Promise<HabitEntry[]> {
    const { data } = await this.db
      .from('habit_entries')
      .select('*')
      .eq('habit_id', habitId)
      .gte('logged_date', from)
      .lte('logged_date', to)
      .order('logged_date', { ascending: true });
    return (data ?? []) as HabitEntry[];
  }
}
