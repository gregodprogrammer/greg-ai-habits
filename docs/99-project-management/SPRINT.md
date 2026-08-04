# Sprint Tracker

_Last updated: 2026-08-04_

---

## Current Sprint — Budget Validation

**Goal:** Validate the Budget module to production-ready standard and release as v0.2.0.

**Sprint Start:** 2026-08-04  
**Target End:** TBD

---

## Completed (This Cycle)

| Item                                                  | Commit    | Date       |
|-------------------------------------------------------|-----------|------------|
| Resolve 13 Habits module bugs (BUG-001 – BUG-013)    | `d6b2609` | 2026-08-04 |
| Fix BUG-014: CreateHabitDto rejected null description | `dc30b43` | 2026-08-04 |
| Resolve 5 Vercel deployment blockers                  | `0aba1c2` | 2026-08-04 |
| `NullAIProvider` — graceful AI degradation            | `eafb59f` | 2026-08-04 |
| Create `docs/deployment/` (6 files)                   | `0aba1c2` | 2026-08-04 |
| E2E smoke test suite — 33 tests across 5 files        | `f345a1f` | 2026-08-04 |
| Habits module accepted at 97/100                      | —         | 2026-08-04 |
| v0.1.0 deployed to https://greg-ai-habits.vercel.app  | —         | 2026-08-04 |
| Initialize engineering documentation system           | `4fd7609` | 2026-08-01 |

---

## In Progress

| Item                            | Owner | Status          | Notes                              |
|---------------------------------|-------|-----------------|------------------------------------|
| Budget module QA validation     | —     | Not yet started | Starting next session              |

---

## Waiting

| Item                                  | Blocked By                        |
|---------------------------------------|-----------------------------------|
| Tasks module QA                       | Budget module QA completion       |
| Analytics module QA                   | Tasks module QA completion        |
| AI Coach module QA                    | Analytics module QA completion    |
| Profile module QA                     | AI Coach module QA completion     |
| v1.0.0 Full Suite release             | All modules released              |

---

## Blocked

None currently.

---

## Previous Sprints

### Sprint 1 — Habits Foundation (2026-07-22 to 2026-08-03)

| Item                                           | Commit    | Status  |
|------------------------------------------------|-----------|---------|
| Auth system (register, login, logout, JWT)     | various   | Done    |
| Habits CRUD (create, edit, archive, delete)    | various   | Done    |
| Habit log entries (log, undo, idempotent)      | various   | Done    |
| Analytics service (streaks, completion rates)  | various   | Done    |
| Budget module initial build                    | `b2a1d15` | Done    |
| Tasks module initial build                     | `c79a634` | Done    |
| Dashboard with stat cards                      | various   | Done    |
| Supabase RLS migrations (001–004)              | various   | Done    |
| Engineering documentation system              | `4fd7609` | Done    |
