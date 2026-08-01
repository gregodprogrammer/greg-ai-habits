# Database Schema Reference

| Field | Value |
|---|---|
| **Purpose** | Complete reference for all database tables, columns, and relationships |
| **Audience** | Engineers, Claude Code sessions writing database queries |
| **Status** | Active — reflects migrations 001–003 |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Migrations](MIGRATIONS.md) · [Shared Types](../../src/shared/types/index.ts) |

---

## Entity Relationship Overview

```
auth.users (Supabase-managed)
     │
     │ mirrors to
     ▼
public.users ──────────────────────────────────────────────┐
     │                                                     │
     ├──[1:N]──► public.habits                             │
     │                │                                    │
     │                └──[1:N]──► public.habit_entries     │
     │                                                     │
     ├──[1:N]──► public.ai_conversations                   │
     │                                                     │
     ├──[1:N]──► public.budget_categories                  │
     │                                                     │
     ├──[1:N]──► public.budget_transactions                │
     │           (FK → budget_categories, nullable)        │
     │                                                     │
     ├──[1:N]──► public.budgets                            │
     │                                                     │
     ├──[1:N]──► public.task_projects                      │
     │                                                     │
     └──[1:N]──► public.tasks                              │
                 (FK → task_projects, nullable)            │
```

---

## Table: `public.users`

Application-level user record. Created immediately after Supabase Auth sign-up.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key; **must match `auth.users.id`** |
| `email` | TEXT | NOT NULL | — | Unique user email |
| `display_name` | TEXT | NULL | — | Optional display name |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Row creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated on change |

**Constraints:** `UNIQUE(email)`

---

## Table: `public.habits`

Habit definitions created by a user.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `name` | TEXT | NOT NULL | — | Display name of the habit |
| `description` | TEXT | NULL | — | Optional description |
| `frequency` | TEXT | NOT NULL | `'daily'` | `'daily'` or `'weekly'` |
| `target_count` | INTEGER | NOT NULL | `1` | Times per period (must be > 0) |
| `color` | TEXT | NULL | — | UI color hex string |
| `is_archived` | BOOLEAN | NOT NULL | `FALSE` | Soft-delete flag |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Indexes:** `user_id`, `created_at`

---

## Table: `public.habit_entries`

A single logged completion of a habit for a given date.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `habit_id` | UUID | NOT NULL | — | FK → `habits.id` CASCADE |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `logged_date` | DATE | NOT NULL | — | The date the habit was logged |
| `note` | TEXT | NULL | — | Optional note for the entry |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Constraints:** `UNIQUE(habit_id, logged_date)` — one entry per habit per day.

**Indexes:** `habit_id`, `user_id`, `logged_date`

---

## Table: `public.ai_conversations`

Stores AI conversation history per user per module.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `role` | TEXT | NOT NULL | — | `'user'` or `'assistant'` |
| `content` | TEXT | NOT NULL | — | Message text |
| `module` | TEXT | NOT NULL | `'habits'` | Which module this conversation belongs to (added in migration 002) |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Indexes:** `user_id`, `created_at`, `(user_id, module)`

---

## Table: `public.budget_categories`

User-defined income/expense categories.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `name` | TEXT | NOT NULL | — | Category name |
| `type` | TEXT | NOT NULL | — | `'income'`, `'expense'`, or `'both'` |
| `color` | TEXT | NOT NULL | `'#6366f1'` | UI color |
| `icon` | TEXT | NULL | — | Optional icon identifier |
| `is_archived` | BOOLEAN | NOT NULL | `FALSE` | Soft-delete flag |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Indexes:** `user_id`

---

## Table: `public.budget_transactions`

Individual financial transactions (income or expense).

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `category_id` | UUID | NULL | — | FK → `budget_categories.id` SET NULL |
| `type` | TEXT | NOT NULL | — | `'income'` or `'expense'` |
| `amount` | NUMERIC(12,2) | NOT NULL | — | Transaction amount (must be > 0) |
| `description` | TEXT | NOT NULL | — | Transaction description |
| `date` | DATE | NOT NULL | `CURRENT_DATE` | Transaction date |
| `is_recurring` | BOOLEAN | NOT NULL | `FALSE` | Whether this repeats |
| `recurring_interval` | TEXT | NULL | — | `'daily'`, `'weekly'`, `'monthly'`, `'yearly'` |
| `notes` | TEXT | NULL | — | Optional notes |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Indexes:** `user_id`, `(user_id, date DESC)`, `(user_id, type)`

---

## Table: `public.budgets`

Monthly budget plans (optional spending limits per month).

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `month` | INTEGER | NOT NULL | — | Month number 1–12 |
| `year` | INTEGER | NOT NULL | — | Year ≥ 2000 |
| `monthly_limit` | NUMERIC(12,2) | NULL | — | Optional spending cap |
| `notes` | TEXT | NULL | — | — |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Constraints:** `UNIQUE(user_id, month, year)`

**Indexes:** `user_id`

---

## Table: `public.task_projects`

Project/list groupings for tasks.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `name` | TEXT | NOT NULL | — | Project name |
| `color` | TEXT | NOT NULL | `'#6366f1'` | UI color |
| `description` | TEXT | NULL | — | Optional description |
| `is_archived` | BOOLEAN | NOT NULL | `FALSE` | Soft-delete flag |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Indexes:** `user_id`

---

## Table: `public.tasks`

Individual task items.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NOT NULL | — | FK → `users.id` CASCADE |
| `project_id` | UUID | NULL | — | FK → `task_projects.id` SET NULL |
| `title` | TEXT | NOT NULL | — | Task title |
| `description` | TEXT | NULL | — | Optional details |
| `status` | TEXT | NOT NULL | `'todo'` | `'todo'`, `'in_progress'`, `'done'`, `'cancelled'` |
| `priority` | TEXT | NOT NULL | `'medium'` | `'low'`, `'medium'`, `'high'`, `'urgent'` |
| `due_date` | DATE | NULL | — | Optional due date |
| `completed_at` | TIMESTAMPTZ | NULL | — | Set when status → `'done'` |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | — |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | Auto-updated |

**Indexes:** `user_id`, `(user_id, status)`, `(user_id, due_date)`, `project_id`

---

## Shared Database Patterns

### UUID Primary Keys

All tables use UUID primary keys generated by `gen_random_uuid()` (from the `pgcrypto` extension).
This ensures globally unique IDs across distributed environments.

### Timestamps

All tables have `created_at` and `updated_at` columns. The `updated_at` column is automatically
updated by a trigger calling `update_updated_at()` (defined in migration 001).

### Soft Deletes

Tables with `is_archived BOOLEAN DEFAULT FALSE` use soft deletes. Records are never physically
deleted — they are archived. The application filters out archived records in normal queries.

### Cascade Deletes

All child tables use `ON DELETE CASCADE` for their `user_id` foreign key. Deleting a user
removes all their data. Other foreign keys (e.g., `category_id` on transactions) use `ON DELETE SET NULL`.
