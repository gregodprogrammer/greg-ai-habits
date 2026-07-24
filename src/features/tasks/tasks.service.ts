import { ITasksService } from './tasks.service.interface';
import { ITasksRepository } from './tasks.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Task, TaskProject, TaskStats, UUID } from '@/shared/types';
import { CreateTaskDtoType } from './dtos/create-task.dto';
import { UpdateTaskDtoType } from './dtos/update-task.dto';
import { CreateProjectDtoType, UpdateProjectDtoType } from './dtos/create-project.dto';
import { TaskQueryDtoType } from './dtos/task-query.dto';
import { ForbiddenError, NotFoundError } from '@/shared/utils/errors';

export class TasksService implements ITasksService {
  constructor(
    private readonly tasksRepository: ITasksRepository,
    private readonly logger: ILogger,
  ) {}

  async getTasks(userId: UUID, query: TaskQueryDtoType): Promise<Task[]> {
    return this.tasksRepository.findTasks(userId, query);
  }

  async getTaskById(id: UUID, userId: UUID): Promise<Task> {
    const task = await this.tasksRepository.findTaskById(id);
    if (!task) throw new NotFoundError('Task');
    if (task.user_id !== userId) throw new ForbiddenError();
    return task;
  }

  async createTask(userId: UUID, dto: CreateTaskDtoType): Promise<Task> {
    this.logger.info('TasksService.createTask', { userId });
    return this.tasksRepository.createTask(userId, dto);
  }

  async updateTask(id: UUID, userId: UUID, dto: UpdateTaskDtoType): Promise<Task> {
    await this.getTaskById(id, userId);
    const patch: UpdateTaskDtoType & { completed_at?: string | null } = { ...dto };

    // Auto-set completed_at when marking done; clear it when un-marking
    if (dto.status === 'done') {
      patch.completed_at = new Date().toISOString();
    } else if (dto.status) {
      patch.completed_at = null;
    }

    return this.tasksRepository.updateTask(id, patch);
  }

  async deleteTask(id: UUID, userId: UUID): Promise<void> {
    await this.getTaskById(id, userId);
    await this.tasksRepository.deleteTask(id);
  }

  async getProjects(userId: UUID): Promise<TaskProject[]> {
    return this.tasksRepository.findProjects(userId);
  }

  async createProject(userId: UUID, dto: CreateProjectDtoType): Promise<TaskProject> {
    this.logger.info('TasksService.createProject', { userId });
    return this.tasksRepository.createProject(userId, dto);
  }

  async updateProject(id: UUID, userId: UUID, dto: UpdateProjectDtoType): Promise<TaskProject> {
    const project = await this.tasksRepository.findProjectById(id);
    if (!project) throw new NotFoundError('Project');
    if (project.user_id !== userId) throw new ForbiddenError();
    return this.tasksRepository.updateProject(id, dto);
  }

  async deleteProject(id: UUID, userId: UUID): Promise<void> {
    const project = await this.tasksRepository.findProjectById(id);
    if (!project) throw new NotFoundError('Project');
    if (project.user_id !== userId) throw new ForbiddenError();
    await this.tasksRepository.deleteProject(id);
  }

  async getStats(userId: UUID): Promise<TaskStats> {
    return this.tasksRepository.getStats(userId);
  }
}
