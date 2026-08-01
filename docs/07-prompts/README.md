# Prompt Library

| Field | Value |
|---|---|
| **Purpose** | Permanent library of reusable Claude Code engineering prompts |
| **Audience** | Greg Odi, Documentation Engineers, future Claude Code sessions |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## Purpose

This folder stores reusable Claude Code prompts that have proven effective for this project.
These prompts encode the correct context, constraints, and expectations for recurring engineering
tasks so they don't need to be rewritten from scratch each session.

---

## Prompt Index

| Prompt | File | Use When |
|---|---|---|
| Principal Engineering Directive | [PRINCIPAL-ENGINEERING-DIRECTIVE.md](PRINCIPAL-ENGINEERING-DIRECTIVE.md) | Starting a major new build session with a full spec |
| Architecture Audit | [ARCHITECTURE-AUDIT.md](ARCHITECTURE-AUDIT.md) | Reviewing the codebase for architectural drift |
| Session Recovery | [SESSION-RECOVERY.md](SESSION-RECOVERY.md) | Starting a new Claude Code session after a shutdown |
| Pre-Commit Review | [PRE-COMMIT-REVIEW.md](PRE-COMMIT-REVIEW.md) | Reviewing code changes before committing |
| Code Review | [CODE-REVIEW.md](CODE-REVIEW.md) | Reviewing a PR or a specific file |

---

## How to Add a New Prompt

When you discover a prompt that produces consistently good results:

1. Create a new file in this folder: `PROMPT-NAME.md`.
2. Include:
   - When to use this prompt.
   - The full prompt text (ready to copy-paste into Claude Code).
   - Any important notes about expected output.
3. Add it to the index above.
4. Note the date it was validated.

---

## Prompt Maintenance

Prompts decay over time as the codebase changes. Review and update prompts when:
- New feature modules are added.
- Architecture patterns change.
- A prompt produces unexpectedly bad results.
