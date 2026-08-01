# Project Journal

| Field | Value |
|---|---|
| **Purpose** | Chronological log of every engineering session in this repository |
| **Audience** | Engineers, Claude Code sessions resuming after shutdown |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Session Recovery](CLAUDE-SESSION-RECOVERY.md) |

---

## How to Use This Journal

1. When starting a new session, read the **most recent SESSION-NNN.md** file to understand where work was left off.
2. Read [CLAUDE-SESSION-RECOVERY.md](CLAUDE-SESSION-RECOVERY.md) for the full session-recovery protocol.
3. When ending a session, create a new `SESSION-NNN.md` entry (or update the current one) documenting what was done, what was decided, and what is blocked.

---

## Session Index

| Session | Date | Summary | Status |
|---|---|---|---|
| [SESSION-001](SESSION-001.md) | 2026-08-01 | Project initialization through Migration 003. Blocker: "Failed to create user record" | In Progress |

---

## Session Naming Convention

Sessions are named `SESSION-NNN.md` where `NNN` is a zero-padded integer starting at `001`.
Each new Claude Code session that performs meaningful engineering work should append a new session file.
Sessions within the same calendar day that continue the same task may be recorded in the same file.
