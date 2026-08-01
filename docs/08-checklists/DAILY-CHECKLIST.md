# Daily Engineering Checklist

| Field | Value |
|---|---|
| **Purpose** | Session startup and shutdown checklist |
| **Audience** | Greg Odi, all engineers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Session Startup

### Context Recovery

- [ ] Read the most recent `docs/00-project-journal/SESSION-NNN.md`.
- [ ] Note the active blockers.
- [ ] Note the recommended next action from the previous session.

### Environment Check

- [ ] Verify `.env.local` exists and contains non-placeholder values.
- [ ] `npm install` — ensure dependencies are up to date (run if `package.json` was changed).
- [ ] `npm test` — verify the test suite is passing before starting new work.
- [ ] `npm run typecheck` — verify TypeScript compiles cleanly.

### Plan the Session

- [ ] Identify the one most important thing to accomplish today.
- [ ] If using Claude Code: send the session recovery prompt from `docs/07-prompts/SESSION-RECOVERY.md`.

---

## Session Shutdown

### Code Quality

- [ ] `npm test` — all tests pass.
- [ ] `npm run typecheck` — no TypeScript errors.
- [ ] `npm run lint` — no linting errors.

### Commit

- [ ] All completed work committed with a Conventional Commits message.
- [ ] No uncommitted changes left behind (run `git status`).
- [ ] `git push origin main` — changes pushed to GitHub.

### Documentation

- [ ] Session journal entry updated in `docs/00-project-journal/SESSION-NNN.md`.
- [ ] Any new blockers recorded.
- [ ] Any useful prompts saved to `docs/07-prompts/`.
- [ ] Any new environment variables documented in `docs/05-deployment/ENVIRONMENT-VARIABLES.md`.
- [ ] Any new migrations documented in `docs/04-database/MIGRATIONS.md`.

### Handoff

- [ ] The session journal entry is written such that a future Claude Code session could resume
      work without asking any questions.
