# Development Documentation

| Field | Value |
|---|---|
| **Purpose** | Index of all development guides for greg-ai-habits |
| **Audience** | New developers, junior engineers, self-taught developers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Documents in This Folder

| Document | Description |
|---|---|
| [ENVIRONMENT-SETUP.md](ENVIRONMENT-SETUP.md) | Full setup guide: Node.js, git, Supabase, OpenAI, running locally |
| [WSL2.md](WSL2.md) | Guide to Windows Subsystem for Linux 2 (WSL2) development environment |
| [GIT-WORKFLOW.md](GIT-WORKFLOW.md) | Branch strategy, commit conventions, PR workflow |
| [CLAUDE-CODE-WORKFLOW.md](CLAUDE-CODE-WORKFLOW.md) | How to use Claude Code effectively for this project |
| [ENGINEERING-DIRECTIVES.md](ENGINEERING-DIRECTIVES.md) | Mandatory engineering standards and non-negotiable rules |

---

## Quick Start (Experienced Developer)

```bash
# 1. Clone
git clone git@github.com:gregodprogrammer/greg-ai-habits.git
cd greg-ai-habits

# 2. Install
npm install

# 3. Environment
cp .env.example .env.local
# Fill in .env.local with real Supabase and OpenAI credentials

# 4. Database
# Apply all migrations to your Supabase project via the SQL Editor

# 5. Run
npm run dev
```

For full setup instructions, see [ENVIRONMENT-SETUP.md](ENVIRONMENT-SETUP.md).
