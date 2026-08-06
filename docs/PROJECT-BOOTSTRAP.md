# PROJECT BOOTSTRAP

This document is the definitive entry point for every future engineer or AI working on the Greg AI Habits repository. Before any engineering work begins, read this file completely. It supersedes all historical notes and serves as the single source of truth for project context, scope, and process.

---  
## 1 Executive Summary
Greg AI Habits is a full‑stack productivity platform built on Next.js that helps users track habits, manage budgets, tasks, analytics, and AI‑driven coaching. The platform serves individuals seeking personal productivity insights and enterprises that need lightweight workforce analytics. It is currently production‑ready for a subset of modules (Auth, Habits) and is being prepared for broader release. The vision is to deliver a unified, AI‑enhanced personal productivity ecosystem that can be extended with additional modules while preserving a consistent architecture and quality baseline.

---  
## 2 Technology Stack
- **Framework**: Next.js 16 (React 19) – hybrid server‑/edge rendering.  
- **Language**: TypeScript.  
- **Package Manager**: npm (v10).  
- **Database**: PostgreSQL via Supabase (RLS policies, migrations 001‑004).  
- **Authentication**: Supabase Auth with JWT sessions; RLS enforced on all tables.  
- **Hosting**: Vercel (automated preview → production pipelines).  
- **Testing**: Jest (unit), Playwright (E2E smoke suite).  
- **CI/CD**: GitHub Actions (planned), Vercel deployments on push to `main`.  
- **AI Integration**: OpenAI provider abstraction; `NullAIProvider` for graceful degradation when `OPENAI_API_KEY` is missing.  
- **Deployment**: Docker‑compatible standalone output (optional); primary deployment via Vercel.  

Key reference docs: `/docs/05-deployment/README.md`, `next.config.ts`, `/src/config/env.ts`.

---  
## 3 Repository Structure
```
/src
 ├─ app/                # Next.js pages & routes
 ├─ features/           # Feature domains (budget, tasks, analytics, habit, ai‑coach, profile)
 │   ├─ <module>/       # DTOs, repositories, services, UI
 │   └─ <module>.tsx    # Page components
 ├─ infrastructure/    # DB client, logger, providers
 ├─ shared/            # Utils, types, UI primitives
 ├─ providers/         # Third‑party integrations (Supabase, OpenAI, Storage)
 └─ config/            # Env schema, constants, route utils

/docs
 ├─ 01‑architecture/   # Design docs, diagrams
 ├─ 02‑deployment/     # Vercel, Docker, env setup
 ├─ 03‑development/    # Git workflow, coding standards
 ├─ 04‑database/       # Schema, migrations
 ├─ 05‑prompts/        # Review & audit prompts
 └─ 99‑project‑management/ # Board, status, roadmap, CI docs

Root files
 ├─ next.config.ts
 ├─ package.json
 ├─ tsconfig.json
 └─ .env.example
```

New modules belong under `src/features/<module>/` and corresponding UI under `src/app/(<domain>)/`. Documentation for new features resides under `/docs/01‑architecture/` or module‑specific sub‑folders.

---  
## 4 Architecture
- **Frontend**: Next.js pages with server‑side rendering for SEO; UI components in `shared/ui/`.  
- **Backend**: API routes under `src/app/api/`, thin handlers that delegate to feature services.  
- **Database**: Supabase tables with Row‑Level Security; migrations in `/src/infrastructure/db/migrations/`.  
- **Authentication**: Supabase Auth flow; protected routes defined in `src/proxy.ts`.  
- **Repositories**: Thin data‑access layers (`features/<module>/repository.ts`) that use the Supabase client.  
- **Services**: Business‑logic layer (`features/<module>/service.ts`) that orchestrates repositories and domain rules.  
- **DTOs & Validation**: Type‑safe request/response objects validated with Zod (`src/config/env.ts` schema).  
- **Testing**: Unit tests (`jest`), E2E smoke suite (`playwright`). Test coverage required before release.  
- **Deployment**: Vercel auto‑deploy; edge middleware (`src/proxy.ts`) handles auth redirects.  

See `/docs/01-architecture/` for detailed diagrams and component responsibilities.

