# System Overview

| Field | Value |
|---|---|
| **Purpose** | High-level description of the greg-ai-habits system |
| **Audience** | Engineers, Claude Code sessions, new developers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Folder Structure](FOLDER-STRUCTURE.md) · [Data Flow](DATA-FLOW.md) · [ADR-001](../02-architecture-decisions/ADR-001.md) |

---

## What Is This System?

**greg-ai-habits** is a full-stack AI productivity platform. Its purpose is to help a user track
habits, manage a personal budget, organize tasks, and receive AI-powered coaching across all
three domains — all within a single authenticated web application.

The system is the first production-grade repository in the **Greg AI Labs** ecosystem. It is
designed to grow into a multi-module platform with additional features added as new migrations
and feature modules over time.

---

## Module Status

| Module | Backend | Frontend | AI Coach | Database Tables | Status |
|---|---|---|---|---|---|
| Auth | Complete | Complete | — | `users` | Active |
| Habits | Complete | Complete | Partial | `habits`, `habit_entries` | Active |
| Budget | Complete | Complete | Partial | `budget_categories`, `budget_transactions`, `budgets` | Active |
| Tasks | Complete | Complete | Partial | `task_projects`, `tasks` | Active |
| Analytics | Complete | Complete | — | (aggregates from habits) | Active |
| AI Conversations | Complete | Partial | — | `ai_conversations` | Active |
| CRM | Planned | Planned | Planned | Not created | Planned |
| Knowledge Base | Planned | Planned | Planned | Not created | Planned |
| Career Assistant | Planned | Planned | Planned | Not created | Planned |

---

## Architecture Overview

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────┐
│            Next.js App Router           │
│     src/app/api/<module>/route.ts       │
│                                         │
│  1. Extract & verify auth token         │
│  2. Parse & validate request body (Zod) │
│  3. Call Service method                 │
│  4. Return standardised JSON response   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│               Service Layer             │
│     src/features/<module>/<module>.service.ts   │
│                                         │
│  • All business logic lives here        │
│  • Calls Repository and/or Provider     │
│  • Throws domain errors (NotFoundError) │
└────────────┬──────────────┬────────────┘
             │              │
             ▼              ▼
┌──────────────────┐  ┌──────────────────────────┐
│  Repository Layer│  │      Provider Layer       │
│ src/features/    │  │  src/providers/           │
│ <module>/        │  │                           │
│ *.repository.ts  │  │  auth/  ai/  storage/     │
│                  │  │                           │
│  • SQL / Supabase│  │  • Supabase Auth          │
│    queries only  │  │  • OpenAI API             │
│  • No logic      │  │  • Supabase Storage       │
└────────┬─────────┘  └───────────┬──────────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│           Infrastructure Layer          │
│  src/infrastructure/                    │
│                                         │
│  db/client.ts   — Supabase JS client    │
│  logger/        — ConsoleLogger         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         PostgreSQL via Supabase         │
│         (public schema)                 │
└─────────────────────────────────────────┘
```

---

## Dependency Injection

All dependencies are constructed once at process startup in `src/shared/lib/container.ts`
and injected downward. API routes call `getContainer()` to receive the service they need.

```
getContainer()
    └── builds once:
         ├── ConsoleLogger
         ├── Supabase DB client
         ├── SupabaseAuthProvider
         ├── OpenAIProvider
         ├── SupabaseStorageProvider
         ├── AuthRepository(db, logger)
         ├── HabitsRepository(db, logger)
         ├── AnalyticsRepository(db, logger)
         ├── ConversationRepository(db, logger)
         ├── BudgetRepository(db, logger)
         ├── TasksRepository(db, logger)
         ├── AuthService(authProvider, authRepository, logger)
         ├── HabitsService(habitsRepository, logger)
         ├── AnalyticsService(analyticsRepository, logger)
         ├── AIService(aiProvider, conversationRepository, logger)
         ├── BudgetService(budgetRepository, logger)
         └── TasksService(tasksRepository, logger)
```

---

## Authentication Flow

1. User submits credentials to `POST /api/auth/login`.
2. `AuthService.login()` calls `SupabaseAuthProvider.signIn()`.
3. Supabase returns an `access_token` (JWT).
4. `session.ts` sets the token as an HTTP-only cookie.
5. Subsequent requests include the cookie automatically.
6. `auth.middleware.ts` extracts the token and calls `authProvider.verifyToken()`.
7. Verified `userId` is passed to the Service for tenant isolation.

---

## Error Handling

All API routes are wrapped by `handleRoute()` in `src/shared/utils/route-handler.ts`.
This function catches thrown errors and maps them to HTTP responses:

| Error Class | HTTP Status |
|---|---|
| `ValidationError` (Zod) | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| Any other `Error` | 500 |

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.11 |
| Language | TypeScript | 5.x (strict) |
| Runtime | Node.js | 20 |
| Styling | Tailwind CSS | v4 |
| Database | PostgreSQL via Supabase | — |
| Authentication | Supabase Auth | 2.47.x |
| AI | OpenAI API (SDK) | 4.77.x |
| Validation | Zod | 3.24.x |
| Testing | Jest | 30.x |
| Containerization | Docker + docker-compose | — |
| CI/CD | GitHub Actions | — |
| Deployment Target | Vercel (planned) | — |
