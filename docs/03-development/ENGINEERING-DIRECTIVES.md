# Engineering Directives

| Field | Value |
|---|---|
| **Purpose** | Mandatory engineering standards that all code in this repository must follow |
| **Audience** | All engineers, Claude Code sessions |
| **Status** | Active — these are non-negotiable |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [ADR-001](../02-architecture-decisions/ADR-001.md) · [System Overview](../01-architecture/SYSTEM-OVERVIEW.md) |

---

## Directive 1 — Architecture Must Be Respected

The layered architecture is not a guideline — it is a hard constraint.

```
Providers → Repositories → Services → API Routes → UI
```

**Violations that must never occur:**

- Business logic in an API route handler.
- Database queries outside of a Repository class.
- Direct Supabase imports in a Service class.
- Direct Supabase imports in feature code (only permitted in `src/infrastructure/` and `src/providers/`).
- Feature module A importing from feature module B directly (use shared types or pass through services).

---

## Directive 2 — Every Service Must Have an Interface

Every Service class must have a corresponding interface file.

```
✓ habits.service.ts implements IHabitsService
✓ habits.service.interface.ts defines IHabitsService
```

This enables unit testing via mock implementations.

---

## Directive 3 — Every Repository Must Have an Interface

Every Repository class must have a corresponding interface file.

```
✓ habits.repository.ts implements IHabitsRepository
✓ habits.repository.interface.ts defines IHabitsRepository
```

---

## Directive 4 — All Inputs Must Be Validated with Zod

No data from HTTP requests may enter a Service without first being validated by a Zod DTO.

```typescript
// ✓ Correct
const body = CreateHabitDto.parse(await req.json());
await habitsService.create(userId, body);

// ✗ Wrong
const body = await req.json();
await habitsService.create(userId, body);
```

---

## Directive 5 — Environment Variables Are Validated at Startup

All environment variables are declared and validated in `src/config/env.ts` using Zod.
Access environment variables only via the exported `env` object — never via `process.env` directly.

```typescript
// ✓ Correct
import { env } from '@/config/env';
const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// ✗ Wrong
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

---

## Directive 6 — All Dependencies Flow Through the Container

All service and repository instances must be created inside `src/shared/lib/container.ts`.
API routes call `getContainer()` to receive pre-built instances.

```typescript
// ✓ Correct
const { habitsService } = getContainer();

// ✗ Wrong
const repo = new HabitsRepository(db, logger);
const habitsService = new HabitsService(repo, logger);
```

---

## Directive 7 — API Routes Are Thin

An API route handler does exactly four things:

1. Authenticate (extract and verify token).
2. Parse and validate the request body or params.
3. Call the appropriate service method.
4. Return a standardised response.

If there is any business logic in the route handler, move it to the service.

---

## Directive 8 — Tests Must Mock Dependencies

Unit tests must never connect to a real database or external API.
All repositories and providers must be mocked using jest mock functions.

```typescript
// ✓ Correct
const mockRepo = { findAll: jest.fn().mockResolvedValue([]) };
const service = new HabitsService(mockRepo as any, mockLogger);
```

---

## Directive 9 — Conventional Commits Are Mandatory

Every git commit message must follow Conventional Commits format.
See [GIT-WORKFLOW.md](GIT-WORKFLOW.md) for the full specification.

---

## Directive 10 — Documentation Must Stay Current

Every session that modifies code must also update documentation.

- New module → update `SYSTEM-OVERVIEW.md` and `FOLDER-STRUCTURE.md`.
- New migration → update `MIGRATIONS.md` and `DATABASE-SCHEMA.md`.
- New environment variable → update `ENVIRONMENT-VARIABLES.md`.
- New architecture decision → write an ADR.
- Resolved bug → update `TROUBLESHOOTING-INDEX.md`.
- Session ends → write a session journal entry.

---

## Directive 11 — Never Commit Secrets

The following must never appear in git history:

- Supabase URL with API keys embedded.
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` values.
- `JWT_SECRET` values.
- `OPENAI_API_KEY` values.
- Any `.env.local` file contents.

`.env.example` is the only environment file that may be committed. It must contain only
placeholder values, never real secrets.

---

## Directive 12 — TypeScript Strict Mode Is Required

The `tsconfig.json` has `"strict": true`. This setting must never be disabled.
All TypeScript errors must be resolved; `any` types must be used sparingly and with justification.
