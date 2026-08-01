# Supabase Production Configuration

| Field | Value |
|---|---|
| **Purpose** | Supabase production configuration and operational notes |
| **Audience** | Engineers |
| **Status** | Active — project created, migrations applied |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Supabase Setup](../04-database/SUPABASE-SETUP.md) · [Environment Variables](ENVIRONMENT-VARIABLES.md) |

---

## Project Details

| Property | Value |
|---|---|
| Organization | Greg AI Labs |
| Project Name | greg-ai-habits |
| Database | PostgreSQL (managed) |
| Region | TBD (set during project creation) |
| Free Tier | Yes (development and early production) |

---

## Supabase Auth Configuration

Supabase Auth is configured with the following defaults:

| Setting | Value |
|---|---|
| Email/password auth | Enabled |
| Email confirmation | Disabled (for development; enable for production) |
| Phone auth | Disabled |
| OAuth providers | None configured yet |
| JWT expiry | 3600 seconds (1 hour) |

---

## Row Level Security (Planned)

RLS is **not currently enabled** on any table. This is a known security gap.

Before production launch:
- [ ] Enable RLS on all tables in `public` schema.
- [ ] Write a migration (`004_rls.sql`) with appropriate policies.
- [ ] Test that the service role key bypasses RLS correctly.
- [ ] Test that unauthenticated access is correctly blocked.

See [MIGRATIONS.md](../04-database/MIGRATIONS.md) for the planned migration 004.

---

## Storage

Supabase Storage is included in the architecture via `SupabaseStorageProvider` but not yet
used by any feature module. It is ready to be wired up when file upload features are needed.

---

## Backups

Supabase free tier includes daily backups. Production tier includes point-in-time recovery.
Before any production launch, verify backup settings in **Project Settings → Database → Backups**.

---

## Scaling

The free tier supports:
- 500 MB database storage.
- 5 GB bandwidth.
- 50,000 monthly active users.

Upgrade to Pro tier when these limits are approached.
