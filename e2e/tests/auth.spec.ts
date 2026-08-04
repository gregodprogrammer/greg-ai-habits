import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import type { TestCredentials } from '../global-setup';

function loadCredentials(): TestCredentials {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '../.auth/credentials.json'), 'utf-8'),
  );
}

// ─── Unauthenticated flows ────────────────────────────────────────────────────

test.describe('Auth — unauthenticated flows', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('registers a new user and lands on dashboard', async ({ page }) => {
    const ts = Date.now();
    await page.goto('/register');
    await page.fill('#display_name', 'New Smoke User');
    await page.fill('#email', `new-smoke-${ts}@test.local`);
    await page.fill('#password', 'SmokeTest123!');
    await page.fill('#confirm_password', 'SmokeTest123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 30_000 });
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('logs in with valid credentials and lands on dashboard', async ({ page }) => {
    const { email, password } = loadCredentials();
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 20_000 });
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('shows error message for invalid password', async ({ page }) => {
    const { email } = loadCredentials();
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', 'WrongPassword999!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.url()).not.toContain('/dashboard');
  });
});

// ─── Authenticated flows ──────────────────────────────────────────────────────

test.describe('Auth — authenticated flows', () => {
  test('logs out and redirects to login page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await page.click('button:has-text("Sign out")');
    await page.waitForURL('**/login', { timeout: 10_000 });
    await expect(page.locator('h1:has-text("Sign in")')).toBeVisible();
  });
});
