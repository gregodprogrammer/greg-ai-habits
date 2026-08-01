# Architecture Decision Records

| Field | Value |
|---|---|
| **Purpose** | Index of all Architecture Decision Records (ADRs) for greg-ai-habits |
| **Audience** | Engineers, Claude Code sessions, technical reviewers |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |

---

## What Is an ADR?

An Architecture Decision Record (ADR) is a short document that captures an important architectural
decision: what was decided, why it was decided that way, and what the consequences are.

ADRs are immutable. Once an ADR is accepted, it is never edited — if the decision changes,
a new ADR supersedes the old one.

---

## ADR Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-001](ADR-001.md) | Core technology and architecture choices | Accepted | 2026-08-01 |

---

## ADR Lifecycle

```
Proposed → Accepted → Superseded (if replaced by a newer ADR)
                   → Deprecated (if no longer relevant)
```

---

## How to Write an ADR

Copy [ADR-TEMPLATE.md](ADR-TEMPLATE.md), rename it `ADR-NNN.md` (next sequential number),
fill in all sections, and add it to the index above.

Write an ADR **before** implementing the decision, not after.
