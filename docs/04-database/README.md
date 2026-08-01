# Database Documentation

| Field | Value |
|---|---|
| **Purpose** | Index of all database documentation for greg-ai-habits |
| **Audience** | Engineers, database administrators, Claude Code sessions |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Documents in This Folder

| Document | Description |
|---|---|
| [SUPABASE-SETUP.md](SUPABASE-SETUP.md) | How to set up and configure the Supabase project |
| [MIGRATIONS.md](MIGRATIONS.md) | Migration history and how to apply migrations |
| [DATABASE-SCHEMA.md](DATABASE-SCHEMA.md) | Full schema reference for all tables |

---

## Database at a Glance

| Property | Value |
|---|---|
| Database engine | PostgreSQL (managed by Supabase) |
| Schema | `public` |
| Authentication | Supabase Auth (`auth.users` table, managed by Supabase) |
| Migrations | Manual SQL files in `src/infrastructure/db/migrations/` |
| Row Level Security | Not yet implemented (planned) |
| Current migration | `003_tasks.sql` |
| Tables | `users`, `habits`, `habit_entries`, `ai_conversations`, `budget_categories`, `budget_transactions`, `budgets`, `task_projects`, `tasks` |
