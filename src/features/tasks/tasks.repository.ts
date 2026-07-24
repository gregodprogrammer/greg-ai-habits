import { SupabaseClient } from '@supabase/supabase-js';
import { ITasksRepository } from './tasks.repository.interface';
import { Task, TaskPriority, TaskProject, TaskStats, UUID } from '@/shared/types';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { CreateTaskDtoType } from './dtos/create-task.dto';
import { UpdateTaskDtoType } from './dtos/update-task.dto';
import { CreateProjectDtoType, UpdateProjectDtoType } from './dtos/create-project.dto';
import { TaskQueryDtoType } from './dtos/task-query.dto';
import { NotFoundError } from '@/shared/utils/errors';

export class TasksRepository implements ITasksRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async findTasks(userId: UUID, query: TaskQueryDtoType): Promise<Task[]> {
    let q = this.db
      .from('tasks')
      .select('*, project:task_projects(*)')
      .eq('user_id', userId)
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(query.limit ?? 100);

    if (query.status) q = q.eq('status', query.status);
    if (query.priority) q = q.eq('priority', query.priority);
    if (query.project_id) q = q.eq('project_id', query.project_id);
    if (query.overdue) {
      const today = new Date().toISOString().split('T')[0];
      q = q.lt('due_date', today).not('status', 'in', '("done","cancelled")');
    }

    const { data, error } = await q;
    if (error) {
      this.logger.error('TasksRepository.findTasks failed', error);
      return [];
    }
    return (data ?? []) as Task[];
  }

  async findTaskById(id: UUID): Promise<Task | null> {
    const { data, error } = await this.db
      .from('tasks')
      .select('*, project:task_projects(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Task;
  }

  async createTask(userId: UUID, data: CreateTaskDtoType): Promise<Task> {
    const { data: task, error } = await this.db
      .from('tasks')
      .insert({ ...data, user_id: userId })
      .select('*, project:task_projects(*)')
      .single();

    if (error || !task) {
      this.logger.error('TasksRepository.createTask failed', error);
      throw new Error('Failed to create task');
    }
    return task as Task;
  }

  async updateTask(id: UUID, data: UpdateTaskDtoType & { completed_at?: string | null }): Promise<Task> {
    const { data: task, error } = await this.db
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select('*, project:task_projects(*)')
      .single();

    if (error || !task) {
      this.logger.error('TasksRepository.updateTask failed', error);
      throw new NotFoundError('Task');
    }
    return task as Task;
  }

  async deleteTask(id: UUID): Promise<void> {
    const { error } = await this.db.from('tasks').delete().eq('id', id);
    if (error) {
      this.logger.error('TasksRepository.deleteTask failed', error);
      throw new Error('Failed to delete task');
    }
  }

  async findProjects(userId: UUID): Promise<TaskProject[]> {
    const { data, error } = await this.db
      .from('task_projects')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('name', { ascending: true });

    if (error) {
      this.logger.error('TasksRepository.findProjects failed', error);
      return [];
    }
    return (data ?? []) as TaskProject[];
  }

  async findProjectById(id: UUID): Promise<TaskProject | null> {
    const { data, error } = await this.db.from('task_projects').select('*').eq('id', id).single();
    if (error) return null;
    return data as TaskProject;
  }

  async createProject(userId: UUID, data: CreateProjectDtoType): Promise<TaskProject> {
    const { data: project, error } = await this.db
      .from('task_projects')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error || !project) {
      this.logger.error('TasksRepository.createProject failed', error);
      throw new Error('Failed to create project');
    }
    return project as TaskProject;
  }

  async updateProject(id: UUID, data: UpdateProjectDtoType): Promise<TaskProject> {
    const { data: project, error } = await this.db
      .from('task_projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error || !project) {
      this.logger.error('TasksRepository.updateProject failed', error);
      throw new NotFoundError('Project');
    }
    return project as TaskProject;
  }

  async deleteProject(id: UUID): Promise<void> {
    const { error } = await this.db.from('task_projects').delete().eq('id', id);
    if (error) {
      this.logger.error('TasksRepository.deleteProject failed', error);
      throw new Error('Failed to delete project');
    }
  }

  async getStats(userId: UUID): Promise<TaskStats> {
    const today = new Date().toISOString().split('T')[0];
    const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: tasks } = await this.db
      .from('tasks')
      .select('status, priority, due_date, project_id, project:task_projects(name)')
      .eq('user_id', userId);

    const all = (tasks ?? []) as unknown as Array<{
      status: string;
      priority: string;
      due_date: string | null;
      project_id: string | null;
      project: { name: string } | null;
    }>;

    const active = all.filter((t) => t.status !== 'cancelled');
    const done = all.filter((t) => t.status === 'done');

    const overdue = all.filter(
      (t) => t.due_date && t.due_date < today && t.status !== 'done' && t.status !== 'cancelled',
    ).length;

    const dueToday = all.filter(
      (t) => t.due_date === today && t.status !== 'done' && t.status !== 'cancelled',
    ).length;

    const dueThisWeek = all.filter(
      (t) =>
        t.due_date &&
        t.due_date >= today &&
        t.due_date <= weekEnd &&
        t.status !== 'done' &&
        t.status !== 'cancelled',
    ).length;

    const priorityMap = new Map<string, number>();
    const projectMap = new Map<string, { name: string; count: number }>();

    for (const t of all) {
      priorityMap.set(t.priority, (priorityMap.get(t.priority) ?? 0) + 1);
      const key = t.project_id ?? '__none__';
      const existing = projectMap.get(key);
      if (existing) existing.count++;
      else projectMap.set(key, { name: t.project?.name ?? 'No project', count: 1 });
    }

    return {
      total: all.length,
      todo: all.filter((t) => t.status === 'todo').length,
      in_progress: all.filter((t) => t.status === 'in_progress').length,
      done: done.length,
      cancelled: all.filter((t) => t.status === 'cancelled').length,
      overdue,
      due_today: dueToday,
      due_this_week: dueThisWeek,
      completion_rate: active.length > 0 ? Math.round((done.length / active.length) * 100) : 0,
      by_priority: Array.from(priorityMap.entries()).map(([priority, count]) => ({
        priority: priority as TaskPriority,
        count,
      })),
      by_project: Array.from(projectMap.entries()).map(([project_id, v]) => ({
        project_id: project_id === '__none__' ? null : project_id,
        project_name: v.name,
        count: v.count,
      })),
    };
  }
}
