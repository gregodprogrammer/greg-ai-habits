-- Migration 002: Budget module + AI conversation namespacing

-- Add module column to ai_conversations so habits and budget keep separate histories
ALTER TABLE public.ai_conversations
  ADD COLUMN IF NOT EXISTS module TEXT NOT NULL DEFAULT 'habits';

CREATE INDEX IF NOT EXISTS idx_ai_conversations_module
  ON public.ai_conversations(user_id, module);

-- Budget categories
CREATE TABLE IF NOT EXISTS public.budget_categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  color       TEXT        NOT NULL DEFAULT '#6366f1',
  icon        TEXT,
  is_archived BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id
  ON public.budget_categories(user_id);

-- Budget transactions (actual income / expense records)
CREATE TABLE IF NOT EXISTS public.budget_transactions (
  id                  UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id         UUID           REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  type                TEXT           NOT NULL CHECK (type IN ('income', 'expense')),
  amount              NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description         TEXT           NOT NULL,
  date                DATE           NOT NULL DEFAULT CURRENT_DATE,
  is_recurring        BOOLEAN        NOT NULL DEFAULT FALSE,
  recurring_interval  TEXT           CHECK (recurring_interval IN ('daily', 'weekly', 'monthly', 'yearly')),
  notes               TEXT,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_transactions_user_id
  ON public.budget_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_date
  ON public.budget_transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_type
  ON public.budget_transactions(user_id, type);

-- Budget plans (optional monthly spending limits per user)
CREATE TABLE IF NOT EXISTS public.budgets (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month         INTEGER        NOT NULL CHECK (month BETWEEN 1 AND 12),
  year          INTEGER        NOT NULL CHECK (year >= 2000),
  monthly_limit NUMERIC(12, 2),
  notes         TEXT,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);

-- Triggers for updated_at
CREATE OR REPLACE TRIGGER trg_budget_categories_updated_at
  BEFORE UPDATE ON public.budget_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_budget_transactions_updated_at
  BEFORE UPDATE ON public.budget_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
