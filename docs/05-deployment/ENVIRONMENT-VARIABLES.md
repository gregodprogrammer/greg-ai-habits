# Environment Variables Reference

| Field | Value |
|---|---|
| **Purpose** | Complete reference for all environment variables used by this application |
| **Audience** | Engineers setting up local development or production deployment |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Environment Setup](../03-development/ENVIRONMENT-SETUP.md) · [Vercel](VERCEL.md) |

---

## How Environment Variables Work

Environment variables are declared and validated at application startup in `src/config/env.ts`
using Zod. If any required variable is missing or invalid, the application **throws an error
and refuses to start**. This is intentional — it prevents silent failures in production.

All variables must be present in `.env.local` for local development.
All variables must be set in GitHub Secrets for CI builds.
All variables must be set in Vercel project settings for production.

---

## Complete Variable Reference

### General

| Variable | Required | Example | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Runtime environment. Set automatically by Next.js. |
| `PORT` | No | `3000` | Port for the dev server. |

### Supabase (Server-side only)

| Variable | Required | Example | Description |
|---|---|---|---|
| `SUPABASE_URL` | **Yes** | `https://abc.supabase.co` | Supabase project URL. Found in Project Settings → API. |
| `SUPABASE_ANON_KEY` | **Yes** | `eyJhbGci...` | Supabase anonymous (public) key. Safe for client-side in theory but not used there in this project. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | `eyJhbGci...` | Supabase service role key. **Never expose to the browser.** Bypasses RLS. |

### Supabase (Public — browser-exposed)

| Variable | Required | Example | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `https://abc.supabase.co` | Same value as `SUPABASE_URL`. Exposed to client-side code. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | `eyJhbGci...` | Same value as `SUPABASE_ANON_KEY`. Exposed to client-side code. |

### Database

| Variable | Required | Example | Description |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://postgres:pw@db.abc.supabase.co:5432/postgres` | Full PostgreSQL connection string. Used for `psql` migrations. Not used at runtime (runtime uses Supabase JS SDK). |

### Authentication

| Variable | Required | Example | Description |
|---|---|---|---|
| `JWT_SECRET` | **Yes** | `64-char-hex-string` | Secret for signing/verifying session tokens. Must be at least 32 characters. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### OpenAI

| Variable | Required | Example | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | **Yes** | `sk-proj-...` | OpenAI API key. Get from platform.openai.com. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model to use. Defaults to `gpt-4o-mini` if not set. |

---

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` has superuser access to your database. Treat it like a database root password.
- `JWT_SECRET` must be long and random. A short or predictable secret allows session forgery.
- Never commit any of these values to git. The `.gitignore` excludes `.env.local`.
- For production, rotate secrets if they are accidentally exposed.

---

## Adding a New Environment Variable

1. Add the variable to `.env.example` with a placeholder value.
2. Add Zod validation for the variable in `src/config/env.ts`.
3. Add the variable to `src/config/env.ts`'s exported `env` object.
4. Document it in this file.
5. Add it to GitHub Secrets and Vercel environment variables.
6. Update the CI workflow file (`.github/workflows/ci.yml`) if it is needed at build time.
