import { Task, TaskProject, TaskStats, UUID } from '@/shared/types';
import { CreateTaskDtoType } from './dtos/create-task.dto';
import { UpdateTaskDtoType } from './dtos/update-task.dto';
import { CreateProjectDtoType, UpdateProjectDtoType } from './dtos/create-project.dto';
import { TaskQueryDtoType } from './dtos/task-query.dto';

export interface ITasksService {
  getTasks(userId: UUID, query: TaskQueryDtoType): Promise<Task[]>;
  getTaskById(id: UUID, userId: UUID): Promise<Task>;
  createTask(userId: UUID, dto: CreateTaskDtoType): Promise<Task>;
  updateTask(id: UUID, userId: UUID, dto: UpdateTaskDtoType): Promise<Task>;
  deleteTask(id: UUID, userId: UUID): Promise<void>;

  getProjects(userId: UUID): Promise<TaskProject[]>;
  createProject(userId: UUID, dto: CreateProjectDtoType): Promise<TaskProject>;
  updateProject(id: UUID, userId: UUID, dto: UpdateProjectDtoType): Promise<TaskProject>;
  deleteProject(id: UUID, userId: UUID): Promise<void>;

  getStats(userId: UUID): Promise<TaskStats>;
}
