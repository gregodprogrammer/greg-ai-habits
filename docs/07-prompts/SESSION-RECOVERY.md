# Prompt: Session Recovery

| Field | Value |
|---|---|
| **Purpose** | Prompt to orient a new Claude Code session after a system shutdown |
| **When to Use** | At the start of every new Claude Code session |
| **Validated** | 2026-08-01 |
| **Related Documents** | [Claude Session Recovery Guide](../00-project-journal/CLAUDE-SESSION-RECOVERY.md) |

---

## Prompt

```
This is a new Claude Code session. You have no memory of previous sessions.

Before doing anything else:

1. Read docs/00-project-journal/CLAUDE-SESSION-RECOVERY.md
2. Read the most recent docs/00-project-journal/SESSION-NNN.md file
3. Run: git log --oneline -10
4. Run: npm test

Then report:
- Current project state in 3-5 sentences
- Active blockers (from the session log)
- Whether the test suite is passing
- Recommended next action

Do NOT write any code yet. Just orient yourself and report.
```

---

## Expected Output

A brief report covering:

- What the project is and what modules exist.
- What was last worked on.
- What blockers are active.
- Whether tests pass.
- What should be tackled next.

---

## Notes

- This prompt should take less than 2 minutes to execute.
- If the session log is missing or outdated, the assistant should flag that immediately.
- Do not skip `npm test` — it catches regressions introduced in previous sessions.
