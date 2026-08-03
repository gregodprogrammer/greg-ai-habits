# Production Deployment Checklist

| Field | Value |
|---|---|
| **Purpose** | Step-by-step checklist to complete before and after every production deployment |
| **Audience** | DevOps, Greg Odi |
| **Last Updated** | 2026-08-04 |

---

## Pre-Deployment Checklist

### Code Readiness

- [ ] All feature work committed and pushed to `main`
- [ ] `npm run typecheck` passes locally (zero errors)
- [ ] `npm run build` passes locally (zero errors)
- [ ] All tests pass: `npm test -- --forceExit`
- [ ] No `.env.local` or secrets accidentally staged in git

### Database Readiness

- [ ] Supabase production project exists
- [ ] Migration 001 applied: `src/infrastructure/db/migrations/001_initial.sql`
- [ ] Migration 002 applied: `src/infrastructure/db/migrations/002_budget.sql`
- [ ] Migration 003 applied: `src/infrastructure/db/migrations/003_tasks.sql`
- [ ] Migration 004 applied: `src/infrastructure/db/migrations/004_rls_policies.sql`
- [ ] RLS policies verified: Supabase → Database → Policies — all 8 tables have policies
- [ ] At least one test user can register and log in

### Vercel Readiness

- [ ] Vercel project created and linked to `gregodprogrammer/greg-ai-habits`
- [ ] Framework detected as **Next.js**
- [ ] Node.js version set to **20** (auto-detected from `.nvmrc`)
- [ ] All required environment variables entered (see `02-production-environment.md`)
- [ ] `SUPABASE_URL` — verified
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — verified
- [ ] `SUPABASE_ANON_KEY` — verified
- [ ] `JWT_SECRET` — 64-character random string, verified
- [ ] `OPENAI_API_KEY` — verified

---

## Deployment Steps

- [ ] Click **Deploy** in Vercel (or push to `main` triggers auto-deploy if GitHub integration is set up)
- [ ] Monitor build log — expect ~3–5 minutes
- [ ] Build log shows `✓ Compiled successfully`
- [ ] Build log shows `✓ Generating static pages`
- [ ] Deployment status shows **Ready**
- [ ] Vercel provides a production URL (e.g., `greg-ai-habits.vercel.app`)

---

## Post-Deployment Checklist

### Smoke Test

Run the full smoke test from `04-production-smoke-test.md`:

- [ ] Homepage loads at the production URL
- [ ] Register with a new email — user record created in both `auth.users` and `public.users`
- [ ] Login works
- [ ] Dashboard loads
- [ ] Create a habit
- [ ] Log the habit today
- [ ] Refresh page — "Log Today" does NOT reappear (hydration confirmed working)
- [ ] Edit the habit — change name and description
- [ ] Clear the description — saves as empty (null description bug confirmed fixed)
- [ ] Archive the habit — it moves to Archived tab
- [ ] Restore the habit — it returns to Active tab
- [ ] Delete the habit
- [ ] Log out
- [ ] Log back in — session works
- [ ] Navigate to /habits directly — loads correctly (logged in)

### Monitoring

- [ ] Check Vercel → Functions tab — no function errors
- [ ] Check Vercel → Analytics (if enabled) — traffic showing
- [ ] Verify Supabase → Logs show API requests (not errors)

### Domain (if applicable)

- [ ] Custom domain configured in Vercel → Settings → Domains
- [ ] SSL certificate active (Vercel provisions automatically)
- [ ] HTTPS redirect enabled

---

## Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Engineering Lead | Greg Odi | | |
| QA | | | |
