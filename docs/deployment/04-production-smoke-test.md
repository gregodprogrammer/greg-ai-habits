# Production Smoke Test

| Field | Value |
|---|---|
| **Purpose** | Manual test script to verify every critical user flow after deployment |
| **Audience** | QA, Greg Odi |
| **Last Updated** | 2026-08-04 |
| **Estimated time** | 10–15 minutes |

---

## Before you start

- Use an **incognito / private browser window** to ensure no existing session
- Use a **fresh email address** not previously registered
- Have the production URL ready (e.g., `https://greg-ai-habits.vercel.app`)

---

## Test Flow

### 1. Landing Page

```
Open: https://[production-url]/
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1.1 | Load the homepage | Page loads with "Greg AI Habits" heading | |
| 1.2 | Check "Get started" button visible | Visible and clickable | |
| 1.3 | Check "Sign in" button visible | Visible and clickable | |
| 1.4 | Resize to mobile (375px) | Page is responsive, no horizontal scroll | |

---

### 2. Registration

```
Click: Get started → /register
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 2.1 | Load /register | Registration form appears | |
| 2.2 | Submit empty form | Validation errors shown for all required fields | |
| 2.3 | Enter mismatched passwords | "Passwords do not match" error shown | |
| 2.4 | Enter short password (< 8 chars) | "at least 8 characters" error shown | |
| 2.5 | Fill in valid name, email, password | No errors | |
| 2.6 | Submit the form | Redirect to /dashboard | |
| 2.7 | Check Supabase: auth.users | New user record exists | |
| 2.8 | Check Supabase: public.users | New user record exists (same UUID) | |

---

### 3. Dashboard

```
Current page: /dashboard
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 3.1 | Dashboard loads | "Dashboard" heading visible, no errors | |
| 3.2 | Desktop sidebar visible | Navigation links: Dashboard, Habits, Budget, Tasks, Analytics, AI Coach, Profile | |
| 3.3 | Active nav item highlighted | "Dashboard" link is visually distinct (highlighted) | |

---

### 4. Habits — Create

```
Navigate to: /habits
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 4.1 | Load /habits | "Habits" heading visible, "No active habits" empty state | |
| 4.2 | Habits nav link active | "Habits" nav item is highlighted, "Dashboard" is not | |
| 4.3 | Click "+ New Habit" | Modal opens with focus on Name field | |
| 4.4 | Press Escape | Modal closes immediately | |
| 4.5 | Click "+ New Habit" again | Modal reopens | |
| 4.6 | Submit with empty name | "Name is required" error shown | |
| 4.7 | Fill Name only (no description) | No error — description is optional | |
| 4.8 | Click "Create habit" | Modal closes, habit appears in list | |
| 4.9 | Create second habit | Appears in the grid | |

---

### 5. Habits — Log Today

```
Current page: /habits (active tab)
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 5.1 | "Log Today" button visible on first habit | Button is present | |
| 5.2 | Click "Log Today" | Button changes to "✓ Logged — Undo" | |
| 5.3 | Refresh the page | "✓ Logged — Undo" still shown (hydration working) | |
| 5.4 | Click "✓ Logged — Undo" | Button reverts to "Log Today" | |
| 5.5 | Log the habit again | Shows "✓ Logged — Undo" again (no duplicate error) | |

---

### 6. Habits — Edit

```
Current page: /habits (active tab)
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 6.1 | Click "Edit" on a habit | Modal opens pre-filled with habit data | |
| 6.2 | Change the name | Name field updated | |
| 6.3 | Clear the description field | Field is now empty | |
| 6.4 | Click "Save changes" | Modal closes, habit name updated, description empty | |
| 6.5 | Re-open edit modal | Description field is empty (not reverting) | |

---

### 7. Habits — Archive and Restore

```
Current page: /habits (active tab)
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 7.1 | Click "Archive" on a habit | Habit disappears from Active tab | |
| 7.2 | Click "Archived" tab | Archived habit appears, "Restore" button visible | |
| 7.3 | Click "Restore" | Habit disappears from Archived tab | |
| 7.4 | Click "Active" tab | Restored habit is back | |

---

### 8. Habits — Delete

```
Current page: /habits (active tab)
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 8.1 | Click "Delete" on a habit | Confirmation dialog appears | |
| 8.2 | Cancel the dialog | Habit remains | |
| 8.3 | Click "Delete" again and confirm | Habit is removed permanently | |

---

### 9. Mobile Navigation

```
Resize browser to ≤ 640px or use DevTools mobile emulation
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 9.1 | Load /habits on mobile | Sidebar hidden, hamburger menu icon visible in header | |
| 9.2 | Tap hamburger icon | Slide-down nav opens with all links | |
| 9.3 | Tap a nav link | Navigates and nav closes | |
| 9.4 | Tap hamburger again | Nav reopens | |
| 9.5 | Tap hamburger to close | Nav closes | |

---

### 10. Authentication persistence

```
In the same browser session:
```

| # | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 10.1 | Navigate directly to /habits | Loads (authenticated, not redirected to login) | |
| 10.2 | Open a new tab to /habits | Still authenticated | |
| 10.3 | Click "Logout" | Redirected to /login | |
| 10.4 | Navigate to /habits directly | Redirected to /login (or spinner then redirect) | |
| 10.5 | Log in again | Redirected to dashboard | |
| 10.6 | Open /habits | Habits created earlier are still there (persistence confirmed) | |

---

## Smoke Test Summary

| Section | Status | Notes |
|---|---|---|
| Landing Page | | |
| Registration | | |
| Dashboard | | |
| Create Habit | | |
| Log Today | | |
| Edit Habit | | |
| Archive/Restore | | |
| Delete | | |
| Mobile Nav | | |
| Auth Persistence | | |

**Overall Result:** ☐ PASS  ☐ FAIL

**Tested by:** ___________________  **Date:** ___________________
