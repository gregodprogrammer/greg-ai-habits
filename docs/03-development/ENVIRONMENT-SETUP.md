# Environment Setup

| Field | Value |
|---|---|
| **Purpose** | Complete local development environment setup guide |
| **Audience** | New developers, self-taught engineers setting up for the first time |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [WSL2.md](WSL2.md) · [Environment Variables](../05-deployment/ENVIRONMENT-VARIABLES.md) |

---

## Prerequisites

Before you begin, you will need accounts and tools set up:

| Requirement | Notes |
|---|---|
| Node.js 20+ | Install via nvm (recommended) or nodejs.org |
| npm | Comes with Node.js |
| Git | Usually pre-installed on macOS/Linux; install Git for Windows |
| VS Code | Recommended editor |
| WSL2 (Windows only) | See [WSL2.md](WSL2.md) |
| Supabase account | Free at supabase.com |
| OpenAI account | Paid — requires a credit card; get an API key at platform.openai.com |

---

## Step 1 — Install Node.js via nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc   # or ~/.zshrc on macOS

# Install and use Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version   # Should print v20.x.x
npm --version    # Should print 10.x.x
```

---

## Step 2 — Clone the Repository

```bash
git clone git@github.com:gregodprogrammer/greg-ai-habits.git
cd greg-ai-habits
```

If you do not have SSH configured for GitHub, use HTTPS:

```bash
git clone https://github.com/gregodprogrammer/greg-ai-habits.git
```

---

## Step 3 — Install Dependencies

```bash
npm install
```

This installs all dependencies listed in `package.json`. The `node_modules/` folder is created
locally and is excluded from git.

---

## Step 4 — Set Up Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every value. See [ENVIRONMENT-VARIABLES.md](../05-deployment/ENVIRONMENT-VARIABLES.md)
for descriptions of each variable.

**Never commit `.env.local` to git.** It is excluded by `.gitignore`.

---

## Step 5 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Open your **greg-ai-habits** project (or create one if it doesn't exist).
3. Go to **Settings → API**.
4. Copy the following values into `.env.local`:
   - `Project URL` → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Settings → Database → Connection String** (URI format).
6. Copy the connection string → `DATABASE_URL` (replace `[YOUR-PASSWORD]` with your database password).

---

## Step 6 — Apply Database Migrations

In the Supabase dashboard, go to **SQL Editor** and run each migration file in order:

1. Copy the contents of `src/infrastructure/db/migrations/001_initial.sql` and run it.
2. Copy the contents of `src/infrastructure/db/migrations/002_budget.sql` and run it.
3. Copy the contents of `src/infrastructure/db/migrations/003_tasks.sql` and run it.

Alternatively, if `psql` is installed:

```bash
psql $DATABASE_URL -f src/infrastructure/db/migrations/001_initial.sql
psql $DATABASE_URL -f src/infrastructure/db/migrations/002_budget.sql
psql $DATABASE_URL -f src/infrastructure/db/migrations/003_tasks.sql
```

Verify the tables were created in Supabase → **Table Editor**.

---

## Step 7 — Get an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com).
2. Sign in and go to **API Keys**.
3. Create a new secret key.
4. Copy it into `.env.local` as `OPENAI_API_KEY`.
5. Set `OPENAI_MODEL=gpt-4o-mini` (cheapest capable model).

---

## Step 8 — Generate a JWT Secret

```bash
# Generate a secure 64-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output into `.env.local` as `JWT_SECRET`.

---

## Step 9 — Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Docker (Optional)

If Docker is installed:

```bash
docker compose up --build
```

This builds the production container and runs it locally on port 3000.
Requires all environment variables to be set in `.env.local`.
