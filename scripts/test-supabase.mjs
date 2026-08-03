/**
 * Diagnostic script — run from the project root:
 *   node scripts/test-supabase.mjs
 *
 * Tests the Supabase connection using the credentials in .env.local and prints
 * the raw error if any operation fails. This is used to diagnose the
 * "Failed to create user record" registration blocker from SESSION-001.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// ── Load .env.local manually (no dotenv dependency needed) ───────────────────
// fileURLToPath decodes percent-encoded characters (e.g. %20 → space), which
// is required when the project directory contains spaces.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
let envContent;
try {
  envContent = readFileSync(envPath, 'utf8');
} catch {
  console.error('[FATAL] .env.local not found at', envPath);
  process.exit(1);
}

const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
}

const SUPABASE_URL = env['SUPABASE_URL'];
const SUPABASE_SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[FATAL] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}

console.log('[INFO] SUPABASE_URL:', SUPABASE_URL);
console.log('[INFO] SERVICE_ROLE_KEY length:', SUPABASE_SERVICE_ROLE_KEY.length);
console.log('[INFO] SERVICE_ROLE_KEY prefix:', SUPABASE_SERVICE_ROLE_KEY.slice(0, 6) + '...');
console.log('');

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Test 1: List tables ───────────────────────────────────────────────────────
console.log('[TEST 1] Reading from public.users ...');
const { data: rows, error: readErr } = await db.from('users').select('id, email').limit(5);

if (readErr) {
  console.error('[FAIL] SELECT from public.users failed:');
  console.error('  code   :', readErr.code);
  console.error('  message:', readErr.message);
  console.error('  hint   :', readErr.hint);
  console.error('  details:', readErr.details);
} else {
  console.log('[PASS] SELECT returned', rows.length, 'rows');
}

// ── Test 2: Auth admin list users ────────────────────────────────────────────
console.log('');
console.log('[TEST 2] Auth admin listUsers ...');
const { data: authData, error: authErr } = await db.auth.admin.listUsers({ page: 1, perPage: 1 });

if (authErr) {
  console.error('[FAIL] auth.admin.listUsers failed:');
  console.error('  message:', authErr.message);
} else {
  console.log('[PASS] auth.admin.listUsers returned', authData.users.length, 'user(s)');
}

// ── Test 3: INSERT a diagnostic row ──────────────────────────────────────────
console.log('');
console.log('[TEST 3] Upsert a diagnostic row into public.users ...');
const testId = '00000000-0000-0000-0000-000000000001';
const { data: upsertData, error: upsertErr } = await db
  .from('users')
  .upsert({ id: testId, email: 'diagnostic@test.local', display_name: 'Diagnostic Test' }, { onConflict: 'id' })
  .select()
  .single();

if (upsertErr) {
  console.error('[FAIL] UPSERT into public.users failed:');
  console.error('  code   :', upsertErr.code);
  console.error('  message:', upsertErr.message);
  console.error('  hint   :', upsertErr.hint);
  console.error('  details:', upsertErr.details);
} else {
  console.log('[PASS] UPSERT succeeded:', upsertData);
  // Clean up test row
  await db.from('users').delete().eq('id', testId);
  console.log('[PASS] Cleaned up diagnostic row');
}

console.log('');
console.log('Done.');
