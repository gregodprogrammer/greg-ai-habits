# GitHub Setup and CI/CD

| Field | Value |
|---|---|
| **Purpose** | GitHub repository configuration and CI/CD pipeline documentation |
| **Audience** | Engineers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Git Workflow](../03-development/GIT-WORKFLOW.md) |

---

## Repository

- **GitHub URL:** `https://github.com/gregodprogrammer/greg-ai-habits`
- **Visibility:** Private
- **Default branch:** `main`
- **Owner:** `gregodprogrammer`

---

## CI/CD Pipeline

The GitHub Actions pipeline is defined in `.github/workflows/ci.yml`.

### Trigger Conditions

| Trigger | Branches |
|---|---|
| Push | `main`, `develop` |
| Pull Request | `main` |

### Pipeline Stages

```
Push to main/develop
        │
        ├── Job 1: Lint & Typecheck (parallel)
        │       ├── npm run lint
        │       └── npm run typecheck
        │
        ├── Job 2: Unit Tests (parallel)
        │       └── npm test -- --coverage --ci
        │
        └── Job 3: Build (runs after Jobs 1 & 2)
                ├── npm run build
                └── docker build -t greg-ai-habits:ci .
```

### Required Secrets

The following secrets must be set in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as `SUPABASE_ANON_KEY` |
| `JWT_SECRET` | JWT signing secret |
| `OPENAI_API_KEY` | OpenAI API key |

---

## Adding GitHub Secrets

1. Go to `https://github.com/gregodprogrammer/greg-ai-habits/settings/secrets/actions`.
2. Click **New repository secret**.
3. Add each secret listed above.

---

## Branch Protection (Recommended Future Setup)

Once the project is in production, configure branch protection for `main`:

1. Go to **Settings → Branches → Add rule**.
2. Branch name pattern: `main`.
3. Enable:
   - Require a pull request before merging.
   - Require status checks to pass (Lint & Typecheck, Unit Tests).
   - Require branches to be up to date.
   - Do not allow bypassing the above settings.
