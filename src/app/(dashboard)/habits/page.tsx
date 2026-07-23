'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/shared/types';
import { Spinner } from '@/shared/ui/spinner';
import { apiFetch } from '@/shared/utils/api-client';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];

type HabitForm = {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  target_count: number;
  color: string;
};

const emptyForm: HabitForm = {
  name: '',
  description: '',
  frequency: 'daily',
  target_count: 1,
  color: COLORS[0],
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState<HabitForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loggedToday, setLoggedToday] = useState<Set<string>>(new Set());
  const [loggingId, setLoggingId] = useState<string | null>(null);

  const loadHabits = useCallback(async () => {
    try {
      setError('');
      const data = await apiFetch<Habit[]>('/api/habits');
      setHabits(data.filter((h) => !h.is_archived));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHabits(); }, [loadHabits]);

  function openCreate() {
    setEditingHabit(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit);
    setForm({
      name: habit.name,
      description: habit.description ?? '',
      frequency: habit.frequency,
      target_count: habit.target_count,
      color: habit.color ?? COLORS[0],
    });
    setFormError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    setSaving(true);
    setFormError('');
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        frequency: form.frequency,
        target_count: form.target_count,
        color: form.color,
      };
      if (editingHabit) {
        await apiFetch<unknown>(`/api/habits/${editingHabit.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await apiFetch<unknown>('/api/habits', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      await loadHabits();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(habit: Habit) {
    if (!confirm(`Delete "${habit.name}"?`)) return;
    try {
      await apiFetch<unknown>(`/api/habits/${habit.id}`, { method: 'DELETE' });
      await loadHabits();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  async function handleLogToday(habit: Habit) {
    if (loggedToday.has(habit.id) || loggingId === habit.id) return;
    setLoggingId(habit.id);
    try {
      await apiFetch<unknown>(`/api/habits/${habit.id}/entries`, {
        method: 'POST',
        body: JSON.stringify({ logged_date: today() }),
      });
      setLoggedToday((prev) => new Set([...prev, habit.id]));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Log failed');
    } finally {
      setLoggingId(null);
    }
  }

  const modalTitleId = 'habit-modal-title';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Habits</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + New Habit
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && habits.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-8 py-16 text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No habits yet</p>
          <p className="text-sm">Create your first habit to get started.</p>
        </div>
      )}

      {!loading && habits.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color ?? '#6366f1' }}
                  />
                  <span className="font-semibold text-sm truncate">{habit.name}</span>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                  {habit.frequency}
                </span>
              </div>

              {habit.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{habit.description}</p>
              )}

              <p className="text-xs text-muted-foreground">
                Target: {habit.target_count}× per {habit.frequency === 'daily' ? 'day' : 'week'}
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleLogToday(habit)}
                  disabled={loggedToday.has(habit.id) || loggingId === habit.id}
                  className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {loggingId === habit.id ? <Spinner size={12} /> : loggedToday.has(habit.id) ? 'Logged ✓' : 'Log Today'}
                </button>
                <button
                  onClick={() => openEdit(habit)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(habit)}
                  className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h2 id={modalTitleId} className="text-lg font-bold">
              {editingHabit ? 'Edit Habit' : 'New Habit'}
            </h2>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="habit-name" className="block text-sm font-medium">Name *</label>
              <input
                id="habit-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={200}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. Morning run"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="habit-description" className="block text-sm font-medium">Description</label>
              <textarea
                id="habit-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                maxLength={1000}
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Optional"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="habit-frequency" className="block text-sm font-medium">Frequency</label>
                <select
                  id="habit-frequency"
                  value={form.frequency}
                  onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as 'daily' | 'weekly' }))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="habit-target" className="block text-sm font-medium">Target count</label>
                <input
                  id="habit-target"
                  type="number"
                  min={1}
                  max={100}
                  value={form.target_count}
                  onChange={(e) => setForm((f) => ({ ...f, target_count: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <fieldset className="space-y-1.5">
              <legend className="block text-sm font-medium">Color</legend>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Select color ${c}`}
                    aria-pressed={form.color === c}
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      outline: form.color === c ? '2px solid white' : 'none',
                      boxShadow: form.color === c ? `0 0 0 3px ${c}` : 'none',
                    }}
                  />
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {saving && <Spinner size={14} />}
                {saving ? 'Saving…' : editingHabit ? 'Save changes' : 'Create habit'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
