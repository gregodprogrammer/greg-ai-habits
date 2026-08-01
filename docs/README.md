# greg-ai-habits — Documentation

| Field | Value |
|---|---|
| **Purpose** | Root index for the permanent knowledge base of the greg-ai-habits repository |
| **Audience** | Engineers, Claude Code sessions, future onboarding developers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Overview

This `docs/` directory is the permanent knowledge base for the **greg-ai-habits** repository.
It records every significant engineering decision, session, architecture choice, deployment step,
and troubleshooting event for the lifetime of the project.

Every future Claude Code session should begin by reading the most recent entry in
`00-project-journal/` and the session-recovery guide before touching any code.

---

## Folder Map

| Folder | Purpose |
|---|---|
| [`00-project-journal/`](00-project-journal/README.md) | Chronological engineering session log |
| [`01-architecture/`](01-architecture/README.md) | System design, folder structure, data flow, dependency graph |
| [`02-architecture-decisions/`](02-architecture-decisions/README.md) | Architecture Decision Records (ADRs) |
| [`03-development/`](03-development/README.md) | Environment setup, WSL2, Git workflow, Claude Code workflow |
| [`04-database/`](04-database/README.md) | Supabase, migrations, schema reference |
| [`05-deployment/`](05-deployment/README.md) | GitHub, Supabase, Vercel, environment variables, release checklist |
| [`06-troubleshooting/`](06-troubleshooting/README.md) | Known issues, investigations, resolutions |
| [`07-prompts/`](07-prompts/README.md) | Reusable Claude Code engineering prompt library |
| [`08-checklists/`](08-checklists/README.md) | Daily, pre-commit, pre-deployment, and release checklists |
| [`09-course-material/`](09-course-material/README.md) | Outlines for eBook, course, and bootcamp |
| [`10-images/`](10-images/README.md) | Architecture diagrams and screenshots |

---

## Maintenance Rules

1. Every engineering session must produce at minimum one journal entry.
2. Every architecture decision must produce an ADR before implementation begins.
3. Every new environment variable must be added to `05-deployment/ENVIRONMENT-VARIABLES.md`.
4. Every migration must be documented in `04-database/MIGRATIONS.md`.
5. Every resolved bug must be recorded in `06-troubleshooting/TROUBLESHOOTING-INDEX.md`.
6. Prompts that proved useful must be saved to `07-prompts/` before the session ends.

---

## Related Documents

- [Session Recovery Guide](00-project-journal/CLAUDE-SESSION-RECOVERY.md)
- [Most Recent Session](00-project-journal/SESSION-001.md)
- [System Overview](01-architecture/SYSTEM-OVERVIEW.md)
