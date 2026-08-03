# Rollback Guide

| Field | Value |
|---|---|
| **Purpose** | Procedures for rolling back a failed or broken production deployment |
| **Audience** | DevOps, Greg Odi |
| **Last Updated** | 2026-08-04 |
| **RTO (Recovery Time Objective)** | < 5 minutes via Vercel instant rollback |

---

## Option 1 — Vercel Instant Rollback (Recommended)

Vercel keeps a full history of every deployment. Rolling back requires no code changes.

1. Go to [vercel.com](https://vercel.com) → your project → **Deployments** tab
2. Find the last known-good deployment (green checkmark)
3. Click **⋯ (More)** → **Promote to Production**
4. Vercel switches production traffic to the previous deployment instantly
5. No downtime. No code changes. No database impact.

**When to use**: Any production regression found after deployment.

---

## Option 2 — Git Revert

If the broken change needs to be explicitly removed from history:

```bash
# Identify the bad commit
git log --oneline -10

# Revert it (creates a new commit undoing the change)
git revert <bad-commit-hash>

# Push to trigger a new Vercel deployment
git push origin main
```

**When to use**: When you want a clean audit trail showing the revert in git history.

---

## Option 3 — Emergency Environment Variable Change

If the issue is a misconfigured environment variable (not a code bug):

1. Vercel → Project → Settings → Environment Variables
2. Fix the wrong value
3. Vercel → Deployments → current deployment → **Redeploy**

This reuses the same build artifact with updated environment variables.

**When to use**: Wrong `SUPABASE_URL`, wrong `JWT_SECRET`, wrong `OPENAI_MODEL`.

---

## Database Rollback

**Important**: Vercel rollbacks do NOT roll back the database.

If a database migration caused a production issue:

### Case 1 — Migration added a column (safe to undo)

```sql
-- Run in Supabase Dashboard → SQL Editor
ALTER TABLE public.habits DROP COLUMN IF EXISTS new_column;
```

### Case 2 — Migration dropped a column or table (dangerous)

Data may be gone. Options:
1. Restore from Supabase automated backup (available in Supabase Pro tier)
2. Check if the data can be reconstructed from other tables

### Case 3 — Migration added an RLS policy that breaks access

```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "policy_name" ON public.table_name;
```

**Rule**: Always test migrations in a staging Supabase project before applying to production.

---

## Decision Tree

```
Production issue detected
│
├── Is it a UI/UX regression?
│   └── → Option 1: Vercel Instant Rollback
│
├── Is it an API error (5xx)?
│   ├── Check Vercel Functions logs first
│   ├── Wrong env var? → Option 3: Fix env var + redeploy
│   └── Code bug? → Option 1: Vercel Instant Rollback
│
├── Is it a database issue?
│   ├── RLS blocking requests? → Fix policy in Supabase SQL Editor
│   └── Data corruption? → Supabase backup restore
│
└── Is it a build failure (deployment never went live)?
    └── Fix the code, push to main → new deployment
```

---

## Post-Rollback Steps

After any rollback:

1. Confirm production is healthy — run the smoke test checklist (`04-production-smoke-test.md`)
2. Open a bug report in the project journal (`docs/00-project-journal/`)
3. Identify and fix the root cause before re-deploying
4. Write a post-mortem if the outage lasted > 15 minutes
