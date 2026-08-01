# Prompt: Architecture Audit

| Field | Value |
|---|---|
| **Purpose** | Prompt to audit the codebase for architectural drift and quality issues |
| **When to Use** | After a major feature addition, before a release, or when code quality is uncertain |
| **Validated** | 2026-08-01 |
| **Related Documents** | [Engineering Directives](../03-development/ENGINEERING-DIRECTIVES.md) · [System Overview](../01-architecture/SYSTEM-OVERVIEW.md) |

---

## Prompt

```
Perform an architecture audit of the greg-ai-habits repository.

Audit against these standards (from docs/03-development/ENGINEERING-DIRECTIVES.md):

1. LAYERING: Are there any API route handlers that contain business logic? 
   Business logic must only exist in Service classes.

2. REPOSITORY PATTERN: Is any database code (Supabase queries) outside of Repository classes?

3. DEPENDENCY INJECTION: Is any code importing Services or Repositories directly instead 
   of using getContainer()?

4. VENDOR ISOLATION: Is Supabase imported in any feature module code (outside 
   src/infrastructure/ or src/providers/)?

5. INTERFACE COVERAGE: Does every Service and Repository have a corresponding interface file?

6. DTO VALIDATION: Is any request body used without Zod validation?

7. ENVIRONMENT VARIABLES: Is process.env accessed anywhere outside src/config/env.ts?

8. TEST COVERAGE: Does every Service have a corresponding __tests__/ file?

For each violation found:
- Name the file and line number
- Describe the violation
- Suggest the correction

If no violations are found, confirm that the architecture is clean.

Do NOT modify any files during the audit. Report only.
```

---

## Expected Output

A structured report with:

- Pass/fail for each standard.
- For failures: file path, line number, description, and suggested fix.
- A summary verdict: "Architecture is clean" or "N violations found."

---

## Notes

- Run this audit before every major release.
- Violations found should be fixed before merging to `main`.
- Record the audit result in the session journal.
