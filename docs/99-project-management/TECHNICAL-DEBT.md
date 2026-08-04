# Technical Debt Register

_Last updated: 2026-08-04_

---

## Active Items

| ID    | Item                               | Module     | Reason Deferred                                         | Impact                                                     | Planned Release |
|-------|------------------------------------|------------|---------------------------------------------------------|------------------------------------------------------------|-----------------|
| TD-01 | `src/proxy.ts` inactive middleware | Auth       | Renaming to `middleware.ts` carries risk; auth already works via API 401 + client redirect | Unauthenticated users briefly see a spinner before redirect | Auth hardening sprint |
| TD-02 | `today()` uses UTC time            | Habits     | Timezone support requires user profile data; deferred for simplicity | Users in UTC+ may see tomorrow's date near midnight local time | Profile module release |
| TD-03 | No focus trap in habit modal       | Habits     | Escape key works; full WCAG 2.1 AA trap is low user impact for MVP | Tab key cycles outside modal boundary (accessibility)       | Accessibility sprint |
| TD-04 | No GitHub Actions CI pipeline      | Infra      | Vercel auto-deploys from `main`; manual QA gates in place | Typecheck and unit tests not automatically run on PRs       | After Budget release |
| TD-05 | No Playwright CI integration       | Infra      | E2E suite targets production; CI would need a preview URL strategy | E2E must be run manually after each deploy                  | After CI pipeline setup |
| TD-06 | `src/proxy.ts` mismatched export   | Auth       | `export function middleware` name must match the file; currently named `proxy.ts` with `isAuthenticated` | Routes are not server-protected; RLS and API 401s are the safety net | Auth hardening sprint |
| TD-07 | Pagination not implemented         | Habits     | `MAX_PER_USER` is 50; no realistic need at MVP scale    | UI lists all habits at once; performance degrades above ~50 | Habits v1.1 |

---

## Resolved Items

| ID    | Item                                           | Module  | Resolved In | Commit    |
|-------|------------------------------------------------|---------|-------------|-----------|
| ~~TD-R01~~ | `output: 'standalone'` for Docker broke Vercel | Infra | v0.1.0 deploy | `0aba1c2` |
| ~~TD-R02~~ | `DATABASE_URL` required but unused             | Infra   | v0.1.0 deploy | `0aba1c2` |
| ~~TD-R03~~ | `OPENAI_API_KEY` required; no graceful fallback | AI     | v0.1.0 deploy | `eafb59f` |
| ~~TD-R04~~ | No Node version pin for Vercel                 | Infra   | v0.1.0 deploy | `0aba1c2` |
| ~~TD-R05~~ | `update()`/`delete()` lacked `user_id` filter  | Habits  | Habits QA     | `d6b2609` |

---

## Notes

- TD-01 and TD-06 describe the same root issue from different angles — the authentication middleware is the single most impactful unresolved item.
- RLS policies (migration 004) and API-level `user_id` checks provide defense in depth while TD-01/TD-06 remain deferred.
- None of these items affect data integrity or security in a way that blocks production use.
