# Changelog

All releases follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

Changes targeting v0.2.0 (Budget module) will appear here as work progresses.

---

## [0.1.0] — 2026-08-04

### Added

**Habits Module**
- Create, edit, archive, restore, and delete habits
- Daily and weekly frequency tracking with configurable target count
- Per-habit color coding (10 preset colors)
- Maximum 50 active habits per user (enforced server-side)
- Log a habit entry for today with a single click
- Undo a log entry
- Idempotent logging — same habit, same day updates note instead of erroring
- "Logged today" state hydrated from server on every page load (no stale state on refresh)
- Archive tab with restore workflow

**API — Habits**
- `GET /api/habits` — list all habits for authenticated user
- `POST /api/habits` — create a habit (enforces 50-habit limit)
- `GET /api/habits/entries?from=&to=` — bulk entries for all habits by date range
- `GET /api/habits/[id]` — single habit
- `PATCH /api/habits/[id]` — update name, description, frequency, target, color, archived state
- `DELETE /api/habits/[id]` — permanent deletion
- `GET /api/habits/[id]/entries?from=&to=` — entries for one habit
- `POST /api/habits/[id]/entries` — log an entry
- `DELETE /api/habits/[id]/entries?date=` — remove a log entry

**Authentication**
- Register with email, password, display name
- Login with email and password
- Logout (revokes session via Supabase admin API)
- JWT session cookie (`gah_session`, 7-day TTL)
- `PATCH /api/profile` — display name update

**Dashboard**
- Active habits count, completion rate, current streak, longest streak
- Your Habits preview (up to 5)
- Last 7 days bar chart

**Infrastructure**
- Next.js 16.2.11 (App Router, Turbopack)
- React 19.2.4
- Supabase JS v2 with service role (bypasses RLS server-side)
- Row Level Security on all 8 database tables (migration 004)
- Dependency injection via singleton container
- `NullAIProvider` — AI features degrade gracefully without `OPENAI_API_KEY`
- `.nvmrc` pinning Node 20 for Vercel
- E2E smoke test suite (33 tests, Playwright, targets production URL)
- 98 unit test cases across 5 service files

### Fixed

- BUG-001: Duplicate habit log on same day caused DB constraint error
- BUG-002: No GET endpoint for habit entries
- BUG-003: "Log Today" always shown after page refresh (stale client state)
- BUG-004: `deleteEntry` silently swallowed database errors
- BUG-005: No archive/restore UI despite service layer support
- BUG-006: No Escape key handler on create/edit modal
- BUG-007: Navigation had no active state indicator
- BUG-008: No mobile navigation (hamburger menu)
- BUG-009: Editing a habit could not clear the description field
- BUG-010: `MAX_PER_USER` config constant never enforced in service
- BUG-011: Entry query methods not exposed above repository layer
- BUG-012: Service layer had only 5 unit tests
- BUG-013: `update()` and `delete()` missing `user_id` ownership filter
- BUG-014: `CreateHabitDto.description` rejected `null` — returned 422 on creation without description
- DEP-001: TypeScript dead comparison in `layout.tsx` blocked Vercel build
- DEP-002: Missing `color` field in budget/tasks test fixtures failed TypeScript
- DEP-003: `output: 'standalone'` in `next.config.ts` blocked Vercel serverless build
- DEP-004: `DATABASE_URL` required but not used; crashed app on Vercel
- DEP-005: `OPENAI_API_KEY` required; app crashed on startup without it
- DEP-006: No Node version pinned; Vercel auto-selected wrong version

### Security

- Row Level Security policies applied to all 8 tables (migration 004)
- `user_id` ownership checks on all write operations
- Service role key restricted to server-side only; never sent to browser
- `gah_session` cookie: `httpOnly`, `sameSite: lax`, 7-day TTL

### Known Limitations

- No Next.js `middleware.ts` for route protection (unauthenticated requests see brief spinner before API 401)
- `today()` uses UTC time (timezone issue for UTC+ users near midnight)
- No Tab focus trap in create/edit modal
- `src/proxy.ts` exists but is inactive

---

_Dates are in YYYY-MM-DD format (UTC)._
