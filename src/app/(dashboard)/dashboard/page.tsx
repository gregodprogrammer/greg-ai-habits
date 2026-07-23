'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalyticsSummary, Habit } from '@/shared/types';
import { Spinner } from '@/shared/ui/spinner';
import { StatCard } from '@/shared/ui/stat-card';
import { apiFetch } from '@/shared/utils/api-client';
import { ROUTES } from '@/config/constants';

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<AnalyticsSummary>('/api/analytics'),
      apiFetch<Habit[]>('/api/habits'),
    ])
      .then(([s, h]) => {
        setSummary(s);
        setHabits(h.filter((hab: Habit) => !hab.is_archived).slice(0, 5));
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size={28} /></div>;

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  const pct = summary ? Math.round(summary.overall_completion_rate * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your habit overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Habits" value={summary?.active_habits ?? 0} sub={`of ${summary?.total_habits ?? 0} total`} />
        <StatCard label="Completion Rate" value={`${pct}%`} sub="all time" />
        <StatCard label="Current Streak" value={summary?.current_streak ?? 0} sub="days" />
        <StatCard label="Longest Streak" value={summary?.longest_streak ?? 0} sub="days" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Your Habits</h2>
          <Link
            href={ROUTES.HABITS}
            className="text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        {habits.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No habits yet.{' '}
            <Link href={ROUTES.HABITS} className="text-primary hover:underline underline-offset-4">
              Create one
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {habits.map((h) => (
              <li key={h.id} className="flex items-center gap-3 px-5 py-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: h.color ?? '#6366f1' }}
                />
                <span className="flex-1 text-sm font-medium truncate">{h.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{h.frequency}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {summary && summary.weekly_completions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="font-semibold">Last 7 Days</h2>
          <div className="flex items-end gap-2 h-24">
            {summary.weekly_completions.slice(-7).map((wc) => {
              const maxCount = Math.max(...summary.weekly_completions.map((x) => x.count), 1);
              const heightPct = (wc.count / maxCount) * 100;
              const label = new Date(wc.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div key={wc.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-foreground">{wc.count > 0 ? wc.count : ''}</span>
                  <div className="w-full rounded-sm bg-muted overflow-hidden" style={{ height: '64px' }}>
                    <div
                      className="w-full rounded-sm bg-primary transition-all"
                      style={{ height: `${heightPct}%`, marginTop: `${100 - heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
