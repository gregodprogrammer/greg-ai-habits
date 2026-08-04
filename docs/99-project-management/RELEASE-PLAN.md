# Release Plan

_Last updated: 2026-08-04_

---

## v0.1.0 — Habits Module ✅ RELEASED

| Field             | Value                                |
|-------------------|--------------------------------------|
| Status            | Released                             |
| Release Date      | 2026-08-04                           |
| Quality Score     | 97/100                               |
| Commit            | `f345a1f`                            |
| Production URL    | https://greg-ai-habits.vercel.app    |

**Scope:**
- Habits CRUD: create, edit, archive, restore, delete
- Daily and weekly frequency tracking with target count
- Log Today / Undo log (idempotent upsert)
- "Logged today" state hydrated on page load
- Row Level Security on all 8 database tables
- Mobile-responsive navigation
- E2E smoke test suite (33 tests)
- 14 bugs resolved pre-release

---

## v0.2.0 — Budget Module ⬜ PLANNED

| Field             | Value                                |
|-------------------|--------------------------------------|
| Status            | Planned                              |
| Target Date       | TBD                                  |
| Quality Score     | Unscored (pending QA validation)     |
| Prerequisite      | Full source-code QA pass             |

**Scope:**
- Income and expense tracking
- Budget categories with color coding
- Monthly summary and balance calculation
- AI Budget Coach (degrades gracefully without `OPENAI_API_KEY`)
- E2E smoke test coverage for Budget flows
- Bug fixes discovered during QA

---

## v0.3.0 — Tasks Module ⬜ PLANNED

| Field             | Value            |
|-------------------|------------------|
| Status            | Planned          |
| Target Date       | TBD              |
| Prerequisite      | v0.2.0 released  |

**Scope:**
- Task management with projects and priorities
- Due dates and completion tracking
- AI Task Manager integration
- E2E smoke test coverage for Tasks flows

---

## v0.4.0 — Analytics Module ⬜ PLANNED

| Field             | Value            |
|-------------------|------------------|
| Status            | Planned          |
| Target Date       | TBD              |
| Prerequisite      | v0.3.0 released  |

**Scope:**
- Cross-module analytics dashboard
- Streak visualizations
- Weekly completion bar chart (currently on Dashboard)
- Historical data queries with date range filters

---

## v0.5.0 — AI Coach Module ⬜ PLANNED

| Field             | Value                                                       |
|-------------------|-------------------------------------------------------------|
| Status            | Planned                                                     |
| Target Date       | TBD                                                         |
| Prerequisite      | v0.4.0 released; `OPENAI_API_KEY` configured in production  |

**Scope:**
- Conversational AI coach interface
- Context-aware suggestions based on habit history
- NullAIProvider fallback already in place for deployments without key

---

## v0.6.0 — Profile Module ⬜ PLANNED

| Field             | Value            |
|-------------------|------------------|
| Status            | Planned          |
| Target Date       | TBD              |
| Prerequisite      | v0.5.0 released  |

**Scope:**
- Display name update
- Avatar upload via Supabase Storage
- Timezone preference (resolves TD-02 `today()` UTC issue)
- Account deletion

---

## v1.0.0 — Full Platform Suite ⬜ PLANNED

| Field             | Value                               |
|-------------------|-------------------------------------|
| Status            | Planned                             |
| Target Date       | TBD                                 |
| Prerequisite      | All modules released (v0.2.0–v0.6.0) |

**Scope:**
- All six modules production-validated
- Auth middleware hardened (TD-01, TD-06)
- GitHub Actions CI pipeline
- Full accessibility audit
- Performance audit
- Documentation complete for all modules
- Public launch

---

## Release Gate Criteria

Every module release must satisfy:

1. Full source-code QA pass (DTOs, service, repository, API routes, UI)
2. All discovered bugs resolved and logged in BUG-TRACKER.md
3. Quality score assigned (target: ≥ 90/100)
4. Unit test coverage for service layer
5. E2E smoke tests updated to cover new module flows
6. `npm run typecheck` passes
7. Production smoke test via `npm run test:e2e`
8. CHANGELOG.md updated
9. RELEASE-PLAN.md updated