---  
## 5 Project Status
- **Completed Modules**: Auth (register, login, logout, JWT, RLS), Habits (CRUD, logging, streak analytics), Core UI infrastructure, Documentation system, E2E smoke suite (33 tests).  
- **In‑Progress**: Budget module QA & validation (current sprint).  
- **Remaining Modules**: Tasks, Analytics, AI Coach, Profile (all in design/initial implementation).  
- **Current Sprint Goal**: Validate Budget module to production‑ready standard and release as `v0.2.0`.  
- **Priorities**: Complete Budget QA, assign quality score, update board, push release.  
- **Technical Debt**: CI pipeline not yet configured; `src/proxy.ts` auth middleware not fully active; comprehensive end‑to‑end test coverage still being expanded.  
- **Production Readiness**: Auth and Habits are live at `https://greg-ai-habits.vercel.app`. Budget will be production‑ready upon successful QA.

For an up‑to‑date view, consult `docs/99-project-management/PROJECT-BOARD.md` and `docs/99-project-management/CURRENT-STATUS.md`.

---  
## 6 Source of Truth
The following documents are authoritative at all times:
- **PROJECT‑BOARD.md** – current backlog, module status, blockers.  
- **CURRENT‑STATUS.md** – snapshot of branch, completed work, quality scores.  
- **ENGINEERING‑KIT.md** (planned) – standardized tooling guide.  
- **LATEST‑SESSION** – most recent team sync notes.  
- **DEPLOYMENT‑DOCS** (`docs/05-deployment/`) – release process and environment config.  
- **ARCHITECTURE‑DOCS** (`docs/01-architecture/`) – design decisions and component responsibilities.  

All engineering decisions must reference these sources; never rely on historical journals for current state.

---  
## 7 Historical Documents
Treat the following as reference only. They describe past design iterations and should never override the sources listed in Section 6.
- Legacy `CLAUDE.md` (MigraVault deployment reference).  
- Older `README.md` versions mentioning Next.js 13.  
- Early architecture sketches pre‑Supabase migration.  
- Deprecated CI configuration files.  

These files may aid understanding of design rationale but are not normative.

---  
## 8 Engineering Workflow
1. **Planning** – Review current sprint goals in `PROJECT-BOARD.md`; create a dedicated task in the task list (`TaskCreate`).  
2. **Implementation** –  
   - Add new feature under `src/features/<module>/`.  
   - Follow the module scaffold (`DTOs → Repository → Service → API → UI`).  
   - Write/modify unit tests; ensure `npm run test` passes.  
   - Update relevant documentation in `/docs/01-architecture/`.  
3. **Testing** – Run Jest and Playwright suites; add new tests covering all code paths.  
4. **Documentation** – Add or update API docs, user guides, and architecture notes as needed.  
5. **Review** – Submit a Pull Request; get at least one reviewer approval.  
6. **Merge & Deploy** – Merge to `main`; Vercel automatically builds and deploys. Verify the deployment URL.  
7. **Verification** – Run the full E2E suite against the deployed preview; confirm no regressions.  

All steps must be recorded in the task list; mark the task `completed` only after successful deployment verification.

---  
## 9 Deployment Workflow
1. **Branch** – Work on a feature branch named `feat/<module>-<short‑desc>`.  
2. **Push** – Push to remote; Vercel creates a preview URL.  
3. **Manual QA** – Verify functionality on the preview.  
4. **Merge** – Merge to `main` after PR approval.  
5. **Vercel Build** – Automatic production build; watch the deployment logs for errors.  
6. **Post‑Deploy Checks** –  
   - Run `npm run test:e2e` against the new production URL.  
   - Confirm environment variables are set (see `.env.example`).  
   - Ensure auth cookies and RLS policies are functioning.  
7. **Release Tag** – Create a semantic version tag (`vX.Y.Z`) and push.  
8. **Update Docs** – Record release notes in `CHANGELOG.md` and update `PROJECT-BOARD.md` with the new version row.  

Refer to `docs/05-deployment/RELEASE-CHECKLIST.md` for a detailed checklist.

