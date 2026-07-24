'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/shared/utils/api-client';
import { StatCard } from '@/shared/ui/stat-card';
import { Spinner } from '@/shared/ui/spinner';
import { Task, TaskProject, TaskStats, TaskStatus, TaskPriority, AIConversation } from '@/shared/types';

// ─── helpers ────────────────────────────────────────────────────────────────

const PRIORITY_META: Record<TaskPriority, { label: string; color: string; ring: string }> = {
  low:    { label: 'Low',    color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',  ring: 'border-slate-300' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',      ring: 'border-blue-400' },
  high:   { label: 'High',   color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', ring: 'border-orange-400' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',          ring: 'border-red-500' },
};

const STATUS_TABS: { key: TaskStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

function isOverdue(task: Task) {
  if (!task.due_date || task.status === 'done' || task.status === 'cancelled') return false;
  return task.due_date < new Date().toISOString().split('T')[0];
}

// ─── task row ───────────────────────────────────────────────────────────────

function TaskRow({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  const isDone = task.status === 'done';
  const overdue = isOverdue(task);
  const p = PRIORITY_META[task.priority];

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-opacity ${isDone ? 'opacity-60' : ''} ${overdue ? 'border-red-300 dark:border-red-800' : 'border-border'} bg-card`}>
      <button
        onClick={() => onStatusChange(task.id, isDone ? 'todo' : 'done')}
        aria-label={isDone ? `Mark "${task.title}" as to do` : `Mark "${task.title}" as done`}
        className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-primary border-primary' : `${p.ring} hover:border-primary`}`}
      >
        {isDone && <span className="text-primary-foreground text-xs leading-none">✓</span>}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`font-medium truncate ${isDone ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.color}`}>
            {p.label}
          </span>
          {task.project && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color }} aria-hidden="true" />
              {task.project.name}
            </span>
          )}
          {task.due_date && (
            <span className={`text-xs ${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}`}>
              {overdue ? 'Overdue · ' : ''}{task.due_date}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.title}`}
        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
      >
        ×
      </button>
    </div>
  );
}

// ─── add task modal ──────────────────────────────────────────────────────────

function AddTaskModal({
  projects,
  onClose,
  onSave,
}: {
  projects: TaskProject[];
  onClose: () => void;
  onSave: (task: Task) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    project_id: '',
    priority: 'medium' as TaskPriority,
    due_date: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const task = await apiFetch<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          project_id: form.project_id || null,
          priority: form.priority,
          due_date: form.due_date || null,
          status: 'todo',
        }),
      });
      onSave(task);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
        <h2 id="add-task-title" className="mb-5 text-lg font-semibold">Add Task</h2>

        {error && (
          <p role="alert" className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium">Title</label>
            <input
              id="task-title"
              type="text"
              required
              maxLength={500}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="mb-1 block text-sm font-medium">Description (optional)</label>
            <textarea
              id="task-desc"
              rows={2}
              maxLength={5000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <fieldset>
            <legend className="mb-1 text-sm font-medium">Priority</legend>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  aria-pressed={form.priority === p}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                    form.priority === p
                      ? PRIORITY_META[p].color + ' border-current'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {PRIORITY_META[p].label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="task-project" className="mb-1 block text-sm font-medium">Project (optional)</label>
            <select
              id="task-project"
              value={form.project_id}
              onChange={(e) => setForm((f) => ({ ...f, project_id: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="task-due" className="mb-1 block text-sm font-medium">Due date (optional)</label>
            <input
              id="task-due"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Saving…' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── AI coach panel ──────────────────────────────────────────────────────────

function TaskCoachPanel() {
  const [messages, setMessages] = useState<AIConversation[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    apiFetch<AIConversation[]>('/api/ai/task-coach')
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    try {
      const result = await apiFetch<{ reply: string; history: AIConversation[] }>('/api/ai/task-coach', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setMessages(result.history);
    } catch {
      // keep messages as-is
    } finally {
      setSending(false);
    }
  }

  return (
    <section aria-label="Task AI Coach" className="flex flex-col rounded-xl border border-border bg-card shadow-sm h-[480px]">
      <div className="border-b border-border px-5 py-3">
        <h2 className="font-semibold text-sm">Productivity Coach</h2>
        <p className="text-xs text-muted-foreground">Get help with prioritisation, focus, and planning</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite" aria-label="Conversation">
        {loadingHistory && <div className="flex justify-center pt-4"><Spinner /></div>}
        {!loadingHistory && messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground pt-6">
            Ask your productivity coach for help with tasks and focus.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-muted-foreground">Thinking…</div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="border-t border-border px-4 py-3 flex gap-2">
        <label htmlFor="task-coach-input" className="sr-only">Message your productivity coach</label>
        <input
          id="task-coach-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your productivity coach…"
          disabled={sending}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Send
        </button>
      </form>
    </section>
  );
}

// ─── main page ──────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<TaskProject[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  const [filterProject, setFilterProject] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [taskData, statsData] = await Promise.all([
        apiFetch<Task[]>('/api/tasks?limit=200'),
        apiFetch<TaskStats>('/api/tasks/stats'),
      ]);
      setTasks(taskData);
      setStats(statsData);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    apiFetch<TaskProject[]>('/api/tasks/projects').then(setProjects).catch(() => {});
  }, [loadTasks]);

  async function handleStatusChange(id: string, status: TaskStatus) {
    try {
      const updated = await apiFetch<Task>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      // Refresh stats
      apiFetch<TaskStats>('/api/tasks/stats').then(setStats).catch(() => {});
    } catch {
      setError('Failed to update task');
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      apiFetch<TaskStats>('/api/tasks/stats').then(setStats).catch(() => {});
    } catch {
      setError('Failed to delete task');
    }
  }

  function handleSaved(task: Task) {
    setShowModal(false);
    setTasks((prev) => [task, ...prev]);
    apiFetch<TaskStats>('/api/tasks/stats').then(setStats).catch(() => {});
  }

  const filtered = tasks.filter((t) => {
    if (activeTab !== 'all' && t.status !== activeTab) return false;
    if (filterProject && t.project_id !== filterProject) return false;
    return true;
  });

  const overdueTasks = tasks.filter(isOverdue);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-sm text-muted-foreground">Organise your work, track progress, stay focused</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + Add Task
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="To Do" value={stats.todo} sub={`${stats.in_progress} in progress`} />
          <StatCard label="Done" value={stats.done} sub={`${stats.completion_rate}% rate`} />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            sub={stats.due_today > 0 ? `${stats.due_today} due today` : undefined}
          />
        </div>
      )}

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}: {overdueTasks.slice(0, 3).map((t) => t.title).join(', ')}{overdueTasks.length > 3 ? '…' : ''}
        </div>
      )}

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Task list (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex rounded-lg border border-border overflow-hidden" role="tablist" aria-label="Filter by status">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Project filter */}
            {projects.length > 0 && (
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                aria-label="Filter by project"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All projects</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {activeTab === 'all' ? 'No tasks yet. Add your first task above.' : `No ${activeTab.replace('_', ' ')} tasks.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2" role="list" aria-label="Tasks">
              {filtered.map((task) => (
                <div key={task.id} role="listitem">
                  <TaskRow task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Coach (2/5) */}
        <div className="lg:col-span-2">
          <TaskCoachPanel />
        </div>
      </div>

      {showModal && (
        <AddTaskModal projects={projects} onClose={() => setShowModal(false)} onSave={handleSaved} />
      )}
    </div>
  );
}
