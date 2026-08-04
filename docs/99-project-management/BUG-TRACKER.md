# Bug Tracker

_Last updated: 2026-08-04_

---

## Open Bugs

None.

---

## Closed Bugs

### Habits Module — v0.1.0

| Bug ID  | Module  | Severity | Description                                         | Root Cause                                                   | Fix                                                             | Commit    | Status |
|---------|---------|----------|-----------------------------------------------------|--------------------------------------------------------------|-----------------------------------------------------------------|-----------|--------|
| BUG-001 | Habits  | Critical | Re-logging the same habit on the same day threw a DB constraint error | No upsert logic; duplicate key on `(habit_id, logged_date)` | Changed `INSERT` to `UPSERT` (ON CONFLICT DO UPDATE)            | `d6b2609` | Closed |
| BUG-002 | Habits  | Critical | No GET endpoint existed for habit entries           | `GET /api/habits/entries` route was missing entirely         | Added `GET /api/habits/entries?from=&to=` route                 | `d6b2609` | Closed |
| BUG-003 | Habits  | Critical | "Log Today" button always appeared after page refresh | Client state not hydrated from server on load               | `GET /api/habits/entries?from=today&to=today` called on mount   | `d6b2609` | Closed |
| BUG-004 | Habits  | High     | `deleteEntry` silently swallowed DB errors          | Missing error propagation in repository layer                | Added error check and throw in `deleteEntry`                    | `d6b2609` | Closed |
| BUG-005 | Habits  | High     | No archive/restore UI                               | Feature existed in service but had no UI buttons             | Added Archive button on active habits, Restore on archived tab   | `d6b2609` | Closed |
| BUG-006 | Habits  | High     | Modal had no Escape key handler                     | No `keydown` listener on modal                               | Added `window.addEventListener('keydown')` on modal open        | `d6b2609` | Closed |
| BUG-007 | Habits  | High     | Navigation had no active state indicator            | All nav links rendered identically regardless of path        | Added `aria-current="page"` and active class via `usePathname`  | `d6b2609` | Closed |
| BUG-008 | Habits  | High     | No mobile navigation                                | Layout only had a desktop sidebar; no mobile drawer          | Added mobile header with hamburger + slide-down nav drawer      | `d6b2609` | Closed |
| BUG-009 | Habits  | High     | Edit habit could not clear the description field    | `UpdateHabitDto` treated empty string as no-op               | Send `null` explicitly when description is empty; backend clears| `d6b2609` | Closed |
| BUG-010 | Habits  | Medium   | `MAX_PER_USER` limit was never enforced             | Config constant defined but no service check existed         | Added pre-create count check in `HabitsService.create()`        | `d6b2609` | Closed |
| BUG-011 | Habits  | Medium   | Entry query methods not exposed above repository    | `getEntriesForHabit` / `getEntriesForAllHabits` only in repo  | Exposed methods through `HabitsService`                         | `d6b2609` | Closed |
| BUG-012 | Habits  | Low      | Service layer had only 5 unit tests                 | Test coverage was minimal                                    | Expanded to 22 tests covering all service methods               | `d6b2609` | Closed |
| BUG-013 | Habits  | Low      | `update()` and `delete()` missing `user_id` filter  | Repository queries filtered by `id` only, not `(id, user_id)` | Added `user_id` to all write-path WHERE clauses                 | `d6b2609` | Closed |
| BUG-014 | Habits  | High     | Creating a habit without a description returned 422 | `CreateHabitDto.description` was `z.string().optional()` — rejected `null` | Changed to `.nullish()` to match frontend which sends `null` | `dc30b43` | Closed |

### Deployment Fixes — v0.1.0

| Bug ID  | Area        | Severity | Description                                           | Fix                                             | Commit    | Status |
|---------|-------------|----------|-------------------------------------------------------|-------------------------------------------------|-----------|--------|
| DEP-001 | TypeScript  | High     | Dead comparison in `layout.tsx` blocked build         | Removed `item.href !== '/'` guard               | `0aba1c2` | Closed |
| DEP-002 | TypeScript  | High     | Missing `color` field in budget/tasks test fixtures   | Added `color: '#6366f1'` to DTO test objects    | `0aba1c2` | Closed |
| DEP-003 | Infra       | Critical | `output: 'standalone'` broke Vercel serverless build  | Made conditional on `NEXT_STANDALONE=true`      | `0aba1c2` | Closed |
| DEP-004 | Infra       | High     | `DATABASE_URL` required but never used; crashed Vercel | Changed to `z.string().optional()`             | `0aba1c2` | Closed |
| DEP-005 | Infra       | High     | `OPENAI_API_KEY` required; app crashed without it    | Made optional; `NullAIProvider` handles absence | `eafb59f` | Closed |
| DEP-006 | Infra       | Medium   | No Node version pinned; Vercel used wrong version     | Added `.nvmrc` with `20`                        | `0aba1c2` | Closed |

---

## Bug ID Sequence

Next available Bug ID for Habits: **BUG-015**  
Next available Bug ID for Budget: **BUG-B001**  
Next available Bug ID for Tasks: **BUG-T001**  
Next available Bug ID for Analytics: **BUG-A001**  
Next available Bug ID for AI Coach: **BUG-AI001**  
Next available Bug ID for Profile: **BUG-P001**
