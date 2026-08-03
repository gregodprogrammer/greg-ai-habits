# Claude Code Session Recovery Guide

| Field | Value |
|---|---|
| **Purpose** | Permanent onboarding guide for new Claude Code sessions resuming work on this repository |
| **Audience** | Claude Code sessions, future Documentation Engineers, new developers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-03 |
| **Related Documents** | [Project Journal README](README.md) · [Most Recent Session](SESSION-003.md) |

---

## Why This Document Exists

Claude Code sessions do not carry memory between conversations. When a session ends —
whether due to a planned shutdown, a system crash, or a context-limit reset — the next
Claude Code session starts with zero knowledge of prior work.

This document solves that problem. It tells every future Claude Code session:

- What this repository is.
- What the engineering standards are.
- How to resume work safely.
- How to maintain the documentation system.

Every future Documentation Engineer (human or Claude) should read this file at the start
of every session before touching any code or documentation.

---

## What This Repository Is

**greg-ai-habits** is the first production-grade repository in the **Greg AI Labs** ecosystem.

It is a full-stack AI productivity platform built with:

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Supabase** (PostgreSQL + Auth + Storage)
- **OpenAI API** (provider-abstracted)
- **Zod** (validation)
- **Jest** (testing)
- **Docker** (containerization)
- **GitHub Actions** (CI/CD)

The application has five active feature modules: Habits, Budget, Tasks, Analytics, and AI Coach.
Three more are planned: CRM, Knowledge Base, Career Assistant.

---

## Engineering Standards (Non-Negotiable)

Every Claude Code session must uphold these standards without exception:

| Standard | Rule |
|---|---|
| Architecture | Services own business logic. Repositories own database access. API Routes are thin. Providers abstract vendors. |
| Dependency Injection | All dependencies must flow through `src/shared/lib/container.ts`. No direct imports of Supabase or OpenAI in feature code. |
| Type Safety | All inputs validated with Zod DTOs. All shared types defined in `src/shared/types/index.ts`. |
| Commits | Conventional Commits format required. Every commit must describe the *why*, not just the *what*. |
| Tests | Every new Service must have a corresponding `__tests__/` file with mocked dependencies. |
| Documentation | Every session must produce at least one journal entry before work ends. |
| Environment | Secrets live in `.env.local` only. Never commit secrets. `.env.example` is the public template. |

---

## Session Recovery Protocol

When starting a new Claude Code session, follow these steps in order:

### Step 1 — Read the most recent session log

```
docs/00-project-journal/SESSION-NNN.md
```

The session log tells you what was completed, what was decided, and what is currently blocked.

### Step 2 — Read the current blockers

The "Current Blocker" and "Next Investigation Steps" sections at the bottom of the most
recent session log are your starting point. Do not skip past a blocker without resolving it
or making a deliberate decision to defer it.

### Step 3 — Verify the codebase state

```bash
git log --oneline -10
git status
npm test
```

Confirm:
- Which commits are on main.
- Whether there are any uncommitted changes.
- Whether the test suite is currently passing.

### Step 4 — Verify the environment

Confirm `.env.local` exists and contains non-placeholder values for:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `OPENAI_API_KEY`

### Step 5 — Begin work

Only begin implementing or debugging after the above steps are complete.

### Step 6 — End the session

Before closing the conversation:
1. Update the current `SESSION-NNN.md` with what was completed.
2. Record any new blockers in the session log.
3. Record any new architecture decisions as ADRs in `02-architecture-decisions/`.
4. Record any useful prompts in `07-prompts/`.
5. Create a git commit for all changes (code + documentation together).

---

## How Engineering History Is Preserved

Engineering history lives in two places:

1. **Git history** — the immutable record of every code change. Use `git log` to see it.
2. **docs/00-project-journal/** — the human-readable narrative of *why* each change was made.

Both must be maintained. Git tells you *what* changed. The journal tells you *why*.

---

## Documentation Maintenance Rules

The Documentation Engineer role is permanent. Every Claude Code session that performs
engineering work is responsible for maintaining this documentation.

**Rules:**

1. Never let the documentation fall more than one session behind the code.
2. When a new feature module is added, update `01-architecture/SYSTEM-OVERVIEW.md` and `01-architecture/FOLDER-STRUCTURE.md`.
3. When a new migration is written, update `04-database/MIGRATIONS.md` and `04-database/DATABASE-SCHEMA.md`.
4. When a new environment variable is added, update `05-deployment/ENVIRONMENT-VARIABLES.md` and `.env.example`.
5. When a bug is resolved, document it in `06-troubleshooting/TROUBLESHOOTING-INDEX.md`.
6. When a useful Claude prompt is discovered, save it to `07-prompts/`.
7. When a deployment is performed, update `05-deployment/` and note the date/version in the session log.

---

## Greg AI Labs Ecosystem Context

This repository contributes to a larger learning ecosystem. Documentation created here will
eventually feed into:

- An eBook on full-stack AI engineering
- A professional bootcamp curriculum
- A video course
- Instructor manuals
- Deployment playbooks
- Reusable Claude Code prompts

Write documentation with the assumption that a developer who has never seen this codebase
will need to understand it from reading the docs alone. Be precise. Be honest. Record
failures and blockers, not just successes.

---

## Contact

- Repository owner: Greg Odi (`greg.ethel@gmail.com`)
- GitHub: `gregodprogrammer`
