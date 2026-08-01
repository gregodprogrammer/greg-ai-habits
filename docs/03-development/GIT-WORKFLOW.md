# Git Workflow

| Field | Value |
|---|---|
| **Purpose** | Branch strategy, commit conventions, and PR workflow for this repository |
| **Audience** | All engineers working on this project |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Engineering Directives](ENGINEERING-DIRECTIVES.md) · [Pre-Commit Checklist](../08-checklists/PRE-COMMIT.md) |

---

## Branch Strategy

| Branch | Purpose | Rules |
|---|---|---|
| `main` | Production-ready code | Protected; never push directly |
| `develop` | Integration branch | Merge feature branches here first |
| `feat/<name>` | New features | Branch from `develop`; merge to `develop` |
| `fix/<name>` | Bug fixes | Branch from `main` or `develop`; merge to both |
| `chore/<name>` | Non-functional changes | Branch from `develop` |
| `docs/<name>` | Documentation only | Branch from `develop` |

**For solo development:** The current workflow allows direct pushes to `main` during the initial
build phase. Once the application is in production, all changes must go through a feature branch.

---

## Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to Use |
|---|---|
| `feat` | A new feature visible to the user |
| `fix` | A bug fix |
| `chore` | Maintenance, dependency updates, configuration |
| `docs` | Documentation changes only |
| `test` | Adding or updating tests |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |
| `build` | Changes to build system or external dependencies |
| `style` | Formatting, whitespace (no logic changes) |

### Scope (optional but recommended)

Use the feature module name: `auth`, `habits`, `budget`, `tasks`, `analytics`, `ai`, `infra`, `docs`.

### Examples

```bash
feat(habits): add DELETE /api/habits/:id/entries endpoint
fix(tasks): correct project name mapping in getStats
chore: update gitignore for environment files
test(habits): add deleteEntry coverage
docs(arch): add dependency graph documentation
refactor(auth): extract token verification to shared middleware
```

---

## Commit Checklist

Before every commit, verify:

- [ ] Tests pass: `npm test`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] No secrets in staged files
- [ ] Commit message follows Conventional Commits format

See [PRE-COMMIT.md](../08-checklists/PRE-COMMIT.md) for the full checklist.

---

## Tagging Releases

```bash
# Tag a release
git tag v0.1.0
git push origin v0.1.0
```

Use [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

| Increment | When |
|---|---|
| PATCH (0.0.x) | Bug fixes |
| MINOR (0.x.0) | New features, backward-compatible |
| MAJOR (x.0.0) | Breaking changes |

---

## Git Log Reference

```bash
# View recent commits
git log --oneline -20

# View changes in a commit
git show <hash>

# View all tags
git tag -l

# Find when a bug was introduced
git bisect start
git bisect bad HEAD
git bisect good v0.1.0
```
