import { test, expect } from '@playwright/test';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Habits', path: '/habits' },
  { label: 'Budget', path: '/budget' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'AI Coach', path: '/ai-coach' },
  { label: 'Profile', path: '/profile' },
];

test.describe('Navigation', () => {
  for (const { label, path } of NAV_LINKS) {
    test(`sidebar link "${label}" loads ${path}`, async ({ page }) => {
      await page.goto('/dashboard');
      await page.click(`a[href="${path}"]`);
      // toHaveURL auto-waits; a redirect to /login means the route rejected auth
      await expect(page).toHaveURL(new RegExp(path + '(/|$)'), { timeout: 15_000 });
    });
  }

  test('active nav link has aria-current="page"', async ({ page }) => {
    await page.goto('/habits');
    await expect(page.locator('a[href="/habits"][aria-current="page"]')).toBeVisible();
  });
});
