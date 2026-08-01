# Claude Code Engineering Workflow

| Field | Value |
|---|---|
| **Purpose** | How to use Claude Code effectively as the engineering assistant for this project |
| **Audience** | Greg Odi, future developers working with Claude Code |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Session Recovery](../00-project-journal/CLAUDE-SESSION-RECOVERY.md) · [Prompt Library](../07-prompts/README.md) |

---

## What Is Claude Code?

Claude Code is Anthropic's AI-powered CLI for software engineering. It can read, write, and
execute code in a project while maintaining context about the architecture, conventions, and
goals you define through directives.

Claude Code is the **primary engineering assistant** for this project. It is used for:

- Implementing new feature modules from specifications.
- Writing tests.
- Debugging errors.
- Refactoring code.
- Writing and maintaining documentation.
- Performing architecture audits.

---

## Starting a Session

```bash
cd /path/to/greg-ai-habits
claude
```

### First Prompt in a New Session

Always begin with a session recovery prompt:

```
Read docs/00-project-journal/CLAUDE-SESSION-RECOVERY.md and then read
docs/00-project-journal/SESSION-001.md (or the most recent SESSION-NNN.md file).
Summarize the current state of the project and the active blockers.
Do not touch any code yet.
```

Claude Code will read the documentation and orient itself before writing any code.

---

## Writing Effective Directives

A **directive** is a detailed engineering specification given to Claude Code. Good directives
produce consistent, professional results. Poor directives produce inconsistent or wrong code.

### Effective Directive Characteristics

| Characteristic | Description |
|---|---|
| **Specific** | Name exact files, functions, and patterns to use |
| **Constrained** | Say what NOT to do as clearly as what to do |
| **Architecture-aware** | Reference the existing patterns (Repository, DI, etc.) |
| **Layered** | Break large tasks into numbered priorities |
| **Testable** | Specify what unit tests must be written |
| **Reviewable** | Ask for output (what was done, what files were modified) |

### Example: Weak Directive

```
Add a budget module.
```

### Example: Strong Directive

```
Implement the Budget feature module following the existing Habits module pattern exactly.

Requirements:
1. Create src/features/budget/budget.repository.interface.ts
2. Create src/features/budget/budget.repository.ts implementing the interface
3. Create src/features/budget/budget.service.interface.ts
4. Create src/features/budget/budget.service.ts
5. Create DTOs in src/features/budget/dtos/
6. Create API routes at src/app/api/budget/
7. Add BudgetRepository and BudgetService to src/shared/lib/container.ts
8. Write unit tests in src/features/budget/__tests__/budget.service.test.ts

Do NOT:
- Import Supabase directly in the service
- Put business logic in the API route
- Skip the interface files

After completion, run npm test and npm run typecheck and report the results.
```

---

## Session Shutdown Protocol

Before ending a session, always ask Claude Code to:

```
Before we end this session:
1. Update docs/00-project-journal/SESSION-NNN.md with what was completed today.
2. Record any new blockers.
3. List any new prompts that were useful.
4. Create a git commit for all changes (code + docs together).
```

---

## Using the Prompt Library

The `docs/07-prompts/` folder contains reusable prompts for common engineering tasks.
Before asking Claude Code to perform a major task, check if a prompt already exists for it.

| Task | Prompt File |
|---|---|
| Session startup after shutdown | [SESSION-RECOVERY.md](../07-prompts/SESSION-RECOVERY.md) |
| Architecture audit | [ARCHITECTURE-AUDIT.md](../07-prompts/ARCHITECTURE-AUDIT.md) |
| Pre-commit review | [PRE-COMMIT-REVIEW.md](../07-prompts/PRE-COMMIT-REVIEW.md) |
| Code review | [CODE-REVIEW.md](../07-prompts/CODE-REVIEW.md) |

---

## Memory Limitations

Claude Code does NOT retain memory between sessions. This is the most important limitation to
understand. Every new Claude Code session starts fresh with no knowledge of:

- Previous sessions.
- Architectural decisions.
- Debugging history.
- Naming conventions agreed upon.

The documentation system in `docs/` compensates for this. If a decision or convention is not
written down, it will be forgotten.

**Rule:** If it matters, document it before the session ends.

---

## Trust but Verify

Claude Code is highly capable but not infallible. Always verify:

- Run `npm test` after every implementation.
- Run `npm run typecheck` to catch TypeScript errors.
- Read the code Claude Code wrote — do not assume it is correct.
- Check that the architecture patterns were followed (DI, Repository, thin API routes).
