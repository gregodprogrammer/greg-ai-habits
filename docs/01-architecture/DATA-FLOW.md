# Data Flow

| Field | Value |
|---|---|
| **Purpose** | End-to-end request lifecycle documentation |
| **Audience** | Engineers, Claude Code sessions, debugging reference |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [System Overview](SYSTEM-OVERVIEW.md) · [Dependency Graph](DEPENDENCY-GRAPH.md) |

---

## Authenticated API Request Lifecycle

This is the standard path for any protected API endpoint (e.g., `GET /api/habits`).

```
Browser / Client
    │
    │  HTTP Request
    │  Cookie: session=<JWT>
    │
    ▼
Next.js App Router (Edge Runtime or Node.js)
    │
    ▼
src/app/api/habits/route.ts  (GET handler)
    │
    ├─ 1. Extract token from cookie via auth.middleware.ts
    │       │
    │       └─ SupabaseAuthProvider.verifyToken(token)
    │               └─ Supabase Auth SDK validates JWT
    │               └─ Returns { userId }
    │
    ├─ 2. Parse query params via Zod DTO (if applicable)
    │
    ├─ 3. Call HabitsService.getAll(userId, filters)
    │       │
    │       └─ HabitsRepository.findAll(userId, filters)
    │               │
    │               └─ Supabase DB client
    │                    └─ SQL: SELECT * FROM habits WHERE user_id = $1 ...
    │                    └─ Returns rows
    │               └─ Maps rows to Habit[] type
    │       └─ Returns Habit[]
    │
    ├─ 4. Wrap result in successResponse({ data: habits })
    │
    └─ 5. Return NextResponse with JSON body and 200 status

Browser receives JSON response
```

---

## Registration Flow

```
Browser: POST /api/auth/register  { email, password, display_name }
    │
    ▼
src/app/api/auth/register/route.ts
    │
    ├─ 1. Parse body with RegisterDto (Zod)
    │       └─ Validates email format, password min length, display_name optional
    │
    ├─ 2. AuthService.register(dto)
    │       │
    │       ├─ SupabaseAuthProvider.signUp(email, password)
    │       │       └─ Supabase Auth creates user in auth.users
    │       │       └─ Returns { userId, email, accessToken }
    │       │
    │       └─ AuthRepository.create({ id: userId, email, display_name })
    │               └─ INSERT INTO public.users (id, email, display_name)
    │               └─ Returns created User record
    │
    ├─ 3. Set HTTP-only cookie via session.ts
    │       └─ response.cookies.set('session', accessToken, { httpOnly: true, ... })
    │
    └─ 4. Return 201 with { user, accessToken }
```

---

## AI Chat Flow

```
Browser: POST /api/ai/chat  { message, module }
    │
    ▼
src/app/api/ai/chat/route.ts
    │
    ├─ 1. Verify auth token (userId extracted)
    │
    ├─ 2. Parse body with ChatDto
    │
    ├─ 3. AIService.chat(userId, message, module)
    │       │
    │       ├─ ConversationRepository.getHistory(userId, module, limit=20)
    │       │       └─ SELECT recent messages to provide context
    │       │
    │       ├─ OpenAIProvider.chat(systemPrompt, messages, userMessage)
    │       │       └─ openai.chat.completions.create(...)
    │       │       └─ Returns assistant response string
    │       │
    │       ├─ ConversationRepository.save(userId, 'user', message, module)
    │       │
    │       └─ ConversationRepository.save(userId, 'assistant', response, module)
    │
    └─ 4. Return 200 with { response }
```

---

## Error Flow

```
Any API Route handler
    │
    └─ handleRoute(async () => { ... })
            │
            ├─ If Zod parse fails:
            │       └─ ZodError caught → 400 { error: 'Validation error', details: [...] }
            │
            ├─ If token missing/invalid:
            │       └─ UnauthorizedError thrown → 401 { error: 'Unauthorized' }
            │
            ├─ If resource not found:
            │       └─ NotFoundError thrown → 404 { error: 'Not found' }
            │
            ├─ If duplicate key / conflict:
            │       └─ ConflictError thrown → 409 { error: 'Conflict' }
            │
            └─ Any other Error:
                    └─ 500 { error: 'Internal server error' }
```

---

## Database Write Flow (Habit Entry Logging)

```
Browser: POST /api/habits/:id/entries  { logged_date, note }
    │
    ├─ 1. Auth: verify token → userId
    ├─ 2. Parse body: LogEntryDto
    ├─ 3. HabitsService.logEntry(userId, habitId, dto)
    │       │
    │       ├─ Verify habit belongs to userId (HabitsRepository.findById)
    │       │       └─ SELECT * FROM habits WHERE id = $1 AND user_id = $2
    │       │       └─ If null → throw NotFoundError
    │       │
    │       └─ HabitsRepository.createEntry(habitId, userId, logged_date, note)
    │               └─ INSERT INTO habit_entries (...)
    │               └─ ON CONFLICT (habit_id, logged_date) DO NOTHING
    │               └─ Returns HabitEntry
    │
    └─ 4. Return 201 with created entry
```
