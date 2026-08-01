# Prompt: Code Review

| Field | Value |
|---|---|
| **Purpose** | Prompt to perform a thorough code review of a file or PR |
| **When to Use** | When reviewing a specific file, a PR, or a recently completed feature |
| **Validated** | 2026-08-01 |
| **Related Documents** | [Engineering Directives](../03-development/ENGINEERING-DIRECTIVES.md) |

---

## Prompt (Single File)

```
Review the file [path/to/file.ts] for code quality issues.

Check for:
1. Correctness — does the logic do what it's supposed to?
2. Error handling — are all error cases handled appropriately?
3. Type safety — are there any implicit `any` types or unsafe casts?
4. Security — are there any injection risks, unauthorized access risks, or secret leaks?
5. Architecture compliance — does the code follow the Repository/Service/Provider pattern?
6. Test coverage — is there a corresponding test file? If so, are edge cases covered?
7. Readability — are variable names clear? Is complex logic explained?

Report each issue with:
- Severity: Critical / Major / Minor / Suggestion
- File and line number
- Description of the issue
- Suggested fix

If the code looks correct and compliant, say so explicitly.
```

---

## Prompt (Full PR Review)

```
Review all changes on the current branch compared to main.

Run: git diff main...HEAD

For each changed file, check:
1. Correctness of new logic
2. Error handling completeness
3. Architecture compliance (Repository/Service/Provider/DI patterns)
4. Security (no exposed secrets, no SQL injection, no XSS)
5. Test coverage for new Services and Repositories
6. Documentation — are new environment variables or migrations documented?

Report:
- Summary of what changed
- Issues found (Severity / File:Line / Description / Fix)
- Whether the changes are ready to merge to main
```

---

## Notes

- Always start a code review with the architecture rules in mind.
- "Critical" issues must be fixed before merging.
- "Major" issues should be fixed before merging unless there is a documented reason not to.
- "Minor" and "Suggestion" items can be addressed in a follow-up.
