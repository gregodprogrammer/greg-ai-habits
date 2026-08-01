# Bootcamp Outline

| Field | Value |
|---|---|
| **Purpose** | Week-by-week outline for the professional bootcamp curriculum |
| **Audience** | Greg Odi (author), future instructors |
| **Status** | Outline only |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Bootcamp Title (Draft)

**"AI-Powered Full-Stack Engineering Bootcamp"**

---

## Format

- Duration: 8 weeks
- Format: Live sessions + asynchronous assignments
- Prerequisites: Basic JavaScript/HTML/CSS; willingness to learn
- Outcome: Deploy a production-grade full-stack AI application

---

## Week-by-Week Curriculum

### Week 1 — Environment and Mindset

**Topics:**
- Setting up WSL2, Node.js, VS Code, Git.
- Introduction to TypeScript.
- Introduction to Claude Code and AI-assisted development.
- The engineering mindset: architecture before code.

**Deliverable:** Development environment running; Hello World in Next.js.

---

### Week 2 — Architecture and Foundation

**Topics:**
- Next.js App Router fundamentals.
- The Layered Architecture pattern.
- Repository Pattern and Dependency Injection.
- Interface-first design.
- Zod for runtime validation.

**Deliverable:** Project scaffolded with folder structure and DI container.

---

### Week 3 — Database and Supabase

**Topics:**
- Relational database design.
- SQL fundamentals: CREATE TABLE, INSERT, SELECT, JOIN, INDEX.
- Supabase setup and migrations.
- Supabase Auth overview.
- Environment variables and secrets management.

**Deliverable:** Database schema created; initial migration applied.

---

### Week 4 — Authentication

**Topics:**
- Email/password authentication flow.
- HTTP-only cookies.
- JWT tokens.
- Auth middleware in Next.js.
- Security: why we use service role key server-side only.

**Deliverable:** Registration and login working end-to-end.

---

### Week 5 — First Feature Module

**Topics:**
- Habits module: full implementation.
- DTO validation with Zod.
- Repository and Service implementation.
- Thin API routes.
- Unit testing with Jest and mocks.

**Deliverable:** Habits module fully functional with tests.

---

### Week 6 — AI Integration

**Topics:**
- Introduction to the OpenAI API.
- Prompt engineering for feature coaching.
- Conversation history and context windows.
- Provider abstraction pattern.
- Building the AI Coach feature.

**Deliverable:** AI chat coach integrated into the application.

---

### Week 7 — Additional Modules

**Topics:**
- Applying learned patterns to Budget and Tasks modules.
- Complex aggregation queries.
- Analytics dashboard.
- Cross-module data.

**Deliverable:** Budget and Tasks modules complete.

---

### Week 8 — Production Deployment

**Topics:**
- GitHub Actions CI/CD pipeline.
- Docker containerization.
- Vercel deployment.
- Row Level Security in Supabase.
- Production checklist.
- Post-deployment monitoring.

**Deliverable:** Application deployed to production with CI/CD pipeline active.

---

## Assessment Structure

| Assessment | Weight | When |
|---|---|---|
| Weekly deliverables | 40% | End of each week |
| Code review participation | 20% | Weeks 4–7 |
| Final project deployment | 40% | Week 8 |

---

## Instructor Notes

- Use this repository as the reference implementation.
- Students build a similar application alongside the lessons.
- Claude Code is used throughout — teach prompt engineering alongside software engineering.
- Architecture audits should be performed at the end of weeks 4, 6, and 8.
- Encourage students to maintain their own documentation system.
