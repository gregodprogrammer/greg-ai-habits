# Supabase Setup

| Field | Value |
|---|---|
| **Purpose** | How to create, configure, and connect to the Supabase project |
| **Audience** | Engineers setting up the project for the first time |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Environment Variables](../05-deployment/ENVIRONMENT-VARIABLES.md) · [Migrations](MIGRATIONS.md) |

---

## What Is Supabase?

Supabase is an open-source Firebase alternative that provides:

- **PostgreSQL database** — fully managed, with backups and scaling.
- **Authentication** — email/password, OAuth, magic links, phone auth.
- **Storage** — S3-compatible file storage.
- **Realtime** — websocket subscriptions to database changes.
- **Dashboard** — web UI for managing tables, users, policies, and SQL.
- **REST and GraphQL APIs** — auto-generated from your database schema.

This project uses Supabase for PostgreSQL, Auth, and Storage.

---

## Account Setup

1. Go to [supabase.com](https://supabase.com) and sign up with `greg.ethel@gmail.com`.
2. Create a new **Organization**: `Greg AI Labs`.
3. Create a new **Project**: `greg-ai-habits`.
4. Choose a strong database password and store it securely (you will need it for `DATABASE_URL`).
5. Select the nearest available region.

---

## Getting API Credentials

In the Supabase dashboard:

1. Go to **Project Settings** → **API**.
2. Note the following values:

| Key | Where to use |
|---|---|
| Project URL | `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` public key | `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` secret key | `SUPABASE_SERVICE_ROLE_KEY` (never expose to browser) |

3. Go to **Project Settings** → **Database** → **Connection string** (URI).
4. Copy the URI and replace `[YOUR-PASSWORD]` with your database password.
5. Use this as `DATABASE_URL`.

---

## Key Concepts

### Auth Schema vs Public Schema

Supabase manages user authentication in an internal `auth` schema. Our application mirrors
user records into `public.users` for application-level data (display name, etc.).

When a user registers:
1. Supabase creates a row in `auth.users` (managed internally).
2. Our `AuthRepository.create()` creates a corresponding row in `public.users`.

### The Service Role Key

The `service_role` key bypasses Row Level Security (RLS). It is used only in server-side code
(the `src/infrastructure/db/client.ts` Supabase client) where full database access is required.

**Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or in `NEXT_PUBLIC_` variables.**

### Row Level Security (Future)

RLS policies control which rows a database user can read or write. They are not yet implemented
in this project. When implemented, they will be added as a new migration file. See [MIGRATIONS.md](MIGRATIONS.md).

---

## Supabase SQL Editor

The Supabase dashboard includes a SQL Editor for running queries and migrations.

Navigate to: **SQL Editor** → **New query**.

Use this to:
- Apply migration files manually.
- Debug data issues.
- Inspect table contents.
- Run one-off administrative queries.

---

## Supabase Table Editor

Navigate to: **Table Editor** to browse table rows visually.

Use this to:
- Verify migrations applied correctly.
- Inspect user records.
- Debug data issues during development.

---

## Dashboard Authentication Users

Navigate to: **Authentication** → **Users** to see all registered users.

This is where you can verify that Supabase Auth is creating users correctly during registration testing.
