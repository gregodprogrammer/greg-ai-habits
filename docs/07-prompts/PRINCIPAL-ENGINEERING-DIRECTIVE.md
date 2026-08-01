# Prompt: Principal Engineering Directive

| Field | Value |
|---|---|
| **Purpose** | Template for a major multi-priority engineering directive |
| **When to Use** | When implementing a new feature module or a large multi-step task |
| **Validated** | 2026-08-01 |
| **Related Documents** | [Engineering Directives](../03-development/ENGINEERING-DIRECTIVES.md) · [Claude Code Workflow](../03-development/CLAUDE-CODE-WORKFLOW.md) |

---

## Template

```
# PRINCIPAL ENGINEERING DIRECTIVE — [FEATURE NAME]

## Context
[Describe what you are building and why. Reference the existing architecture.]

## Architecture Requirements

This implementation must follow the existing architecture EXACTLY:
- Use the Repository Pattern (interface + implementation)
- Use Dependency Injection via getContainer()
- Validate all inputs with Zod DTOs
- Keep API routes thin (auth → parse → service → respond)
- Write unit tests with mocked dependencies

Reference docs/03-development/ENGINEERING-DIRECTIVES.md for the full rules.

## Priorities (implement in order)

### Priority 1 — [Name]
[Specific files to create, with exact paths]
[Exact content requirements]
[What to NOT do]

### Priority 2 — [Name]
[...]

### Priority 3 — [Name]
[...]

## After Each Priority
Run: npm test && npm run typecheck
Report: what was created, what passed, what failed.

## Constraints

DO NOT:
- Modify existing working code unnecessarily
- Skip the interface files
- Add business logic to API routes
- Import Supabase directly in feature code

## Output

After all priorities are complete:
1. List every file created or modified
2. Run npm test and report the result
3. Run npm run typecheck and report the result
4. Update docs/00-project-journal/SESSION-NNN.md
```

---

## Notes

- The more specific the directive, the better the result.
- Always number the priorities and implement them sequentially.
- Always request a test + typecheck run after each priority.
- Reference the engineering directives document explicitly — it reinforces constraints.
