# Production Environment Variables

| Field | Value |
|---|---|
| **Purpose** | Complete reference for all environment variables required on Vercel |
| **Audience** | DevOps, Greg Odi |
| **Last Updated** | 2026-08-04 |

---

## Vercel Environment Variables Table

Enter these in: **Vercel Dashboard → Project → Settings → Environment Variables**

| Variable | Required | Scope | Example Value | Description |
|---|---|---|---|---|
| `SUPABASE_URL` | **Yes** | Production, Preview | `https://abcxyz.supabase.co` | Your Supabase project URL. Found in Supabase → Settings → API → Project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Production only | `eyJhbGci...` | Service role key — bypasses RLS. Found in Supabase → Settings → API → `service_role` secret. **Never expose to the browser.** |
| `SUPABASE_ANON_KEY` | **Yes** | Production, Preview | `eyJhbGci...` | Anon/public key. Found in Supabase → Settings → API → `anon` public. |
| `JWT_SECRET` | **Yes** | Production only | 64-char random string | Used to sign session tokens. Generate with: `openssl rand -hex 32`. Must be ≥ 32 characters. |
| `OPENAI_API_KEY` | No | Production only | `sk-proj-...` | OpenAI API key. **Optional** — without it the app runs normally; AI Coach, AI Budget Coach, and AI Task Coach return a 503 with a user-friendly message instead of crashing. |
| `OPENAI_MODEL` | No | Production, Preview | `gpt-4o-mini` | OpenAI model to use. Defaults to `gpt-4o-mini` if not set. |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Production, Preview | `https://abcxyz.supabase.co` | Same as `SUPABASE_URL` — exposed to browser if any client-side Supabase calls are added in future. Currently unused. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Production, Preview | `eyJhbGci...` | Same as `SUPABASE_ANON_KEY` — browser-safe. Currently unused. |
| `DATABASE_URL` | No | — | `postgresql://postgres:pass@db.abcxyz.supabase.co:5432/postgres` | Direct Postgres connection string. Not used by the current app (Supabase JS is used instead). Reserved for future direct DB access. |

---

## How to find Supabase values

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public** key → `SUPABASE_ANON_KEY`
   - **service_role** key (reveal it) → `SUPABASE_SERVICE_ROLE_KEY`

---

## Generating a secure JWT_SECRET

```bash
openssl rand -hex 32
```

This produces a 64-character hex string. Paste it as `JWT_SECRET`.

**Important**: Use the same `JWT_SECRET` value across all deployments. If you rotate it, all existing user sessions will be invalidated.

---

## Variable scoping rules

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SUPABASE_URL` | ✓ | ✓ (staging project) | — |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✓ (staging project) | — |
| `SUPABASE_ANON_KEY` | ✓ | ✓ (staging project) | — |
| `JWT_SECRET` | ✓ | ✓ (different value OK) | — |
| `OPENAI_API_KEY` | Optional | — | — |
| `OPENAI_MODEL` | ✓ | ✓ | — |

---

## Security rules

- **Never commit** any real secret value to the repository
- `.env.local` is in `.gitignore` — it is never committed
- `.env.example` contains only placeholder values — it IS committed
- `SUPABASE_SERVICE_ROLE_KEY` has admin privileges — restrict to Production scope only
- `JWT_SECRET` rotation invalidates all sessions — plan maintenance windows

---

## Local development

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
# then edit .env.local with real values
```
