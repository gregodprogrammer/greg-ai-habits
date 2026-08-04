# Next Actions

_This file contains exactly what to do next. Updated at the end of every session._

_Last updated: 2026-08-04_

---

## Resume in Under 5 Minutes

### Context

The Habits module is production-released at 97/100. The deployment infrastructure (Vercel, E2E tests, docs) is in place. The next task is validating the Budget module to production-ready standard.

**Production URL:** https://greg-ai-habits.vercel.app  
**Current branch:** `main`  
**Last commit:** `f345a1f` — E2E smoke test suite

---

## Step 1 — Read Budget Module Source (15–20 min)

Read these files in order:

```
src/features/budget/dtos/
src/features/budget/budget.repository.ts
src/features/budget/budget.service.ts
src/features/budget/__tests__/budget.service.test.ts
src/app/api/budget/route.ts
src/app/api/budget/[id]/route.ts       (if exists)
src/app/(dashboard)/budget/page.tsx
```

Read the Habits QA checklist for reference on what to look for:
- DTO validation: `.optional()` vs `.nullish()` for nullable fields
- Service: ownership checks (`user_id` on all queries)
- Service: limit enforcement (similar to `MAX_PER_USER` in Habits)
- Repository: error propagation (no silent swallows)
- API routes: authentication check on every handler
- UI: loading states, error states, empty states
- UI: mobile responsiveness

---

## Step 2 — Document Findings (as you read)

Open `docs/99-project-management/BUG-TRACKER.md`.

Add each discovered issue with:
- ID: `BUG-B001`, `BUG-B002`, … (Budget prefix)
- Module: Budget
- Severity: Critical / High / Medium / Low
- Description, Root Cause, Fix plan

---

## Step 3 — Fix All Bugs

Fix each bug in the codebase. Follow the same pattern used for Habits:
- One commit per logical group of fixes
- Conventional commit format: `fix(budget): <description>`
- No AI attribution in commit messages

---

## Step 4 — Assign Quality Score and Update Documents

After fixes are committed:

1. Assign a quality score (0–100) based on:
   - Bug count and severity
   - Test coverage
   - Code correctness
   - UI completeness

2. Update these files:
   - `docs/99-project-management/PROJECT-BOARD.md` — update Budget row
   - `docs/99-project-management/CURRENT-STATUS.md` — update status
   - `docs/99-project-management/BUG-TRACKER.md` — mark bugs closed
   - `docs/99-project-management/METRICS.md` — update bug counts and quality score
   - `docs/99-project-management/SPRINT.md` — move Budget QA to Completed
   - `docs/99-project-management/DAILY-PROGRESS.md` — append session entry
   - `docs/99-project-management/RELEASE-PLAN.md` — update v0.2.0 with release date

---

## Step 5 — Release Budget as v0.2.0

1. Update `docs/99-project-management/CHANGELOG.md` with v0.2.0 section
2. Commit all documentation updates
3. Push to `origin/main`
4. Vercel auto-deploys; wait for deployment to complete (~2 min)
5. Run: `npm run test:e2e`
6. Verify all 33 tests pass (Budget-specific flows are not yet in the suite — add them in the next sprint)

---

## After Budget: Tasks Module

The same QA pattern repeats for Tasks. Starting files:

```
src/features/tasks/dtos/
src/features/tasks/tasks.repository.ts
src/features/tasks/tasks.service.ts
src/features/tasks/__tests__/tasks.service.test.ts
src/app/api/tasks/route.ts
src/app/(dashboard)/tasks/page.tsx
```

---

## Useful Commands

```bash
# Run existing unit tests
npx jest --forceExit

# TypeScript check
npm run typecheck

# E2E smoke tests (production)
npm run test:e2e

# View E2E report
npm run test:e2e:report

# Git status
git status && git log --oneline -5
```
