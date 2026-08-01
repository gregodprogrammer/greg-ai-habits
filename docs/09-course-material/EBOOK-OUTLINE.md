# eBook Outline

| Field | Value |
|---|---|
| **Purpose** | Chapter-by-chapter outline for the eBook derived from this project |
| **Audience** | Greg Odi (author) |
| **Status** | Outline only |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Book Title (Draft)

**"Full-Stack AI Engineering: Build Production-Grade Applications with Next.js, TypeScript, Supabase, and Claude Code"**

---

## Foreword

- Why this book exists.
- What the reader will build.
- Prerequisites.
- How to use this book alongside Claude Code.

---

## Part I — Foundation

### Chapter 1 — The Full-Stack Developer's Environment

- Node.js, npm, and nvm.
- WSL2 for Windows developers.
- VS Code and essential extensions.
- Git and GitHub.

### Chapter 2 — Introduction to Claude Code

- What Claude Code is and how it works.
- The limitation of session memory and the documentation solution.
- Writing effective engineering directives.
- The session recovery pattern.

### Chapter 3 — Architecture First

- Why architecture matters before writing code.
- The Layered Architecture: Providers, Repositories, Services, Routes, UI.
- The Repository Pattern.
- Dependency Injection without a framework.
- Interface-first design for testability.

---

## Part II — Building the Platform

### Chapter 4 — Project Setup

- Creating the Next.js project.
- TypeScript strict mode.
- Folder structure and naming conventions.
- Environment variable validation with Zod.

### Chapter 5 — Database Design with Supabase

- Introduction to Supabase.
- Designing the initial schema.
- Writing SQL migrations.
- The database client as infrastructure.

### Chapter 6 — Authentication

- Supabase Auth.
- HTTP-only cookie sessions in Next.js.
- The Auth Provider abstraction.
- Unit testing with mocked dependencies.

### Chapter 7 — Feature Modules: Habits

- Domain modeling for habits.
- Repository implementation with Supabase.
- Service layer and business logic.
- Thin API routes.
- Zod DTOs for input validation.

### Chapter 8 — Analytics and Aggregation

- Cross-table queries.
- The Analytics Service.
- Presenting streaks and completion rates.

### Chapter 9 — AI Integration

- The OpenAI API.
- Provider abstraction for vendor independence.
- Conversation history management.
- Module-specific AI coaching.

### Chapter 10 — Budget and Tasks Modules

- Applying the same patterns to new domains.
- Complex query patterns: summaries, stats, filters.

---

## Part III — Production Engineering

### Chapter 11 — Testing Strategy

- Unit tests with Jest.
- Mocking dependencies.
- What not to test.
- Test coverage goals.

### Chapter 12 — CI/CD with GitHub Actions

- Lint, typecheck, test, build pipeline.
- Docker containerization.
- Deployment to Vercel.

### Chapter 13 — Security Essentials

- Row Level Security in Supabase.
- Environment variable management.
- HTTPS and cookie security.
- Input validation at boundaries.

### Chapter 14 — Claude Code Engineering Workflow

- The documentation system.
- The prompt library.
- Architecture audits.
- The session-recovery pattern as institutional memory.

---

## Appendices

- A: Full database schema reference.
- B: Environment variables reference.
- C: Conventional Commits cheatsheet.
- D: Reusable Claude Code prompts.
- E: Troubleshooting guide.
