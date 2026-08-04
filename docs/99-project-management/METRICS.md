# Project Metrics

_Last updated: 2026-08-04_

---

## Codebase

| Metric                      | Value  | Notes                                                   |
|-----------------------------|--------|---------------------------------------------------------|
| Total source files          | 102    | `src/**/*.ts` and `src/**/*.tsx`, excluding test files  |
| Total lines of code (src)   | ~6,728 | `wc -l src/**/*.{ts,tsx}`                               |
| Total E2E test files        | 5      | `e2e/tests/*.spec.ts`                                   |
| Total E2E test lines        | ~324   | `wc -l e2e/**/*.ts`                                     |
| Total unit test files       | 5      | `src/features/**/__tests__/*.test.ts`                   |
| Total unit test cases       | ~98    | Counted via `describe`/`test`/`it` calls                |
| Total E2E test cases        | 33     | `npx playwright test --list`                            |
| Total commits               | 28     | As of 2026-08-04                                        |
| Feature modules             | 6      | Habits, Budget, Tasks, Analytics, AI Coach, Profile     |

---

## Quality

| Metric                      | Value        | Notes                                                 |
|-----------------------------|--------------|-------------------------------------------------------|
| Habits quality score        | 97/100       | Full source-code QA; 14 bugs fixed                    |
| Budget quality score        | Unscored     | QA not yet performed                                  |
| Tasks quality score         | Unscored     | QA not yet performed                                  |
| Analytics quality score     | Unscored     | QA not yet performed                                  |
| AI Coach quality score      | Unscored     | QA not yet performed                                  |
| Profile quality score       | Unscored     | QA not yet performed                                  |
| TypeScript strict mode      | ✅ Passing   | `npm run typecheck` — zero errors                     |
| Unit tests passing          | ✅           | All 98 unit test cases pass                           |
| E2E tests passing           | Run manually | `npm run test:e2e` (targets production)               |

---

## Bugs

| Metric                      | Value | Notes                                                     |
|-----------------------------|-------|-----------------------------------------------------------|
| Total bugs discovered       | 20    | 14 Habits + 6 deployment fixes                            |
| Total bugs fixed            | 20    | All closed; 0 open                                        |
| Open bugs                   | 0     | —                                                         |
| Critical severity fixed     | 3     | BUG-001, BUG-002, BUG-003                                 |
| High severity fixed         | 9     | BUG-004 – BUG-009, BUG-014, DEP-001, DEP-002             |
| Medium severity fixed       | 4     | BUG-010, BUG-011, DEP-003, DEP-004                       |
| Low severity fixed          | 4     | BUG-012, BUG-013, DEP-005, DEP-006                       |

---

## Deployment

| Metric                      | Value             | Notes                                             |
|-----------------------------|-------------------|---------------------------------------------------|
| Production deployments      | 1                 | Vercel auto-deploy from `main`                    |
| Production releases         | 1                 | v0.1.0 — Habits module                            |
| Production URL              | https://greg-ai-habits.vercel.app | Live                               |
| Database migrations applied | 4                 | 001–004; RLS active                               |
| Uptime (since launch)       | Tracking begins   | 2026-08-04                                        |

---

## Technical Debt

| Metric                      | Value | Notes                                                 |
|-----------------------------|-------|-------------------------------------------------------|
| Active debt items           | 7     | See TECHNICAL-DEBT.md                                 |
| Resolved debt items         | 5     | All in v0.1.0                                         |
| Blocking debt items         | 0     | All deferred items are non-blocking                   |

---

## Velocity

| Sprint          | Duration   | Commits | Bugs Fixed | Modules Released |
|-----------------|------------|---------|------------|------------------|
| Sprint 1 (Foundation) | 2026-07-22 to 2026-07-31 | 17 | — | 0 (build phase) |
| Sprint 2 (Habits QA + Deploy) | 2026-08-01 to 2026-08-04 | 11 | 20 | 1 (Habits v0.1.0) |

---

_Metrics updated manually at end of each work session._
