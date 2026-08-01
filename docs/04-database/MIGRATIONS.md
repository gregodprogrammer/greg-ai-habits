# Database Migrations

| Field | Value |
|---|---|
| **Purpose** | Migration history and instructions for applying schema changes |
| **Audience** | Engineers, Claude Code sessions applying migrations |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Database Schema](DATABASE-SCHEMA.md) · [Supabase Setup](SUPABASE-SETUP.md) |

---

## Migration Strategy

Migrations are plain SQL files stored in `src/infrastructure/db/migrations/`. They are applied
manually to the Supabase PostgreSQL database — either via the Supabase SQL Editor or `psql`.

There is no automated migration runner in this project yet. Each migration must be applied
in order and only once.

**Naming convention:** `NNN_description.sql` where `NNN` is zero-padded (001, 002, 003...).

---

## Migration History

| Migration | File | Date Applied | Status | Description |
|---|---|---|---|---|
| 001 | `001_initial.sql` | 2026-08-01 | Applied | Core tables: users, habits, habit_entries, ai_conversations |
| 002 | `002_budget.sql` | 2026-08-01 | Applied | Budget tables: categories, transactions, budgets; adds module column to ai_conversations |
| 003 | `003_tasks.sql` | 2026-08-01 | Applied | Task tables: task_projects, tasks |

---

## How to Apply a Migration

### Option A — Supabase SQL Editor (Recommended)

1. Open the Supabase dashboard.
2. Go to **SQL Editor** → **New query**.
3. Copy the contents of the migration file.
4. Paste into the editor and click **Run**.
5. Verify the tables appear in **Table Editor**.

### Option B — psql (requires PostgreSQL client)

```bash
psql $DATABASE_URL -f src/infrastructure/db/migrations/001_initial.sql
psql $DATABASE_URL -f src/infrastructure/db/migrations/002_budget.sql
psql $DATABASE_URL -f src/infrastructure/db/migrations/003_tasks.sql
```

Replace `$DATABASE_URL` with the actual connection string from `.env.local`.

---

## Migration 001 — Initial Schema

**File:** `src/infrastructure/db/migrations/001_initial.sql`

**Tables created:**
- `public.users` — application users (mirrors `auth.users`)
- `public.habits` — habit definitions
- `public.habit_entries` — daily/weekly habit log entries
- `public.ai_conversations` — AI chat history

**Extras:**
- `pgcrypto` extension for `gen_random_uuid()`.
- `update_updated_at()` trigger function.
- `updated_at` triggers on all tables.

---

## Migration 002 — Budget Module

**File:** `src/infrastructure/db/migrations/002_budget.sql`

**Tables created:**
- `public.budget_categories` — income/expense categories
- `public.budget_transactions` — individual financial transactions
- `public.budgets` — monthly budget plans

**Alterations:**
- Added `module TEXT NOT NULL DEFAULT 'habits'` column to `ai_conversations`.
- Added composite index `(user_id, module)` on `ai_conversations`.

---

## Migration 003 — Tasks Module

**File:** `src/infrastructure/db/migrations/003_tasks.sql`

**Tables created:**
- `public.task_projects` — project/list groupings for tasks
- `public.tasks` — individual task items

---

## Planned Future Migrations

| Migration | Description | Priority |
|---|---|---|
| 004 | Row Level Security policies for all tables | High — before production |
| 005 | CRM module tables (contacts, interactions) | Medium |
| 006 | Knowledge Base tables (documents, tags) | Medium |
| 007 | Career Assistant tables (resume, applications) | Low |

---

## Writing a New Migration

When adding a new feature that requires database changes:

1. Create a new file: `src/infrastructure/db/migrations/NNN_description.sql`.
2. Use `IF NOT EXISTS` for all `CREATE TABLE` and `CREATE INDEX` statements.
3. Use `IF NOT EXISTS` for `ADD COLUMN` statements.
4. Always add `updated_at` column and trigger for new tables.
5. Always add an index on `user_id` for user-scoped tables.
6. Document the new migration in this file immediately.
7. Update [DATABASE-SCHEMA.md](DATABASE-SCHEMA.md) with the new table definitions.
