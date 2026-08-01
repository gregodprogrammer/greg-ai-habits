# Prompt: Pre-Commit Review

| Field | Value |
|---|---|
| **Purpose** | Prompt to review staged changes before committing |
| **When to Use** | Before every git commit containing code changes |
| **Validated** | 2026-08-01 |
| **Related Documents** | [Pre-Commit Checklist](../08-checklists/PRE-COMMIT.md) · [Git Workflow](../03-development/GIT-WORKFLOW.md) |

---

## Prompt

```
Review the staged changes before I commit.

Run: git diff --staged

Check for:
1. Any hardcoded secrets, API keys, passwords, or tokens
2. Any console.log() or debug statements that should not be committed
3. Any TypeScript errors (run: npm run typecheck)
4. Any failing tests (run: npm test)
5. Any violations of the architecture (business logic in routes, direct Supabase imports in features)
6. Any TODO or FIXME comments that indicate incomplete work

Also suggest a Conventional Commits message that accurately describes the changes.

Format:
- Issue 1: [description] — [file:line]
- Issue 2: [description] — [file:line]
- ...
- Suggested commit: [type(scope): description]

If no issues are found, say "Changes look clean" and provide the suggested commit message.
```

---

## Expected Output

- A list of issues found (if any).
- A suggested commit message in Conventional Commits format.

---

## Notes

- This is a fast review — it does not replace the full architecture audit.
- Pay special attention to any `.env.local` related files accidentally staged.
- If `git diff --staged` is empty, ask what changes need to be committed.
