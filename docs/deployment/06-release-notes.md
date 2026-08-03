# Release Notes — v0.1.0

| Field | Value |
|---|---|
| **Version** | 0.1.0 |
| **Commit** | dc30b43 (pre-deployment) → to be updated with release commit |
| **Branch** | main |
| **Release Date** | 2026-08-04 |
| **Release Type** | Initial Production Release |
| **Habits Module** | Production Readiness Score: 97/100 |

---

## What's in this release

This is the first production release of **Greg AI Habits**, an AI-powered productivity platform. This release activates the **Habits module** as the first fully validated feature module.

### Habits Module (v0.1.0)

**Core features:**
- Create, edit, archive, restore, and delete habits
- Daily and weekly frequency tracking
- Per-habit color coding
- Maximum 50 active habits per user (enforced server-side)

**Logging:**
- Log a habit entry for today with a single click
- Undo a log entry
- Entries are idempotent — logging the same habit twice in a day updates the note instead of creating a duplicate
- "Logged today" state is hydrated on page load (no stale state on refresh)

**API:**
- `GET /api/habits` — list all habits
- `POST /api/habits` — create a habit (with limit enforcement)
- `GET /api/habits/entries?from=&to=` — bulk entries for all habits (date range)
- `GET /api/habits/[id]` — single habit
- `PATCH /api/habits/[id]` — update a habit
- `DELETE /api/habits/[id]` — delete a habit
- `GET /api/habits/[id]/entries?from=&to=` — entries for one habit
- `POST /api/habits/[id]/entries` — log an entry
- `DELETE /api/habits/[id]/entries?date=` — remove a log entry

**Security:**
- Row Level Security active on all 8 database tables (migration 004)
- Server-side ownership checks on every write operation
- Service role key used server-side only, never exposed to browser

**Accessibility:**
- `role="dialog"` and `aria-modal` on the create/edit modal
- `role="status"` and `aria-label` on loading spinners
- `aria-current="page"` on active navigation links
- `aria-label` on all icon-only buttons
- `aria-pressed` on color swatch buttons

**Responsive design:**
- Desktop: fixed sidebar with navigation
- Mobile (≤ 640px): header with hamburger menu and slide-down navigation

### Infrastructure

- Next.js 16.2.11 (App Router, Turbopack)
- React 19.2.4
- Supabase JS v2.109
- Zod validation on all API inputs
- Dependency injection via singleton container
- 22 unit tests (all passing)

---

## Bugs fixed before this release

| ID | Severity | Description |
|---|---|---|
| BUG-001 | Critical | Re-logging a habit on the same day threw a database constraint error |
| BUG-002 | Critical | No GET endpoint for habit entries |
| BUG-003 | Critical | "Log Today" always shown after page refresh |
| BUG-004 | High | deleteEntry silently swallowed DB errors |
| BUG-005 | High | No archive/restore UI |
| BUG-006 | High | Modal had no Escape key handler |
| BUG-007 | High | Navigation had no active state |
| BUG-008 | High | No mobile navigation |
| BUG-009 | High | Edit habit could not clear the description |
| BUG-010 | Medium | MAX_PER_USER limit existed in config but was never enforced |
| BUG-011 | Medium | Entry query methods not exposed above repository layer |
| BUG-012 | Low | Service layer had only 5 tests |
| BUG-013 | Low | update() and delete() missing user_id filter |
| BUG-014 | High | Creating a habit without description returned 422 (DTO rejected null) |

### Deployment fixes (this release)

| Fix | Description |
|---|---|
| TypeScript error in layout.tsx | Dead comparison `item.href !== '/'` removed — nav items never include `/` |
| TypeScript errors in budget/tasks tests | Missing `color` field in DTO test fixtures |
| `output: standalone` | Made conditional on `NEXT_STANDALONE=true` (Dockerfile only) — Vercel uses serverless pipeline |
| `DATABASE_URL` required | Changed to optional — app uses Supabase JS, not direct Postgres |
| Node version | Added `.nvmrc` pinning Node 20 |

---

## Known Limitations (not blocking release)

| Limitation | Impact | Planned Fix |
|---|---|---|
| No Next.js `middleware.ts` for route protection | Unauthenticated users navigating to `/habits` see a spinner briefly before API 401 redirects. Data is never exposed. | Auth hardening session |
| `today()` uses UTC time | Users in UTC+ timezones may see tomorrow's date near midnight local time | Profile timezone support |
| No Tab focus trap in modal | WCAG 2.1 recommends full trap. Escape key works. | Accessibility hardening session |
| `src/proxy.ts` unused | Auth redirect middleware exists but is named incorrectly (`proxy.ts` instead of `middleware.ts`). | Auth hardening session |

---

## Deployment risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Supabase cold start latency | Low | Medium | Supabase always-on; no cold start |
| Vercel function cold start on first request | Medium | Low | < 500ms; acceptable for MVP |
| OpenAI API rate limit | Low | Low | Only affects AI Coach feature; Habits unaffected |
| Missing env variable on Vercel | Low | High | Follow `02-production-environment.md` checklist exactly |
| Database migration not applied | Low | Critical | Verify all 4 migrations before deploying |

---

## Rollback strategy

See `05-rollback-guide.md`. Vercel instant rollback restores the previous deployment in < 1 minute with no code changes required.

---

## Next releases

- **v0.2.0** — Budget module (pending Habits production verification)
- **v0.3.0** — Tasks module
- **v0.4.0** — Analytics module
- **v0.5.0** — AI Coach module
- **v1.0.0** — Full platform launch
