import { IHabitsService } from './habits.service.interface';
import { IHabitsRepository } from './habits.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Habit, HabitEntry, UUID } from '@/shared/types';
import { CreateHabitDtoType } from './dtos/create-habit.dto';
import { UpdateHabitDtoType } from './dtos/update-habit.dto';
import { LogEntryDtoType } from './dtos/log-entry.dto';
import { AppError, ForbiddenError, NotFoundError } from '@/shared/utils/errors';
import { HABITS } from '@/config/constants';

export class HabitsService implements IHabitsService {
  constructor(
    private readonly habitsRepository: IHabitsRepository,
    private readonly logger: ILogger,
  ) {}

  async getAll(userId: UUID): Promise<Habit[]> {
    return this.habitsRepository.findAllByUser(userId);
  }

  async getById(id: UUID, userId: UUID): Promise<Habit> {
    const habit = await this.habitsRepository.findById(id);
    if (!habit) throw new NotFoundError('Habit');
    if (habit.user_id !== userId) throw new ForbiddenError();
    return habit;
  }

  async create(userId: UUID, dto: CreateHabitDtoType): Promise<Habit> {
    this.logger.info('HabitsService.create', { userId });
    const count = await this.habitsRepository.findCountByUser(userId);
    if (count >= HABITS.MAX_PER_USER) {
      throw new AppError(
        'LIMIT_EXCEEDED',
        `You have reached the maximum of ${HABITS.MAX_PER_USER} active habits`,
        422,
      );
    }
    return this.habitsRepository.create(userId, dto);
  }

  async update(id: UUID, userId: UUID, dto: UpdateHabitDtoType): Promise<Habit> {
    await this.getById(id, userId);
    return this.habitsRepository.update(id, userId, dto);
  }

  async delete(id: UUID, userId: UUID): Promise<void> {
    await this.getById(id, userId);
    await this.habitsRepository.delete(id, userId);
  }

  async logEntry(habitId: UUID, userId: UUID, dto: LogEntryDtoType): Promise<HabitEntry> {
    await this.getById(habitId, userId);
    return this.habitsRepository.logEntry(habitId, userId, dto.logged_date, dto.note);
  }

  async deleteEntry(habitId: UUID, userId: UUID, date: string): Promise<void> {
    await this.getById(habitId, userId);
    await this.habitsRepository.deleteEntry(habitId, date);
  }

  async getEntries(habitId: UUID, userId: UUID, from: string, to: string): Promise<HabitEntry[]> {
    await this.getById(habitId, userId);
    return this.habitsRepository.getEntriesByHabit(habitId, from, to);
  }

  async getAllEntries(userId: UUID, from: string, to: string): Promise<HabitEntry[]> {
    return this.habitsRepository.getEntriesByUser(userId, from, to);
  }
}
