-- Migration 004: Row Level Security policies for all public tables
--
-- This migration enables RLS and adds policies that allow:
--   - The service role to do everything (bypasses RLS by default, but explicit
--     policies are added defensively to prevent future confusion).
--   - Authenticated users to read/write their own rows.
--
-- Apply in: Supabase Dashboard → SQL Editor → Run

-- ── users ────────────────────────────────────────────────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (bypasses RLS by default, explicit for clarity)
CREATE POLICY "service_role_all_users"
  ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read their own row
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Authenticated users can update their own row
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── habits ───────────────────────────────────────────────────────────────────

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_habits"
  ON public.habits FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "habits_all_own"
  ON public.habits FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── habit_entries ─────────────────────────────────────────────────────────────

ALTER TABLE public.habit_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_habit_entries"
  ON public.habit_entries FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "habit_entries_all_own"
  ON public.habit_entries FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── ai_conversations ──────────────────────────────────────────────────────────

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_ai_conversations"
  ON public.ai_conversations FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "ai_conversations_all_own"
  ON public.ai_conversations FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── budget_categories ─────────────────────────────────────────────────────────

ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_budget_categories"
  ON public.budget_categories FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "budget_categories_all_own"
  ON public.budget_categories FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── budget_transactions ───────────────────────────────────────────────────────

ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_budget_transactions"
  ON public.budget_transactions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "budget_transactions_all_own"
  ON public.budget_transactions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── budgets ───────────────────────────────────────────────────────────────────

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_budgets"
  ON public.budgets FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "budgets_all_own"
  ON public.budgets FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── task_projects ─────────────────────────────────────────────────────────────

ALTER TABLE public.task_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_task_projects"
  ON public.task_projects FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "task_projects_all_own"
  ON public.task_projects FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── tasks ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_tasks"
  ON public.tasks FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "tasks_all_own"
  ON public.tasks FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
