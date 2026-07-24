import { Task, TaskProject, TaskStats, UUID } from '@/shared/types';
import { CreateTaskDtoType } from './dtos/create-task.dto';
import { UpdateTaskDtoType } from './dtos/update-task.dto';
import { CreateProjectDtoType, UpdateProjectDtoType } from './dtos/create-project.dto';
import { TaskQueryDtoType } from './dtos/task-query.dto';

export interface ITasksRepository {
  findTasks(userId: UUID, query: TaskQueryDtoType): Promise<Task[]>;
  findTaskById(id: UUID): Promise<Task | null>;
  createTask(userId: UUID, data: CreateTaskDtoType): Promise<Task>;
  updateTask(id: UUID, data: UpdateTaskDtoType & { completed_at?: string | null }): Promise<Task>;
  deleteTask(id: UUID): Promise<void>;

  findProjects(userId: UUID): Promise<TaskProject[]>;
  findProjectById(id: UUID): Promise<TaskProject | null>;
  createProject(userId: UUID, data: CreateProjectDtoType): Promise<TaskProject>;
  updateProject(id: UUID, data: UpdateProjectDtoType): Promise<TaskProject>;
  deleteProject(id: UUID): Promise<void>;

  getStats(userId: UUID): Promise<TaskStats>;
}
