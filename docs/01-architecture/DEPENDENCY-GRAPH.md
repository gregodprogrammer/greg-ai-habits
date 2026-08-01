# Dependency Graph

| Field | Value |
|---|---|
| **Purpose** | Documents how layers and modules depend on each other |
| **Audience** | Engineers, Claude Code sessions |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [System Overview](SYSTEM-OVERVIEW.md) · [Folder Structure](FOLDER-STRUCTURE.md) |

---

## Layer Dependency Rules

Dependencies flow strictly downward. No layer may import from the layer above it.

```
UI (pages)
    │  depends on
    ▼
API Routes (src/app/api/)
    │  depends on
    ▼
Services (src/features/*/service)
    │  depends on
    ├──► Repositories (src/features/*/repository)
    │        │  depends on
    │        ▼
    │    Infrastructure (src/infrastructure/db/client.ts)
    │        │  depends on
    │        ▼
    │    Supabase JS SDK
    │
    └──► Providers (src/providers/)
             │  depends on
             ▼
         External SDKs (supabase-js, openai)
```

**Forbidden dependencies:**
- API Routes must NOT import Repositories directly.
- Services must NOT import API utilities (api-response.ts, route-handler.ts).
- Repositories must NOT import Services.
- Feature modules must NOT import from other feature modules directly (cross-cutting data should go through Services or shared types).

---

## Module Dependency Map

### Auth Module

```
src/app/api/auth/*/route.ts
    → AuthService (src/features/auth/auth.service.ts)
        → SupabaseAuthProvider (src/providers/auth/supabase-auth.provider.ts)
        → AuthRepository (src/features/auth/auth.repository.ts)
            → Supabase DB client (src/infrastructure/db/client.ts)
        → ILogger (src/infrastructure/logger/)
```

### Habits Module

```
src/app/api/habits/*/route.ts
    → auth.middleware.ts (extracts userId)
    → HabitsService (src/features/habits/habits.service.ts)
        → HabitsRepository (src/features/habits/habits.repository.ts)
            → Supabase DB client
        → ILogger
```

### Budget Module

```
src/app/api/budget/*/route.ts
    → auth.middleware.ts
    → BudgetService (src/features/budget/budget.service.ts)
        → BudgetRepository (src/features/budget/budget.repository.ts)
            → Supabase DB client
        → ILogger
```

### Tasks Module

```
src/app/api/tasks/*/route.ts
    → auth.middleware.ts
    → TasksService (src/features/tasks/tasks.service.ts)
        → TasksRepository (src/features/tasks/tasks.repository.ts)
            → Supabase DB client
        → ILogger
```

### Analytics Module

```
src/app/api/analytics/route.ts
    → auth.middleware.ts
    → AnalyticsService (src/features/analytics/analytics.service.ts)
        → AnalyticsRepository (src/features/analytics/analytics.repository.ts)
            → Supabase DB client (reads from habits + habit_entries tables)
        → ILogger
```

### AI Module

```
src/app/api/ai/*/route.ts
    → auth.middleware.ts
    → AIService (src/features/ai/ai.service.ts)
        → OpenAIProvider (src/providers/ai/openai.provider.ts)
            → OpenAI SDK
        → ConversationRepository (src/features/ai/conversation.repository.ts)
            → Supabase DB client
        → ILogger
```

---

## Dependency Injection Entry Point

Everything wires together in `src/shared/lib/container.ts`. No module imports another module
directly — all inter-module communication happens through the container's exported services.

---

## Shared Utilities (No Dependencies)

These files have no feature-module dependencies and may be imported by any layer:

| File | Used By |
|---|---|
| `src/shared/types/index.ts` | All layers |
| `src/shared/utils/errors.ts` | Services, API Routes |
| `src/shared/utils/api-response.ts` | API Routes only |
| `src/shared/utils/route-handler.ts` | API Routes only |
| `src/shared/utils/api-client.ts` | UI (pages) only |
| `src/config/env.ts` | Container, Infrastructure |
| `src/config/constants.ts` | Any layer |

---

## Diagram Placeholder

A visual dependency diagram (Mermaid or draw.io export) will be added here once the system
stabilizes after deployment. See `../10-images/README.md`.
