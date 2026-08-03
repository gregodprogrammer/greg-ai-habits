# SESSION-002 — Registration Blocker Investigation

| Field | Value |
|---|---|
| **Purpose** | Investigate and resolve "Failed to create user record" blocker from SESSION-001 |
| **Audience** | Engineers, future Claude Code sessions |
| **Status** | In Progress — awaiting diagnostic output from user |
| **Owner** | Greg Odi |
| **Date** | 2026-08-03 |
| **Related Documents** | [SESSION-001](SESSION-001.md) · [Troubleshooting Index](../06-troubleshooting/TROUBLESHOOTING-INDEX.md) |

---

## Session Summary

This session continued from the blocker left at the end of SESSION-001:
registration fails with the generic message "Failed to create user record" but the
raw Supabase error was never surfaced to the client, making root-cause identification
impossible without looking at the server console.

Three changes were made this session to improve diagnosability and set up defensive
database policies:

1. `AuthRepository.create()` now includes the raw Supabase error (code, message, hint)
   in the `AppError.details` field when `NODE_ENV !== 'production'`. This means a failed
   registration now returns a JSON body that includes the actual PostgREST/Supabase error.

2. `scripts/test-supabase.mjs` — a standalone diagnostic script that tests the Supabase
   connection directly (no Next.js required). Run with `node scripts/test-supabase.mjs`.

3. Migration `004_rls_policies.sql` — enables RLS on all public tables and adds both
   service-role "all access" policies and per-user "own rows" policies.

---

## Investigation Findings

### Supabase Key Format

The credentials in `.env.local` use Supabase's **new opaque key format**:
- Anon/publishable key: `sb_p...` (46 characters)
- Service role/secret key: `sb_s...` (41 characters)

These are NOT JWTs. Supabase introduced this format in newer projects. The installed
`@supabase/supabase-js` version is `2.109.0` (far newer than the `^2.47.2` in
`package.json` — semver resolved a much newer minor). Version 2.109.0 references
"publishable key" in its docs, confirming it supports the new format.

### Architecture Confirmation

The wiring is correct:
- `SupabaseAuthProvider` uses `createClient(url, serviceRoleKey)` — the same key for
  auth admin operations and PostgREST calls.
- `AuthRepository` uses `getDbClient(url, serviceRoleKey)` — same singleton.
- `AuthService.register()` calls `signUp()` then `create()` sequentially.

The error message "Failed to create user record" originates in `AuthRepository.create()`,
which means `authProvider.signUp()` (and the nested `signIn()`) is succeeding before
the upsert fails.

### Hypotheses (Ranked)

| Rank | Hypothesis | Evidence |
|---|---|---|
| 1 | PostgREST rejects the `sb_s` key because the table schema or connection string is wrong | The Auth API (different endpoint) works; PostgREST may have a different auth path |
| 2 | The `public.users` migration was not applied to the Supabase project | No way to verify without dashboard access; table missing = 42P01 error code |
| 3 | RLS is blocking the INSERT (though service role bypasses RLS) | Defensive — migration 004 adds explicit policies |
| 4 | The Supabase project URL points to the wrong project | `SUPABASE_URL len=40` is plausible for a hosted project |

---

## Changes Made This Session

### 1. `src/features/auth/auth.repository.ts`

Modified `create()` to log structured error details and include them in the thrown
`AppError.details` in development mode. After this change, a failed registration
returns HTTP 500 with a body like:

```json
{
  "success": false,
  "error": {
    "code": "DB_ERROR",
    "message": "Failed to create user record",
    "details": {
      "supabase": {
        "code": "42P01",
        "message": "relation \"public.users\" does not exist",
        "hint": null
      }
    }
  }
}
```

The actual codes will differ — the point is that the error is now visible.

### 2. `scripts/test-supabase.mjs`

New standalone diagnostic script. Run:
```bash
node scripts/test-supabase.mjs
```

Tests three operations in isolation:
- `SELECT` from `public.users`
- `auth.admin.listUsers()`
- `UPSERT` a diagnostic row into `public.users` (then deletes it)

Each prints PASS or FAIL with the raw Supabase error on failure.

### 3. `src/infrastructure/db/migrations/004_rls_policies.sql`

New migration. Enables RLS on all 8 public tables and adds:
- `service_role_all_*` policies (defensive; service role already bypasses RLS by default)
- Per-user `own rows` policies for authenticated users

**Must be applied in Supabase Dashboard → SQL Editor.** Not auto-applied.

---

## Next Steps (for SESSION-003)

### Step 1 — Run the diagnostic script

```bash
cd /mnt/c/Users/GREG\ ODI/Desktop/Greg-AI-Labs/projects/greg-ai-habits
node scripts/test-supabase.mjs
```

Read the output. Each test shows PASS or FAIL with the exact Supabase error.

### Step 2 — Attempt registration

```bash
npm run dev
```

Then POST to `http://localhost:3000/api/auth/register` with:
```json
{ "email": "test@example.com", "password": "Password123!", "display_name": "Test User" }
```

The response body now includes the Supabase error details (in development mode).

### Step 3 — Interpret the error code

| Code | Meaning | Fix |
|---|---|---|
| `42P01` | Table does not exist | Apply migrations 001–003 in Supabase Dashboard SQL Editor |
| `42501` | Insufficient privilege | Apply migration 004; verify service role key is correct |
| `PGRST301` | JWT/API key rejected | Upgrade/downgrade `@supabase/supabase-js`; verify key format |
| `23505` | Unique constraint violation | Email already registered; try a different email |
| `PGRST116` | Zero rows returned from `.single()` | Upsert succeeded but SELECT returned nothing — investigate |

### Step 4 — Apply migration 004 if needed

Paste the contents of `src/infrastructure/db/migrations/004_rls_policies.sql`
into Supabase Dashboard → SQL Editor and run.

---

## Commits This Session

```
fix(auth): surface raw Supabase error in dev-mode registration failure
feat(scripts): add Supabase connectivity diagnostic script
feat(db): add migration 004 with RLS policies for all public tables
docs: write SESSION-002 engineering journal
```
