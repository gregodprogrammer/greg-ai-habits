# Pre-Commit Checklist

| Field | Value |
|---|---|
| **Purpose** | Checklist to complete before every git commit |
| **Audience** | All engineers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Git Workflow](../03-development/GIT-WORKFLOW.md) · [Pre-Commit Review Prompt](../07-prompts/PRE-COMMIT-REVIEW.md) |

---

## Before Every Commit

### Quality Gates

- [ ] `npm test` — all tests pass.
- [ ] `npm run typecheck` — TypeScript compiles with no errors.
- [ ] `npm run lint` — ESLint reports no errors.

### Security

- [ ] `git diff --staged` reviewed — no secrets, API keys, or passwords in staged files.
- [ ] No `.env.local` file staged.
- [ ] No `*.pem` files staged.
- [ ] No hardcoded credentials in any staged file.

### Code Quality

- [ ] No `console.log()` debug statements left in production code (use the logger).
- [ ] No `TODO` or `FIXME` comments indicating incomplete work in staged files.
- [ ] No commented-out blocks of old code left behind.

### Commit Message

- [ ] Commit message follows Conventional Commits format: `<type>(<scope>): <description>`.
- [ ] The commit message describes the *why*, not just the *what*.
- [ ] The scope matches the changed feature module.

### Final Checks

- [ ] `git status` shows only intended files staged.
- [ ] `git diff --staged` reviewed one more time — nothing surprising.
