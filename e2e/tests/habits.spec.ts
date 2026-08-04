import { test, expect } from '@playwright/test';

const HABIT_NAME = `Smoke Habit ${Date.now()}`;
const EDITED_NAME = `${HABIT_NAME} — Edited`;

test.describe.serial('Habits CRUD and logging', () => {
  test('creates a habit and it appears in the active list', async ({ page }) => {
    await page.goto('/habits');
    await page.click('button:has-text("+ New Habit")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.fill('#habit-name', HABIT_NAME);
    await page.fill('#habit-description', 'Created by smoke test');
    await page.selectOption('#habit-frequency', 'daily');
    await page.fill('#habit-target', '1');

    await page.click('button:has-text("Create habit")');

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`text=${HABIT_NAME}`)).toBeVisible();
  });

  test('habit persists after page reload', async ({ page }) => {
    await page.goto('/habits');
    await expect(page.locator(`text=${HABIT_NAME}`)).toBeVisible();
  });

  test('edits a habit name', async ({ page }) => {
    await page.goto('/habits');
    await page.click(`[aria-label="Edit ${HABIT_NAME}"]`);
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.fill('#habit-name', EDITED_NAME);
    await page.click('button:has-text("Save changes")');

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`text=${EDITED_NAME}`)).toBeVisible();
  });

  test('logs today and shows logged state', async ({ page }) => {
    await page.goto('/habits');
    const logBtn = page.locator(`button:has-text("Log Today")`).first();
    await expect(logBtn).toBeVisible();
    await logBtn.click();
    await expect(page.locator('button:has-text("✓ Logged")')).toBeVisible({ timeout: 10_000 });
  });

  test('logged state persists after reload', async ({ page }) => {
    await page.goto('/habits');
    await expect(page.locator('button:has-text("✓ Logged")')).toBeVisible();
  });

  test('undoes a log entry', async ({ page }) => {
    await page.goto('/habits');
    await page.click('button:has-text("✓ Logged")');
    await expect(page.locator('button:has-text("Log Today")')).toBeVisible({ timeout: 10_000 });
  });

  test('archives a habit and it appears in archived tab', async ({ page }) => {
    await page.goto('/habits');
    await page.click(`[aria-label="Archive ${EDITED_NAME}"]`);
    await expect(page.locator(`text=${EDITED_NAME}`)).not.toBeVisible({ timeout: 10_000 });

    await page.click('button:has-text("archived")');
    await expect(page.locator(`text=${EDITED_NAME}`)).toBeVisible();
  });

  test('restores a habit and it appears in active tab', async ({ page }) => {
    await page.goto('/habits');
    await page.click('button:has-text("archived")');
    await page.click('button:has-text("Restore")');

    await page.click('button:has-text("active")');
    await expect(page.locator(`text=${EDITED_NAME}`)).toBeVisible();
  });

  test('deletes a habit and it is removed from the list', async ({ page }) => {
    await page.goto('/habits');

    page.on('dialog', (dialog) => dialog.accept());
    await page.click(`[aria-label="Delete ${EDITED_NAME}"]`);
    await expect(page.locator(`text=${EDITED_NAME}`)).not.toBeVisible({ timeout: 10_000 });
  });
});
