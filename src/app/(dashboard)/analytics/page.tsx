'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnalyticsSummary } from '@/shared/types';
import { Spinner } from '@/shared/ui/spinner';
import { StatCard } from '@/shared/ui/stat-card';
import { apiFetch } from '@/shared/utils/api-client';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      const qs = params.toString();
      const data = await apiFetch<AnalyticsSummary>(`/api/analytics${qs ? `?${qs}` : ''}`);
      setSummary(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load('', ''); }, [load]);

  const pct = summary ? Math.round(summary.overall_completion_rate * 100) : 0;
  const maxCount = summary ? Math.max(...summary.weekly_completions.map((x) => x.count), 1) : 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your habit performance over time</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label htmlFor="analytics-from" className="block text-xs font-medium text-muted-foreground">From</label>
          <input
            id="analytics-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="analytics-to" className="block text-xs font-medium text-muted-foreground">To</label>
          <input
            id="analytics-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => load(from, to)}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Apply
        </button>
        {(from || to) && (
          <button
            onClick={() => { setFrom(''); setTo(''); load('', ''); }}
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner size={28} /></div>}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && summary && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Active Habits" value={summary.active_habits} sub={`of ${summary.total_habits} total`} />
            <StatCard label="Completion Rate" value={`${pct}%`} />
            <StatCard label="Current Streak" value={summary.current_streak} sub="days" />
            <StatCard label="Longest Streak" value={summary.longest_streak} sub="days" />
          </div>

          {summary.weekly_completions.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h2 className="font-semibold">Daily Completions</h2>
              <div className="overflow-x-auto">
                <div className="flex items-end gap-1.5 h-32 min-w-max">
                  {summary.weekly_completions.map((wc) => {
                    const heightPct = (wc.count / maxCount) * 100;
                    const dateLabel = new Date(wc.date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    return (
                      <div key={wc.date} className="flex flex-col items-center gap-1" style={{ minWidth: '36px' }}>
                        <span className="text-[10px] font-medium text-foreground">{wc.count > 0 ? wc.count : ''}</span>
                        <div className="w-7 rounded-sm bg-muted overflow-hidden flex flex-col justify-end" style={{ height: '80px' }}>
                          <div
                            className="w-full rounded-sm bg-primary"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground whitespace-nowrap">{dateLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {summary.habit_stats.length > 0 && (
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-semibold">Per-Habit Stats</h2>
              </div>
              <div className="divide-y divide-border">
                {summary.habit_stats.map((stat) => {
                  const rate = Math.round(stat.completion_rate * 100);
                  return (
                    <div key={stat.habit_id} className="flex items-center gap-4 px-5 py-3">
                      <span className="flex-1 text-sm font-medium truncate">{stat.habit_name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10 text-right">{rate}%</span>
                        <span className="text-xs text-muted-foreground w-20 text-right">
                          {stat.current_streak}d streak
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {summary.habit_stats.length === 0 && summary.total_habits === 0 && (
            <div className="rounded-xl border border-border bg-card px-8 py-16 text-center text-muted-foreground">
              <p>No data yet. Start logging habits to see analytics.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
