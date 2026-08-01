# Release Checklist

| Field | Value |
|---|---|
| **Purpose** | Steps for creating an official versioned release |
| **Audience** | Engineers performing releases |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Pre-Deployment Checklist](PRE-DEPLOYMENT.md) · [Git Workflow](../03-development/GIT-WORKFLOW.md) |

---

## Release Steps

### 1. Determine the Version Number

Using Semantic Versioning (`MAJOR.MINOR.PATCH`):

- [ ] Is this a bug fix only? → Increment PATCH (e.g., 0.1.0 → 0.1.1)
- [ ] Does this add new features? → Increment MINOR (e.g., 0.1.0 → 0.2.0)
- [ ] Does this break existing functionality? → Increment MAJOR (e.g., 0.1.0 → 1.0.0)

### 2. Complete the Pre-Deployment Checklist

- [ ] All items in [PRE-DEPLOYMENT.md](PRE-DEPLOYMENT.md) checked.

### 3. Merge to Main

- [ ] Feature branch merged to `main`.
- [ ] GitHub Actions CI is green on `main`.

### 4. Tag the Release

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

- [ ] Tag created with correct version number.
- [ ] Tag pushed to GitHub.

### 5. Deploy

- [ ] Vercel deployment triggered (automatic or manual).
- [ ] Deployment confirmed green in Vercel dashboard.

### 6. Verify Production

- [ ] Full smoke test performed on production URL.
- [ ] No critical errors in Vercel logs.

### 7. Document the Release

- [ ] Session journal entry written for this release.
- [ ] Release version and date noted in the journal.
- [ ] Any issues during the release recorded in the Troubleshooting Index.

---

## Release History

| Version | Date | Notes |
|---|---|---|
| v0.1.0 | 2026-08-01 | Initial tag — pre-deployment state |
