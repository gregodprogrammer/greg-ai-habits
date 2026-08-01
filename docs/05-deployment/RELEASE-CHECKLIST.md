# Release Checklist

| Field | Value |
|---|---|
| **Purpose** | Steps to complete before each production release |
| **Audience** | Engineers performing releases |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Pre-Deployment Checklist](../08-checklists/PRE-DEPLOYMENT.md) · [Vercel](VERCEL.md) |

---

## Pre-Release Verification

### Code Quality

- [ ] All tests pass: `npm test`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Production build succeeds: `npm run build`
- [ ] Docker build succeeds: `docker build -t greg-ai-habits:release .`

### Database

- [ ] All pending migrations applied to production Supabase.
- [ ] Migration changes verified in Supabase Table Editor.
- [ ] Row Level Security policies reviewed (if applicable).

### Environment

- [ ] All required environment variables set in production (Vercel).
- [ ] All required secrets set in GitHub Actions.
- [ ] No placeholder values remaining in production configuration.

### Manual Smoke Tests

- [ ] Register a new user — user appears in Supabase Auth dashboard.
- [ ] Log in as the new user — session cookie set, dashboard loads.
- [ ] Create a habit — appears in habit list.
- [ ] Log a habit entry — entry appears in analytics.
- [ ] Create a budget category and transaction — appears in budget module.
- [ ] Create a task project and task — appears in tasks module.
- [ ] Test AI chat — response received.
- [ ] Log out — session cookie cleared, redirected to login.

### Documentation

- [ ] Session journal entry written for this release.
- [ ] CHANGELOG or release notes updated (if applicable).
- [ ] Any new environment variables documented.
- [ ] Any new migrations documented.

---

## Release Steps

1. Merge feature branch to `main`.
2. Verify CI pipeline passes on `main`.
3. Tag the release: `git tag vX.Y.Z && git push origin vX.Y.Z`.
4. Vercel auto-deploys from `main` (or trigger manually in Vercel dashboard).
5. Perform smoke tests on the production URL.
6. Record the release in the session journal.

---

## Rollback Steps

If the release introduces a critical issue:

1. Vercel: Go to Deployments → find the last good deployment → Promote to Production.
2. Database: Apply a reverse migration if a schema change caused the issue.
3. Git: Create a revert commit and push to `main`.
4. Record the incident in `docs/06-troubleshooting/TROUBLESHOOTING-INDEX.md`.
