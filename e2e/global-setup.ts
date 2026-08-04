import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.E2E_BASE_URL ?? 'https://greg-ai-habits.vercel.app';
const AUTH_DIR = path.join(__dirname, '.auth');

export interface TestCredentials {
  email: string;
  password: string;
  displayName: string;
}

async function globalSetup() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const ts = Date.now();
  const creds: TestCredentials = {
    email: `smoke-${ts}@test.local`,
    password: 'SmokeTest123!',
    displayName: 'Smoke Test User',
  };

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/register`);
  await page.fill('#display_name', creds.displayName);
  await page.fill('#email', creds.email);
  await page.fill('#password', creds.password);
  await page.fill('#confirm_password', creds.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 30_000 });

  await context.storageState({ path: path.join(AUTH_DIR, 'state.json') });
  fs.writeFileSync(
    path.join(AUTH_DIR, 'credentials.json'),
    JSON.stringify(creds, null, 2),
  );

  await browser.close();
}

export default globalSetup;
