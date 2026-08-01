# Video Course Outline

| Field | Value |
|---|---|
| **Purpose** | Structural outline for the greg-ai-habits video course |
| **Audience** | Greg Odi (author), future instructors |
| **Status** | Outline only |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Course Title (Draft)

**"Build a Full-Stack AI Productivity Platform with Next.js, TypeScript, and Claude Code"**

---

## Target Audience

- Self-taught developers who know basic JavaScript/React.
- Developers transitioning from frontend-only to full-stack.
- Developers who want to learn professional software engineering patterns.
- Developers curious about AI-assisted development with Claude Code.

---

## Module Outline

### Module 1 — Development Environment Setup

- [ ] 1.1 — Installing Node.js via nvm
- [ ] 1.2 — WSL2 for Windows developers
- [ ] 1.3 — VS Code setup and extensions
- [ ] 1.4 — Introduction to Claude Code
- [ ] 1.5 — Creating a GitHub repository

### Module 2 — Project Foundation and Architecture

- [ ] 2.1 — Creating a Next.js 16 project
- [ ] 2.2 — TypeScript strict mode: why it matters
- [ ] 2.3 — The Repository Pattern explained
- [ ] 2.4 — Dependency Injection without a framework
- [ ] 2.5 — Designing the folder structure

### Module 3 — Supabase Integration

- [ ] 3.1 — Creating a Supabase account and project
- [ ] 3.2 — Writing SQL migrations
- [ ] 3.3 — The Supabase JS client
- [ ] 3.4 — Environment variables and Zod validation
- [ ] 3.5 — Provider abstraction: hiding Supabase from business logic

### Module 4 — Authentication

- [ ] 4.1 — Supabase Auth: email/password sign-up and login
- [ ] 4.2 — HTTP-only cookie sessions
- [ ] 4.3 — Auth middleware in Next.js App Router
- [ ] 4.4 — Building the login and registration pages
- [ ] 4.5 — Unit testing the auth service with mocks

### Module 5 — Habits Module

- [ ] 5.1 — Designing the habits database schema
- [ ] 5.2 — Building the Habits Repository
- [ ] 5.3 — Building the Habits Service
- [ ] 5.4 — Building the Habits API routes
- [ ] 5.5 — Building the Habits UI
- [ ] 5.6 — Unit tests and Zod DTOs

### Module 6 — Analytics Module

- [ ] 6.1 — Cross-table aggregation queries
- [ ] 6.2 — Analytics Repository and Service
- [ ] 6.3 — Analytics dashboard

### Module 7 — AI Integration

- [ ] 7.1 — Introduction to the OpenAI API
- [ ] 7.2 — Provider abstraction for AI
- [ ] 7.3 — Conversation history and context management
- [ ] 7.4 — Building the AI Coach feature
- [ ] 7.5 — Module-specific coaching (habits, budget, tasks)

### Module 8 — Budget Module

- [ ] 8.1 — Budget schema design (categories, transactions, plans)
- [ ] 8.2 — Budget Repository and Service
- [ ] 8.3 — Budget summary and category aggregation
- [ ] 8.4 — Budget UI

### Module 9 — Tasks Module

- [ ] 9.1 — Task schema design (projects, tasks, statuses, priorities)
- [ ] 9.2 — Tasks Repository and Service
- [ ] 9.3 — Task statistics endpoint
- [ ] 9.4 — Tasks UI

### Module 10 — CI/CD and Deployment

- [ ] 10.1 — GitHub Actions: lint, typecheck, test, build
- [ ] 10.2 — Docker and docker-compose
- [ ] 10.3 — Deploying to Vercel
- [ ] 10.4 — Environment variables in production
- [ ] 10.5 — Supabase Row Level Security

### Module 11 — Claude Code Engineering Workflow

- [ ] 11.1 — Writing effective engineering directives
- [ ] 11.2 — Session recovery after a shutdown
- [ ] 11.3 — Documentation as institutional memory
- [ ] 11.4 — The prompt library pattern
- [ ] 11.5 — Architecture audits with Claude Code

---

## Estimated Length

| Module | Estimated Videos | Estimated Duration |
|---|---|---|
| 1 | 5 | 1 hour |
| 2 | 5 | 1.5 hours |
| 3 | 5 | 1.5 hours |
| 4 | 5 | 2 hours |
| 5 | 6 | 2 hours |
| 6 | 3 | 1 hour |
| 7 | 5 | 2 hours |
| 8 | 4 | 1.5 hours |
| 9 | 4 | 1.5 hours |
| 10 | 5 | 2 hours |
| 11 | 5 | 1.5 hours |
| **Total** | **52** | **~18 hours** |
