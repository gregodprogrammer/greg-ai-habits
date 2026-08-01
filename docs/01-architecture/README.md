# Architecture Documentation

| Field | Value |
|---|---|
| **Purpose** | Index of all architectural documentation for greg-ai-habits |
| **Audience** | Engineers, Claude Code sessions, technical reviewers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Documents in This Folder

| Document | Description |
|---|---|
| [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) | High-level description of the system, its modules, and its design principles |
| [FOLDER-STRUCTURE.md](FOLDER-STRUCTURE.md) | Annotated directory tree explaining the purpose of every folder |
| [DEPENDENCY-GRAPH.md](DEPENDENCY-GRAPH.md) | How layers and modules depend on each other |
| [DATA-FLOW.md](DATA-FLOW.md) | End-to-end request lifecycle from HTTP to database and back |

---

## Architectural Principles (Summary)

1. **Layered architecture** — Providers → Repositories → Services → API Routes → UI.
2. **Dependency Injection** — All dependencies constructed once in `container.ts` and injected.
3. **Interface-first** — Every Service and Repository has a corresponding interface file to allow mocking in tests.
4. **Thin API routes** — Routes authenticate, parse, delegate, respond. No business logic.
5. **Vendor abstraction** — Supabase and OpenAI are hidden behind interfaces. Swappable without touching business logic.
6. **Strict type safety** — Zod validates all inputs. TypeScript strict mode enforced.
