# Folder Structure

| Field | Value |
|---|---|
| **Purpose** | Annotated directory tree explaining the purpose of every folder and key file |
| **Audience** | New developers, Claude Code sessions |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [System Overview](SYSTEM-OVERVIEW.md) · [Dependency Graph](DEPENDENCY-GRAPH.md) |

---

## Top-Level Layout

```
greg-ai-habits/
├── .env.example              # Public template — copy to .env.local and fill in values
├── .env.local                # NEVER committed — actual secrets
├── .gitignore                # Excludes node_modules, .next, .env.local, coverage
├── .github/workflows/ci.yml  # GitHub Actions CI pipeline
├── Dockerfile                # Production container (standalone Next.js output)
├── docker-compose.yml        # Local dev container orchestration
├── jest.config.mjs           # Jest configuration (module aliases, transform)
├── next.config.ts            # Next.js config (output: 'standalone')
├── postcss.config.mjs        # PostCSS config for Tailwind v4
├── eslint.config.mjs         # ESLint flat config
├── tsconfig.json             # TypeScript config (strict, path aliases)
├── package.json              # Dependencies and scripts
├── public/                   # Static assets served at /
├── src/                      # All application source code
└── docs/                     # Engineering documentation (this folder)
```

---

## src/ Directory

```
src/
├── app/                      # Next.js App Router — routes, layouts, pages
│   ├── layout.tsx            # Root layout (HTML shell, providers wrapper)
│   ├── page.tsx              # Landing page (redirects to /dashboard or /login)
│   ├── providers.tsx         # Client-side React context providers
│   ├── globals.css           # Tailwind base styles
│   ├── error.tsx             # Global error boundary page
│   ├── loading.tsx           # Global loading UI
│   ├── not-found.tsx         # 404 page
│   │
│   ├── (auth)/               # Route group — no shared layout with dashboard
│   │   ├── layout.tsx        # Auth layout (centered card, no nav)
│   │   ├── login/page.tsx    # Login form
│   │   └── register/page.tsx # Registration form
│   │
│   ├── (dashboard)/          # Route group — authenticated shell with sidebar
│   │   ├── layout.tsx        # Dashboard layout (sidebar nav, auth guard)
│   │   ├── dashboard/page.tsx
│   │   ├── habits/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── ai-coach/page.tsx
│   │   ├── budget/page.tsx
│   │   ├── tasks/page.tsx
│   │   └── profile/page.tsx
│   │
│   └── api/                  # API routes — thin controllers only
│       ├── health/route.ts   # GET /api/health — liveness probe
│       ├── auth/
│       │   ├── login/route.ts    # POST /api/auth/login
│       │   ├── logout/route.ts   # DELETE /api/auth/logout
│       │   └── register/route.ts # POST /api/auth/register
│       ├── habits/
│       │   ├── route.ts          # GET, POST /api/habits
│       │   └── [id]/
│       │       ├── route.ts      # GET, PATCH, DELETE /api/habits/:id
│       │       └── entries/route.ts  # GET, POST, DELETE /api/habits/:id/entries
│       ├── analytics/route.ts    # GET /api/analytics
│       ├── ai/
│       │   ├── chat/route.ts         # POST /api/ai/chat
│       │   ├── budget-coach/route.ts # POST /api/ai/budget-coach
│       │   └── task-coach/route.ts   # POST /api/ai/task-coach
│       ├── budget/
│       │   ├── route.ts          # GET, POST /api/budget
│       │   ├── [id]/route.ts     # GET, PATCH, DELETE /api/budget/:id
│       │   ├── categories/route.ts
│       │   └── summary/route.ts
│       ├── tasks/
│       │   ├── route.ts          # GET, POST /api/tasks
│       │   ├── [id]/route.ts     # GET, PATCH, DELETE /api/tasks/:id
│       │   ├── projects/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   └── stats/route.ts
│       └── profile/route.ts      # GET, PATCH /api/profile
│
├── features/                 # Feature modules — self-contained by domain
│   ├── ai/
│   │   ├── dtos/chat.dto.ts
│   │   ├── ai.service.interface.ts
│   │   ├── ai.service.ts
│   │   ├── conversation.repository.interface.ts
│   │   └── conversation.repository.ts
│   ├── analytics/
│   │   ├── dtos/analytics-query.dto.ts
│   │   ├── analytics.repository.interface.ts
│   │   ├── analytics.repository.ts
│   │   ├── analytics.service.interface.ts
│   │   ├── analytics.service.ts
│   │   └── __tests__/analytics.service.test.ts
│   ├── auth/
│   │   ├── dtos/ (login.dto.ts, register.dto.ts)
│   │   ├── auth.repository.interface.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.service.interface.ts
│   │   ├── auth.service.ts
│   │   ├── session.ts           # Cookie helpers
│   │   └── __tests__/auth.service.test.ts
│   ├── budget/
│   │   ├── dtos/ (4 DTO files)
│   │   ├── budget.repository.interface.ts
│   │   ├── budget.repository.ts
│   │   ├── budget.service.interface.ts
│   │   ├── budget.service.ts
│   │   └── __tests__/budget.service.test.ts
│   ├── habits/
│   │   ├── dtos/ (create, update, log-entry DTOs)
│   │   ├── habits.repository.interface.ts
│   │   ├── habits.repository.ts
│   │   ├── habits.service.interface.ts
│   │   ├── habits.service.ts
│   │   └── __tests__/habits.service.test.ts
│   └── tasks/
│       ├── dtos/ (4 DTO files)
│       ├── tasks.repository.interface.ts
│       ├── tasks.repository.ts
│       ├── tasks.service.interface.ts
│       ├── tasks.service.ts
│       └── __tests__/tasks.service.test.ts
│
├── providers/                # Vendor adapters — abstract external dependencies
│   ├── ai/
│   │   ├── ai.provider.interface.ts
│   │   └── openai.provider.ts     # OpenAI SDK wrapper
│   ├── auth/
│   │   ├── auth.provider.interface.ts
│   │   └── supabase-auth.provider.ts  # Supabase Auth wrapper
│   └── storage/
│       ├── storage.provider.interface.ts
│       └── supabase-storage.provider.ts
│
├── infrastructure/           # Cross-cutting concerns — logger, database client
│   ├── db/
│   │   ├── client.ts          # Creates Supabase JS client
│   │   └── migrations/        # SQL migration files (applied manually to Supabase)
│   │       ├── 001_initial.sql
│   │       ├── 002_budget.sql
│   │       └── 003_tasks.sql
│   └── logger/
│       ├── logger.interface.ts
│       └── console.logger.ts
│
├── middleware/
│   └── auth.middleware.ts    # Extracts and verifies auth token from cookies
│
├── shared/
│   ├── lib/
│   │   └── container.ts      # Dependency Injection — builds and returns singleton
│   ├── types/
│   │   └── index.ts          # All domain TypeScript interfaces
│   ├── ui/
│   │   ├── logout-button.tsx
│   │   ├── spinner.tsx
│   │   └── stat-card.tsx
│   └── utils/
│       ├── api-client.ts     # Client-side fetch wrapper
│       ├── api-response.ts   # successResponse / errorResponse helpers
│       ├── errors.ts         # Domain error classes
│       └── route-handler.ts  # Wraps API routes in error handling
│
├── config/
│   ├── env.ts                # Zod-validated environment variables (throws at startup if missing)
│   └── constants.ts          # App-wide constants (cookie name, token expiry, etc.)
│
└── proxy.ts                  # (Internal — ignore)
```

---

## Naming Conventions

| Pattern | Meaning |
|---|---|
| `*.service.ts` | Service class — owns business logic |
| `*.service.interface.ts` | TypeScript interface for the service |
| `*.repository.ts` | Repository class — owns database queries |
| `*.repository.interface.ts` | TypeScript interface for the repository |
| `*.provider.ts` | External vendor adapter |
| `*.provider.interface.ts` | TypeScript interface for the provider |
| `*.dto.ts` | Zod schema + inferred TypeScript type for an input |
| `__tests__/*.test.ts` | Jest unit tests |
| `route.ts` | Next.js App Router API route handler |
| `page.tsx` | Next.js App Router page component |
| `layout.tsx` | Next.js App Router layout component |
