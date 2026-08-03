# Troubleshooting Index

| Field | Value |
|---|---|
| **Purpose** | Searchable index of all bugs, errors, and investigation records |
| **Audience** | Engineers, Claude Code sessions debugging issues |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-03 |
| **Related Documents** | [SESSION-001](../00-project-journal/SESSION-001.md) · [SESSION-003](../00-project-journal/SESSION-003.md) |

---

## Issue Index

| # | Error / Issue | Module | Status | Session | Resolution |
|---|---|---|---|---|---|
| 001 | "Failed to create user record" on registration | Auth | **Open** | SESSION-001/002 | Run `node scripts/test-supabase.mjs`; check raw error in API response `details` field |
| 002 | Re-logging a habit on the same day returns DB error | Habits | **Resolved** | SESSION-003 | Added `onConflict: 'habit_id,logged_date'` to upsert |
| 003 | "Log Today" always shows on page refresh | Habits | **Resolved** | SESSION-003 | Frontend now fetches today's entries on mount |
| 004 | No way to view or restore archived habits | Habits | **Resolved** | SESSION-003 | Added Archived tab with Restore button |
| 005 | Description cannot be cleared on edit | Habits | **Resolved** | SESSION-003 | Frontend now sends `null` explicitly |
| 006 | Habit limit not enforced | Habits | **Resolved** | SESSION-003 | Service now checks `findCountByUser` before create |
| 007 | `deleteEntry` silently swallowed errors | Habits | **Resolved** | SESSION-003 | Repository now checks error and throws |

---

## Issue 001 — Failed to create user record

**Status:** Open (as of 2026-08-01)

**Error message:**
```
Failed to create user record
```

**Module:** Auth — `POST /api/auth/register`

**Observed behavior:**
- Registration request returns an error response.
- User IS created in Supabase Auth (`auth.users` table visible in dashboard).
- User is NOT created in `public.users` table.
- `public.users` table remains empty after the failed registration.

**Root cause hypotheses (ranked by likelihood):**

1. **Row Level Security blocking INSERT on `public.users`.**
   Supabase enables RLS on all `public` schema tables. Without an INSERT policy, even the
   service role key may be blocked depending on RLS configuration.

2. **Incorrect `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.**
   A placeholder value would cause the Supabase client to authenticate with an invalid key,
   resulting in a 401/403 error on the INSERT operation.

3. **`public.users` UUID does not match `auth.users.id`.**
   If the `session.userId` returned by `SupabaseAuthProvider.signUp()` does not match the UUID
   format expected by the `public.users` primary key, the INSERT would fail with a type error.

**Investigation steps:**

- [ ] Step 1: In Supabase dashboard → Authentication → Policies → verify `public.users` table has INSERT policy or RLS is disabled.
- [ ] Step 2: In `.env.local` → verify `SUPABASE_SERVICE_ROLE_KEY` matches the `service_role` secret in Supabase → Settings → API exactly.
- [ ] Step 3: Add detailed error logging to `AuthRepository.create()` — log the raw Supabase error object before throwing.
- [ ] Step 4: Re-run `POST /api/auth/register` and inspect server console for the raw Supabase error code and message.
- [ ] Step 5: If RLS is the issue, add to migration 004: `ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;` (temporary) or add a service-role INSERT policy.

**Evidence collected:**
- `src/infrastructure/db/client.ts` creates the Supabase client using `SUPABASE_SERVICE_ROLE_KEY`.
- In Supabase, the service role key is supposed to bypass RLS — but only if it is the correct key.
- `AuthService.register()` calls `authProvider.signUp()` first, then `authRepository.create()`.

**Resolution:** PENDING — record here when resolved.

---

## Template for New Issues

```markdown
## Issue NNN — [Short description]

**Status:** Open / Resolved

**Error message:**
[Paste exact error here]

**Module:** [auth | habits | budget | tasks | analytics | ai | infra]

**Observed behavior:**
[What happens vs. what was expected]

**Root cause:**
[Identified root cause]

**Resolution:**
[Steps taken to fix. If pending, list investigation steps.]

**Date resolved:** YYYY-MM-DD
**Session:** SESSION-NNN
```
