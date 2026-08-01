# Pre-Deployment Checklist

| Field | Value |
|---|---|
| **Purpose** | Checklist to complete before deploying to production |
| **Audience** | Engineers performing deployments |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Vercel](../05-deployment/VERCEL.md) · [Release Checklist](../05-deployment/RELEASE-CHECKLIST.md) |

---

## Before Deploying to Production

### Code Readiness

- [ ] All tests pass on `main` branch: `npm test`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Production build succeeds locally: `npm run build`
- [ ] GitHub Actions CI pipeline is green on `main`

### Database

- [ ] All new migrations applied to **production** Supabase.
- [ ] No pending schema changes from the migration log.
- [ ] Table Editor in Supabase confirms new tables/columns exist.

### Environment Variables

- [ ] All environment variables set in Vercel project settings.
- [ ] All environment variables set in GitHub Actions secrets.
- [ ] No placeholder values in production configuration.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is the production key, not the development key.

### Security

- [ ] Row Level Security reviewed and appropriate for the current feature set.
- [ ] Supabase Auth email confirmation configured appropriately for production.
- [ ] No development-only code or debug routes in the production build.

### Documentation

- [ ] Session journal entry written for this deployment.
- [ ] All new features documented.
- [ ] Troubleshooting index updated with any issues from this deployment.

### Post-Deploy Smoke Tests

- [ ] Register a new user.
- [ ] Log in.
- [ ] Create a habit.
- [ ] Log a habit entry.
- [ ] Create a budget transaction.
- [ ] Create a task.
- [ ] Test AI chat.
- [ ] Log out.
- [ ] Check Vercel logs for runtime errors.
