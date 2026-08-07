# DEVELOPER SURVIVAL KIT
# GREG AI HABITS

This document is the permanent engineering operating manual for greg-ai-habits. It enables development without AI assistance by capturing all knowledge needed to work independently on the project. It supersedes all historical notes and serves as the single source of truth for process, structure, and workflows.

---

## 1. LOCAL DEVELOPMENT SETUP

From the project root directory:

```bash
# Clone repository
git clone git@github.com:gregodprogrammer/greg-ai-habits.git
cd greg-ai-habits

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure .env.local using values from:
# docs/05-deployment/ENVIRONMENT-VARIABLES.md
# Required:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - JWT_SECRET
# - DATABASE_URL
# Optional:
# - OPENAI_API_KEY

# Apply database migrations to your Supabase project:
# 1. Run `src/infrastructure/db/migrations/001_initial.sql` in Supabase SQL Editor
# 2. Run `src/infrastructure/db/migrations/002_budget.sql` in Supabase SQL Editor
# 3. Run `src/infrastructure/db/migrations/003_tasks.sql` in Supabase SQL Editor

# Start development server
npm run dev

# Access the application at:
http://localhost:3000
```

> Notes:
> - Never commit `.env.local` to git
> - Verify deployment readiness with: `npm run test && npm run test:e2e`

---

## 2. PROJECT STRUCTURE

```tree
greg-ai-habits/
├── src/              # All source code
│   ├── app/           # Next.js application routes
│   │   ├── layout.tsx # Root layout
│   │   ├── page.tsx   # Landing page
│   │   ├── api/       # API routes
│   │   └── (domain)/  # Feature route groups
│   ├── features/      # Feature modules (budget, tasks, etc.)
│   ├── providers/     # Third-party integrations
│   ├── infrastructure/ # Database client, logger
│   └── shared/        # Utilities, Types, UI primitives
├── docs/             # Engineering documentation
├── .env.example      # Environment variable template
├── .env.local        # Local environment variables (never commit)
└── package.json      # Dependencies
```

New modules belong under `src/features/<module>/`.

---

## 3. MODULE CREATION GUIDE

Follow the Habits module template:
1. Create new module folder under `src/features/`
2. Add these files (match Habits structure):
   - `dtos/` (Zod schemas)
   - `repository.ts` (database layer)
   - `service.ts` (business logic)
   - `__tests__/` (Jest unit tests)
3. Expose API via `src/app/api/<module>/route.ts`
4. Implement UI in `src/app/(<domain>)/page.tsx`
5. Add tests covering:
   - DTO validation
   - Database CRUD
   - Business rules
6. Document in `/docs/01-architecture/`

---

## 4. API DEVELOPMENT GUIDE

API routes follow:
1. Placement: `src/app/api/<module>/route.ts`
2. Thin controllers that delegate to service layer
3. Requirements:
   - Authentication check for protected routes (via `src/proxy.ts`)
   - Error handling with proper HTTP status codes
   - Zod validation for request bodies
4. Example:
```ts
// src/app/api/budget/route.ts
import { api } from '@serverlib'
import { BudgetService } from '@/features/budget/service'

export async function GET() {
  const { authService } = getContainer()
  if (!(await authService.isAuthenticated())) return forbidden()
  const service = new BudgetService()
  return successResponse(await service.getBudget())
}
```

---

## 5. DATABASE GUIDE

All data stored in Supabase PostgreSQL:
- Tables: `users`, `habits`, `budget_categories`, `tasks`, etc.
- Access:
  - REST API (`src/app/api/`)
  - Supabase JS SDK (server-side)
- Migrations: Manual SQL files in `src/infrastructure/db/migrations/`
- Security: Row-Level Security policies (implement in future)

---

## 6. SUPABASE GUIDE

Key operations:
1. Authentication:
   - Register/login via Supabase backend
   - User records stored in `public.users`
2. Database access:
   - REST API or Supabase JS SDK
   - Service role key for full access
3. Realtime features:
   - PostgreSQL triggers for `updated_at`

---

## 7. DEPLOYMENT GUIDE

Vercel deployment process:
1. Commit to `main` branch
2. Vercel auto-deploys with `npm run build`
3. Environment variables must be set in Vercel dashboard:
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET
   - OPENAI_API_KEY (optional)
4. Verify deployment via Vercel logs
5. Run production tests with:
```bash
npm run test:e2e
```

---

## 8. TESTING GUIDE

Testing strategy:
1. Unit tests in `__tests__/` (Jest)
2. E2E smoke tests via Playwright
3. Requirements:
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

---

## 9. GIT WORKFLOW

1. Commit sequentially:
```bash
git add .
git commit -m "feat(): implement [module] feature"
```
2. Push to feature branch:
```bash
git push origin feat/<module-name>
```
3. Create PR with:
   - Test coverage >90%
   - Documentation updates
   - Single responsibility per PR
4. Merge to `main` after review

---

## 10. DEBUGGING GUIDE

Common issues:
- Authentication errors: Check JWT validity via `src/proxy.ts`
- Supabase errors: Verify service role permissions
- Type errors: Run `npm run typecheck`
- Deployment failures: Check Vercel logs
- Database issues: Use PostgreSQL CLI

---

## 11. RECOVERY GUIDE

If development halts for 6+ months:
1. Restore from GitHub repository
2. Reapply Supabase migrations:
```bash
psql $DATABASE_URL -f src/infrastructure/db/migrations/*.sql
```
3. Recreate environment variables from `.env.example`
4. Rebuild project with `npm install`
5. Restore testing framework state

---

## 12. DISASTER RECOVERY

### Documentation loss:
All knowledge exists in `/docs/` folders

### AI unavailability:
All logic remains in TypeScript/JS

### Deployment failures:
Follow `VERCEL.md` rollback procedure

### Supabase recreation:
1. Export existing DB schema
2. Create new Supabase project
3. Apply existing migration files
4. Restore users from `public.users`

---

## 13. FUTURE ROADMAP

Based on `docs/99-project-management/PROJECT-BOARD.md`:
1. **Budget Module**: Complete v0.2.0 QA
2. **Tasks Module**:
   - Create task CRUD
   - Implement project dependencies
3. **Analytics Module**:
   - Build dashboard visualizations
4. **AI Coach**:
   - Implement optional OpenAI integration
5. **Profile Module**:
   - Consolidate user settings

---

## 14. ENGINEERING PRINCIPLES

1. Type Safety: Strict TypeScript with Zod validation
2. Modularity: Features isolated in self-contained modules
3. Testability: All code must be testable
4. Readability: Follow component-defined interfaces
5. Defensiveness: Explicit error handling

---

## 15. INDEPENDENCE CHECKLIST

✅ All codebase knowledge exists in `/docs/` markdown files
✅ No AI-specific tooling required
✅ All workflows documented
✅ No vendor lock-in beyond Supabase/Vercel
✅ All dependencies documented
✅ Past AI guidance replaced with documentation references

---

Committed with message:
`docs: add DEVELOPER-SURVIVAL-KIT.md – engineering operating manual for independent development`