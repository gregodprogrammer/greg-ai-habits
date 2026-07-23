'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/shared/utils/api-client';
import { StatCard } from '@/shared/ui/stat-card';
import { BudgetSummary, BudgetTransaction, BudgetCategory, AIConversation } from '@/shared/types';
import { Spinner } from '@/shared/ui/spinner';

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function monthName(m: number) {
  return new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' });
}

// ─── sub-components ─────────────────────────────────────────────────────────

function TransactionRow({
  tx,
  onDelete,
}: {
  tx: BudgetTransaction;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: tx.category?.color ?? '#94a3b8' }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate font-medium">{tx.description}</p>
          <p className="text-xs text-muted-foreground">
            {tx.date} · {tx.category?.name ?? 'Uncategorized'}
            {tx.is_recurring && ' · Recurring'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span
          className={`font-semibold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
        >
          {tx.type === 'income' ? '+' : '-'}{fmt(Number(tx.amount))}
        </span>
        <button
          onClick={() => onDelete(tx.id)}
          aria-label={`Delete transaction: ${tx.description}`}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function AddTransactionModal({
  categories,
  onClose,
  onSave,
}: {
  categories: BudgetCategory[];
  onClose: () => void;
  onSave: (tx: BudgetTransaction) => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    date: today,
    category_id: '',
    is_recurring: false,
    recurring_interval: '' as '' | 'daily' | 'weekly' | 'monthly' | 'yearly',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        category_id: form.category_id || null,
        is_recurring: form.is_recurring,
        recurring_interval: form.is_recurring && form.recurring_interval ? form.recurring_interval : null,
        notes: form.notes || null,
      };
      const tx = await apiFetch<BudgetTransaction>('/api/budget', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      onSave(tx);
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
      aria-labelledby="add-tx-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
        <h2 id="add-tx-title" className="mb-5 text-lg font-semibold">Add Transaction</h2>

        {error && (
          <p role="alert" className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <fieldset>
            <legend className="mb-1 text-sm font-medium">Type</legend>
            <div className="flex gap-2">
              {(['income', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  aria-pressed={form.type === t}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.type === t
                      ? t === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                        : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Amount */}
          <div>
            <label htmlFor="tx-amount" className="mb-1 block text-sm font-medium">Amount ($)</label>
            <input
              id="tx-amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="tx-description" className="mb-1 block text-sm font-medium">Description</label>
            <input
              id="tx-description"
              type="text"
              required
              maxLength={500}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="tx-date" className="mb-1 block text-sm font-medium">Date</label>
            <input
              id="tx-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="tx-category" className="mb-1 block text-sm font-medium">Category (optional)</label>
            <select
              id="tx-category"
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-2">
            <input
              id="tx-recurring"
              type="checkbox"
              checked={form.is_recurring}
              onChange={(e) => setForm((f) => ({ ...f, is_recurring: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="tx-recurring" className="text-sm font-medium">Recurring transaction</label>
          </div>

          {form.is_recurring && (
            <div>
              <label htmlFor="tx-interval" className="mb-1 block text-sm font-medium">Interval</label>
              <select
                id="tx-interval"
                value={form.recurring_interval}
                onChange={(e) => setForm((f) => ({ ...f, recurring_interval: e.target.value as typeof form.recurring_interval }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select interval</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

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
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BudgetCoachPanel() {
  const [messages, setMessages] = useState<AIConversation[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    apiFetch<AIConversation[]>('/api/ai/budget-coach')
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
      const result = await apiFetch<{ reply: string; history: AIConversation[] }>('/api/ai/budget-coach', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setMessages(result.history);
    } catch {
      // keep messages as-is on error
    } finally {
      setSending(false);
    }
  }

  return (
    <section aria-label="Budget AI Coach" className="flex flex-col rounded-xl border border-border bg-card shadow-sm h-[480px]">
      <div className="border-b border-border px-5 py-3">
        <h2 className="font-semibold text-sm">Budget Coach</h2>
        <p className="text-xs text-muted-foreground">Ask about your spending, savings, or budget goals</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite" aria-label="Conversation">
        {loadingHistory && (
          <div className="flex justify-center pt-4"><Spinner /></div>
        )}
        {!loadingHistory && messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground pt-6">
            Ask your budget coach anything about your finances.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted rounded-tl-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-muted-foreground">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="border-t border-border px-4 py-3 flex gap-2">
        <label htmlFor="coach-input" className="sr-only">Message your budget coach</label>
        <input
          id="coach-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your budget coach…"
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

export default function BudgetPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadSummary = useCallback(async (m: number, y: number) => {
    setLoadingSummary(true);
    try {
      const data = await apiFetch<BudgetSummary>(`/api/budget/summary?month=${m}&year=${y}`);
      setSummary(data);
    } catch {
      setError('Failed to load summary');
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const loadTransactions = useCallback(async (m: number, y: number) => {
    setLoadingTx(true);
    try {
      const data = await apiFetch<BudgetTransaction[]>(`/api/budget?month=${m}&year=${y}&limit=100`);
      setTransactions(data);
    } catch {
      // keep existing
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    apiFetch<BudgetCategory[]>('/api/budget/categories')
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadSummary(month, year);
    loadTransactions(month, year);
  }, [month, year, loadSummary, loadTransactions]);

  function handlePrevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function handleNextMonth() {
    const today = new Date();
    if (year > today.getFullYear() || (year === today.getFullYear() && month >= today.getMonth() + 1)) return;
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/budget/${id}`, { method: 'DELETE' });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      loadSummary(month, year);
    } catch {
      setError('Failed to delete transaction');
    }
  }

  function handleSaved(tx: BudgetTransaction) {
    setShowModal(false);
    setTransactions((prev) => [tx, ...prev]);
    loadSummary(month, year);
  }

  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Budget Tracker</h1>
          <p className="text-sm text-muted-foreground">Track income, expenses, and financial goals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + Add Transaction
        </button>
      </div>

      {/* Month navigator */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevMonth}
          aria-label="Previous month"
          className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
        >
          ‹
        </button>
        <span className="text-sm font-medium min-w-[120px] text-center">
          {monthName(month)} {year}
        </span>
        <button
          onClick={handleNextMonth}
          aria-label="Next month"
          className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
        >
          ›
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Summary cards */}
      {loadingSummary ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : summary ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Income" value={fmt(summary.total_income)} sub={monthName(month)} />
          <StatCard label="Expenses" value={fmt(summary.total_expenses)} sub={monthName(month)} />
          <StatCard
            label="Net"
            value={fmt(summary.net_balance)}
            sub={summary.net_balance >= 0 ? 'surplus' : 'deficit'}
          />
          <StatCard label="All-Time Balance" value={fmt(summary.running_balance)} />
        </div>
      ) : null}

      {/* Budget limit warning */}
      {summary?.monthly_limit && summary.total_expenses > summary.monthly_limit && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          You have exceeded your monthly budget limit of {fmt(summary.monthly_limit)} by {fmt(summary.total_expenses - summary.monthly_limit)}.
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Transactions (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Expenses */}
          <section aria-label="Expenses">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Expenses ({expenseTransactions.length})
            </h2>
            {loadingTx ? (
              <div className="flex justify-center py-4"><Spinner /></div>
            ) : expenseTransactions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No expenses recorded for {monthName(month)} {year}.
              </p>
            ) : (
              <div className="space-y-2">
                {expenseTransactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>

          {/* Income */}
          <section aria-label="Income">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Income ({incomeTransactions.length})
            </h2>
            {loadingTx ? (
              <div className="flex justify-center py-4"><Spinner /></div>
            ) : incomeTransactions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No income recorded for {monthName(month)} {year}.
              </p>
            ) : (
              <div className="space-y-2">
                {incomeTransactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* AI Coach (2/5) */}
        <div className="lg:col-span-2">
          <BudgetCoachPanel />
        </div>
      </div>

      {/* Category breakdown */}
      {summary && summary.by_category.length > 0 && (
        <section aria-label="Spending by category">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">By Category</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.by_category
              .sort((a, b) => b.total - a.total)
              .map((c) => (
                <div key={`${c.category_id}-${c.type}`} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.category_color }} aria-hidden="true" />
                    <span className="text-sm font-medium truncate">{c.category_name}</span>
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${c.type === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xl font-bold">{fmt(c.total)}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.percentage}%`, backgroundColor: c.category_color }}
                      role="progressbar"
                      aria-valuenow={c.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${c.category_name}: ${c.percentage}%`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{c.percentage}% of {c.type}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Monthly trend */}
      {summary && summary.monthly_trend.length > 1 && (
        <section aria-label="Monthly trend">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Monthly Trend</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium">Month</th>
                  <th className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">Income</th>
                  <th className="px-4 py-3 text-right font-medium text-red-600 dark:text-red-400">Expenses</th>
                  <th className="px-4 py-3 text-right font-medium">Net</th>
                </tr>
              </thead>
              <tbody>
                {summary.monthly_trend.map((row) => (
                  <tr key={`${row.year}-${row.month}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{monthName(row.month)} {row.year}</td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{fmt(row.income)}</td>
                    <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">{fmt(row.expenses)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${row.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {fmt(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Add transaction modal */}
      {showModal && (
        <AddTransactionModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSaved}
        />
      )}
    </div>
  );
}
