# Backlog

_Last updated: 2026-08-04_

---

## High Priority

| ID    | Item                                    | Module    | Notes                                                         |
|-------|-----------------------------------------|-----------|---------------------------------------------------------------|
| BP-01 | Budget module QA validation             | Budget    | Same validation pass as Habits — DTOs, service, API, UI       |
| BP-02 | Budget production release (v0.2.0)      | Budget    | Follows completed QA; deploy + smoke test                     |
| BP-03 | Tasks module QA validation              | Tasks     | After Budget release                                          |
| BP-04 | Tasks production release (v0.3.0)       | Tasks     | Follows completed Tasks QA                                    |
| BP-05 | Auth route protection middleware        | Auth      | Rename `src/proxy.ts` → `middleware.ts`; wire up properly     |

---

## Medium Priority

| ID    | Item                                    | Module    | Notes                                                         |
|-------|-----------------------------------------|-----------|---------------------------------------------------------------|
| MP-01 | Analytics module QA validation          | Analytics | After Tasks release                                           |
| MP-02 | Analytics production release (v0.4.0)   | Analytics | Follows completed Analytics QA                                |
| MP-03 | AI Coach module QA validation           | AI Coach  | Requires OPENAI_API_KEY in test env; NullAIProvider in prod   |
| MP-04 | AI Coach production release (v0.5.0)    | AI Coach  | Follows completed AI Coach QA                                 |
| MP-05 | Profile module QA validation            | Profile   | Includes display name update, avatar upload                   |
| MP-06 | Profile production release (v0.6.0)     | Profile   | Follows completed Profile QA                                  |
| MP-07 | Expand E2E suite — Budget flows         | Budget    | Add Budget CRUD to smoke suite after module validates         |
| MP-08 | Expand E2E suite — Tasks flows          | Tasks     | Add Tasks CRUD to smoke suite after module validates          |
| MP-09 | GitHub Actions CI pipeline              | Infra     | Run `npm run typecheck` and `npm test` on every PR            |

---

## Low Priority

| ID    | Item                                    | Module    | Notes                                                         |
|-------|-----------------------------------------|-----------|---------------------------------------------------------------|
| LP-01 | Timezone-aware `today()` in Habits      | Habits    | Currently UTC; users in UTC+ see wrong date near midnight     |
| LP-02 | Tab focus trap in habit modal           | Habits    | WCAG 2.1 AA requirement; Escape key already works             |
| LP-03 | `DATABASE_URL` migration tooling        | Infra     | Reserve for Drizzle ORM if direct Postgres access needed      |
| LP-04 | Playwright CI integration               | Infra     | Run E2E suite in GitHub Actions against preview deployment    |
| LP-05 | Supabase storage integration for avatar | Profile   | `SupabaseStorageProvider` exists; wire into profile upload    |
| LP-06 | Habit tags / categories                 | Habits    | User-defined tags for grouping habits                         |
| LP-07 | Pagination on habits list               | Habits    | MAX_PER_USER is 50; pagination needed beyond that             |

---

## Future Ideas

| ID    | Idea                                    | Notes                                                         |
|-------|-----------------------------------------|---------------------------------------------------------------|
| FI-01 | Mobile app (React Native / Expo)        | Share business logic via shared package                       |
| FI-02 | Habit streaks leaderboard               | Social feature; requires user consent and privacy review      |
| FI-03 | Email digest (weekly habit summary)     | Supabase Edge Function + SendGrid                             |
| FI-04 | CSV export for all modules              | Budget reports, habit history                                 |
| FI-05 | Dark/light theme toggle                 | Tailwind supports it; `prefers-color-scheme` already wired    |
| FI-06 | Webhook integrations                    | Push habit completions to Zapier, Make, etc.                  |
| FI-07 | Multi-currency support in Budget        | Requires locale detection + currency formatting               |
| FI-08 | Recurring budget items                  | Monthly fixed expenses auto-populated                         |
