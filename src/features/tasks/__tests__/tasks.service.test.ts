import { TasksService } from '../tasks.service';
import { ITasksRepository } from '../tasks.repository.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { ForbiddenError, NotFoundError } from '@/shared/utils/errors';
import { Task, TaskProject, TaskStats } from '@/shared/types';

const mockTask: Task = {
  id: 'task-1',
  user_id: 'user-1',
  project_id: null,
  title: 'Write unit tests',
  description: null,
  status: 'todo',
  priority: 'medium',
  due_date: null,
  completed_at: null,
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z',
};

const mockProject: TaskProject = {
  id: 'proj-1',
  user_id: 'user-1',
  name: 'Work',
  color: '#6366f1',
  description: null,
  is_archived: false,
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z',
};

const mockStats: TaskStats = {
  total: 5,
  todo: 3,
  in_progress: 1,
  done: 1,
  cancelled: 0,
  overdue: 0,
  due_today: 0,
  due_this_week: 2,
  completion_rate: 20,
  by_priority: [{ priority: 'medium', count: 5 }],
  by_project: [{ project_id: null, project_name: 'No project', count: 5 }],
};

const mockLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

const mockRepo: jest.Mocked<ITasksRepository> = {
  findTasks: jest.fn(),
  findTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  findProjects: jest.fn(),
  findProjectById: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  getStats: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService(mockRepo, mockLogger);
  });

  describe('getTaskById', () => {
    it('returns task when found and user matches', async () => {
      mockRepo.findTaskById.mockResolvedValue(mockTask);
      const result = await service.getTaskById('task-1', 'user-1');
      expect(result).toEqual(mockTask);
    });

    it('throws NotFoundError when task does not exist', async () => {
      mockRepo.findTaskById.mockResolvedValue(null);
      await expect(service.getTaskById('task-1', 'user-1')).rejects.toThrow(NotFoundError);
    });

    it('throws ForbiddenError when task belongs to another user', async () => {
      mockRepo.findTaskById.mockResolvedValue(mockTask);
      await expect(service.getTaskById('task-1', 'user-2')).rejects.toThrow(ForbiddenError);
    });
  });

  describe('createTask', () => {
    it('delegates to repository and returns created task', async () => {
      mockRepo.createTask.mockResolvedValue(mockTask);
      const dto = { title: 'Write unit tests', status: 'todo' as const, priority: 'medium' as const };
      const result = await service.createTask('user-1', dto);
      expect(mockRepo.createTask).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('sets completed_at when marking done', async () => {
      mockRepo.findTaskById.mockResolvedValue(mockTask);
      mockRepo.updateTask.mockResolvedValue({ ...mockTask, status: 'done', completed_at: expect.any(String) });
      await service.updateTask('task-1', 'user-1', { status: 'done' });
      expect(mockRepo.updateTask).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({ status: 'done', completed_at: expect.any(String) }),
      );
    });

    it('clears completed_at when un-marking done', async () => {
      mockRepo.findTaskById.mockResolvedValue({ ...mockTask, status: 'done', completed_at: '2025-07-01T00:00:00Z' });
      mockRepo.updateTask.mockResolvedValue({ ...mockTask, status: 'todo', completed_at: null });
      await service.updateTask('task-1', 'user-1', { status: 'todo' });
      expect(mockRepo.updateTask).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({ status: 'todo', completed_at: null }),
      );
    });
  });

  describe('deleteTask', () => {
    it('deletes task belonging to user', async () => {
      mockRepo.findTaskById.mockResolvedValue(mockTask);
      mockRepo.deleteTask.mockResolvedValue();
      await expect(service.deleteTask('task-1', 'user-1')).resolves.toBeUndefined();
      expect(mockRepo.deleteTask).toHaveBeenCalledWith('task-1');
    });
  });

  describe('createProject', () => {
    it('delegates to repository', async () => {
      mockRepo.createProject.mockResolvedValue(mockProject);
      const result = await service.createProject('user-1', { name: 'Work' });
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('throws ForbiddenError when project belongs to another user', async () => {
      mockRepo.findProjectById.mockResolvedValue(mockProject);
      await expect(service.updateProject('proj-1', 'user-2', { name: 'X' })).rejects.toThrow(ForbiddenError);
    });
  });

  describe('getStats', () => {
    it('delegates to repository', async () => {
      mockRepo.getStats.mockResolvedValue(mockStats);
      const result = await service.getStats('user-1');
      expect(result).toEqual(mockStats);
    });
  });
});
