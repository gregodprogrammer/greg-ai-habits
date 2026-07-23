# AI Productivity Platform

A full-stack productivity platform built with Next.js 16, TypeScript, and PostgreSQL. The platform is structured as a suite of integrated modules sharing one authentication system, one database, and one architectural foundation.

## Modules

| Module | Status |
|---|---|
| AI Habits | Complete |
| AI Budget Tracker | In progress |
| AI Task Manager | Planned |
| AI CRM | Planned |
| AI Knowledge Base | Planned |
| AI Resume & Career Assistant | Planned |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth (HTTP-only cookie sessions) |
| AI | OpenAI API (provider-abstracted) |
| Validation | Zod |
| Testing | Jest |
| Containerisation | Docker |
| CI | GitHub Actions |

## Architecture

The project follows a layered, dependency-injected architecture:

```
src/
├── app/              # Next.js App Router — routes, layouts, pages
├── features/         # Feature modules (habits, budget, auth, analytics, ai)
│   └── <module>/
│       ├── dtos/                  # Zod-validated input schemas
│       ├── *.repository.ts        # Database access (Supabase)
│       ├── *.repository.interface.ts
│       ├── *.service.ts           # Business logic
│       ├── *.service.interface.ts
│       └── __tests__/             # Unit tests with mocked dependencies
├── providers/        # Vendor adapters (OpenAI, Supabase auth, storage)
├── infrastructure/   # Logger, database client, migrations
├── middleware/       # Authentication middleware
├── shared/           # Shared types, utilities, UI components
└── config/           # Environment validation, application constants
```

**Principles:**
- Business logic lives only in Services
- Database access lives only in Repositories
- API routes are thin (auth → parse → service → respond)
- Providers are abstracted behind interfaces (vendor-swappable)
- All dependencies are constructor-injected
- All environment variables are Zod-validated at startup

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- An OpenAI API key

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `JWT_SECRET` | Secret for session signing (min 32 chars) |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | Model to use (default: `gpt-4o-mini`) |

### Database

Run the initial migration against your Supabase PostgreSQL database:

```bash
psql $DATABASE_URL -f src/infrastructure/db/migrations/001_initial.sql
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker compose up --build
```

### Tests

```bash
npm test
npm run test:coverage
```

## CI/CD

GitHub Actions runs on every push to `main`:
- TypeScript type check
- ESLint
- Jest unit tests
- Production build

See `.github/workflows/ci.yml` for the full pipeline.

## Deployment

The application builds as a standalone Next.js output (`output: 'standalone'`) and is deployable to any Node.js 20+ environment, container, or Kubernetes cluster.
