# Vercel Deployment

| Field | Value |
|---|---|
| **Purpose** | Steps to deploy greg-ai-habits to Vercel |
| **Audience** | Engineers performing production deployment |
| **Status** | PLACEHOLDER — not yet performed |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Environment Variables](ENVIRONMENT-VARIABLES.md) · [Release Checklist](RELEASE-CHECKLIST.md) |

---

## Status

Vercel deployment has not yet been performed. This document is a placeholder.

Complete this document when the deployment is performed and record:
- The Vercel project URL.
- The deployment date.
- Any issues encountered.
- The production environment variable configuration.

---

## Prerequisites Before Deploying

- [ ] All migrations applied to the production Supabase project.
- [ ] All environment variables confirmed correct.
- [ ] `npm run build` succeeds locally.
- [ ] All tests pass: `npm test`.
- [ ] TypeScript check passes: `npm run typecheck`.
- [ ] Supabase Auth email confirmation configured appropriately.
- [ ] Row Level Security policies in place (migration 004).

---

## Planned Deployment Steps

### 1. Create Vercel Account / Project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **New Project**.
3. Import the `greg-ai-habits` repository from GitHub.
4. Framework preset: **Next.js** (auto-detected).
5. Root directory: `/` (leave as default).

### 2. Configure Environment Variables

In Vercel → Project → Settings → Environment Variables, add all variables listed in
[ENVIRONMENT-VARIABLES.md](ENVIRONMENT-VARIABLES.md).

Mark the following as production-only (not exposed to preview deployments):
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `OPENAI_API_KEY`

### 3. Deploy

Click **Deploy**. Vercel will run:
1. `npm install`
2. `npm run build`
3. Deploy the standalone Next.js output.

### 4. Verify Deployment

- Visit the Vercel deployment URL.
- Test registration and login.
- Test habit creation.
- Check Vercel logs for any runtime errors.

### 5. Custom Domain (Optional)

In Vercel → Project → Settings → Domains, add the custom domain and configure DNS.

---

## Rollback Strategy

If a deployment introduces a critical bug:

1. Go to Vercel → Project → Deployments.
2. Find the last known good deployment.
3. Click **...** → **Promote to Production**.

This instantly rolls back the production deployment without a git revert.