---  
## 10 Testing Workflow
- **Unit Tests** – Cover all DTOs, repository functions, and service logic. Run `npm test` locally; CI must pass.  
- **E2E Smoke Suite** – Executed via `npm run test:e2e`. Tests hit the live deployment URL; coverage must remain at 100 % for critical flows.  
- **Test Data** – Use Supabase migration `001_initial.sql` to seed a local/dev DB; never commit test data.  
- **Coverage** – Maintain ≥ 90 % line coverage on new modules; review `coverage` report before merging.  
- **Test Reporting** – Generate a report with `npm run test:e2e:report` and attach to the PR description.

---  
## 11 Common Commands
```bash
# Git
git status
git log --oneline -5
git checkout -b feat/<module>-<desc>

# npm scripts
npm install
npm run dev          # start dev server
npm run build        # generate production build
npm start            # run built app
npm test             # Jest unit tests
npm run test:e2e     # Playwright smoke suite
npm run test:e2e:report  # view E2E report

# Supabase
supabase login
supabase start       # local dev supabase instance
npm run db:migrate   # apply migrations

# Vercel
vercel               # deploy manually (if not auto)
vercel logs --prod   # view production logs
```

---  
## 12 Coding Standards
- **Type Safety** – All new code must be fully typed with TypeScript; use Zod for runtime validation.  
- **Commit Messages** – Conventional commits (`feat(): add budget CRUD`, `fix(): correct validation edge case`). No AI or author tags.  
- **File Naming** – PascalCase for component files, kebab‑case for API routes and folders.  
- **Linting** – ESLint rules enforced via `npm run lint`; no `console.log` in production code.  
- **API Contracts** – DTO shapes must be exported from a central `types/` file for reuse.  
- **Error Handling** – All async functions must return a rejected promise on failure; no silent catches.  
- **Documentation** – JSDoc comments for all exported functions; update corresponding markdown docs when signatures change.  

See `/docs/03-development/ENGINEERING-DIRECTIVES.md` for a comprehensive style guide.

---  
## 13 Project Roadmap
1. **Budget Module** – Complete QA, release v0.2.0 (current sprint).  
2. **Tasks Module** – Implement CRUD, integrate with habit streaks, begin QA.  
3. **Analytics Module** – Build dashboard visualizations, add unit/playwright tests.  
4. **AI Coach Module** – Implement optional OpenAI integration, fallback to `NullAIProvider`.  
5. **Profile Module** – Consolidate user settings, preferences, and profile data.  
6. **Full Suite Release (v1.0)** – All modules released, comprehensive end‑to‑end test coverage, CI pipeline enabled.  

The order reflects dependencies: each subsequent module assumes the prior module’s data model and API contract are stable.

---  
## 14 AI Working Agreement
- Every AI assistant **MUST** read `PROJECT-BOOTSTRAP.md` before engaging with the codebase.  
- After reading, the AI may only reference **PROJECT-BOARD.md**, **CURRENT-STATUS.md**, and the **SOURCE OF TRUTH** documents listed in Section 6 for current context.  
- **Never** infer project status from historical journals or outdated markdown files.  
- Work exclusively within the **current sprint** scope; do not modify modules outside the active task set.  
- Preserve existing architecture; extend only through well‑defined service/repository interfaces.  
- All AI‑generated changes must follow the coding standards and be accompanied by appropriate unit tests.  

---  
## 15 Project Health
| Metric                | Score (out of 10) | Comment |
|-----------------------|-------------------|---------|
| Engineering Maturity  | 8                 | Clear folder conventions, documented API contracts. |
| Architecture Score    | 9                 | Clean separation of concerns, RLS enforced. |
| Documentation Score   | 7                 | Comprehensive guides, but deployment CI still pending. |
| Deployment Score      | 6                 | Automated Vercel deployments; manual steps required for final verification. |
| Testing Score         | 8                 | Strong unit coverage; E2E suite expanding. |
| Maintainability Score | 8                 | Consistent naming, conventional commits. |
| Scalability Score     | 7                 | Modular feature slices; room for micro‑service extraction. |

---  
*Commit message for this bootstrap file:*  
`docs: add PROJECT-BOOTSTRAP.md – definitive onboarding guide for engineers and AI`