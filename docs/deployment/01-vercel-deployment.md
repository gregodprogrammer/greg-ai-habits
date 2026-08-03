# Vercel Deployment Guide

| Field | Value |
|---|---|
| **Purpose** | Step-by-step guide to deploy Greg AI Habits to Vercel |
| **Audience** | DevOps, Greg Odi |
| **Last Updated** | 2026-08-04 |
| **Platform** | Vercel (Next.js verified adapter) |
| **Node Version** | 20 (pinned via `.nvmrc`) |
| **Framework** | Next.js 16.2.11 (App Router) |

---

## Prerequisites

Before starting, you need:

- A [Vercel account](https://vercel.com) (free tier is sufficient for initial deployment)
- The GitHub repository pushed to `main` (`github.com/gregodprogrammer/greg-ai-habits`)
- A live Supabase project with migrations 001–004 applied
- An OpenAI API key

---

## Step 1 — Import the repository into Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Add New → Project**
3. Select **Import Git Repository**
4. Find `gregodprogrammer/greg-ai-habits` and click **Import**
5. Vercel auto-detects Next.js. Accept all defaults except:
   - **Framework preset**: Next.js (auto-detected)
   - **Build command**: `npm run build` (default)
   - **Output directory**: `.next` (default)
   - **Install command**: `npm ci` (default)
   - **Node.js version**: 20 (Vercel reads `.nvmrc` automatically)

---

## Step 2 — Add environment variables

In the Vercel project settings → **Environment Variables**, add every variable from `docs/deployment/02-production-environment.md`.

**IMPORTANT**: Add variables to **Production**, **Preview**, and **Development** scopes as appropriate. Secrets (service role key, JWT secret, OpenAI key) should only be in **Production**.

---

## Step 3 — Deploy

1. Click **Deploy** in the Vercel UI
2. Vercel runs: `npm ci` → `npm run build` → deploy
3. Expected build time: 3–5 minutes (Vercel CI is faster than WSL)
4. On success, Vercel provides a `.vercel.app` domain

---

## Step 4 — Post-deployment verification

Run the full smoke test from `docs/deployment/04-production-smoke-test.md`.

---

## Architecture on Vercel

```
Browser
  │
  ├── Static pages (/, /login, /register, /dashboard, /habits …)
  │   └── Served from Vercel Edge CDN
  │
  └── API Routes (/api/*)
      └── Deployed as Vercel Serverless Functions (Node.js 20)
          └── Connect to Supabase (external)
```

All API routes are serverless functions. There is no persistent server process — each request spins up a function, calls Supabase, and returns. Cold starts are typically < 500ms.

---

## Key deployment decisions

| Decision | Rationale |
|---|---|
| No `output: 'standalone'` on Vercel | `standalone` is for Docker/self-hosting. Vercel uses its own serverless pipeline. The config is now conditional on `NEXT_STANDALONE=true` (used by Dockerfile only). |
| `DATABASE_URL` is optional | The app uses Supabase JS — it never opens a direct Postgres connection. `DATABASE_URL` is in the env schema for future use (e.g., Drizzle ORM). Vercel will not need it. |
| `.nvmrc` pinned to `20` | Matches GitHub Actions CI and local development. Vercel reads `.nvmrc` automatically. |
| No `vercel.json` required | All defaults match the project. Vercel auto-detects Next.js 16 App Router without additional configuration. |

---

## Domains

After first deployment:

1. Vercel assigns a preview URL: `greg-ai-habits-xxx.vercel.app`
2. Add a custom domain in Vercel → Settings → Domains
3. Update DNS with your registrar (CNAME or A record per Vercel instructions)
4. Vercel provisions SSL automatically

---

## Troubleshooting build failures

If the Vercel build fails:

1. Check the build log in Vercel → Deployments → [failed deployment] → Build logs
2. Common causes:
   - Missing environment variable → add it in Vercel → Settings → Environment Variables
   - TypeScript error → run `npm run typecheck` locally
   - Lint error → run `npm run lint` locally
3. See `docs/deployment/05-rollback-guide.md` if you need to revert
