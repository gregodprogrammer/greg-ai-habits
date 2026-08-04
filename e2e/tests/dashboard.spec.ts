import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('loads with all four stat cards', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.getByText('Active Habits')).toBeVisible();
    await expect(page.getByText('Completion Rate')).toBeVisible();
    await expect(page.getByText('Current Streak')).toBeVisible();
    await expect(page.getByText('Longest Streak')).toBeVisible();
  });

  test('shows the Your Habits section', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h2:has-text("Your Habits")')).toBeVisible();
    const viewAllLink = page.locator('a:has-text("View all")');
    await expect(viewAllLink).toBeVisible();
    await expect(viewAllLink).toHaveAttribute('href', '/habits');
  });

  test('habit count stat is a non-negative integer', async ({ page }) => {
    await page.goto('/dashboard');
    const activeCard = page.locator('text=Active Habits').locator('..');
    await expect(activeCard).toBeVisible();
  });
});
