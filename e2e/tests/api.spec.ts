import { test, expect } from '@playwright/test';

const API_HABIT_NAME = `API Smoke ${Date.now()}`;
let createdHabitId: string;

test.describe.serial('API — habits endpoints', () => {
  test('GET /api/habits returns 200 with an array', async ({ request }) => {
    const res = await request.get('/api/habits');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /api/habits creates a habit and returns 201', async ({ request }) => {
    const res = await request.post('/api/habits', {
      data: {
        name: API_HABIT_NAME,
        frequency: 'daily',
        target_count: 1,
        color: '#6366f1',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({ name: API_HABIT_NAME, frequency: 'daily' });
    expect(typeof body.id).toBe('string');
    createdHabitId = body.id;
  });

  test('GET /api/habits/:id returns the created habit', async ({ request }) => {
    const res = await request.get(`/api/habits/${createdHabitId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(createdHabitId);
    expect(body.name).toBe(API_HABIT_NAME);
  });

  test('PATCH /api/habits/:id updates a field and returns 200', async ({ request }) => {
    const res = await request.patch(`/api/habits/${createdHabitId}`, {
      data: { name: `${API_HABIT_NAME} — Patched` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe(`${API_HABIT_NAME} — Patched`);
  });

  test('POST /api/habits/:id/entries logs today and returns 201', async ({ request }) => {
    const today = new Date().toISOString().slice(0, 10);
    const res = await request.post(`/api/habits/${createdHabitId}/entries`, {
      data: { logged_date: today },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.habit_id).toBe(createdHabitId);
    expect(body.logged_date).toBe(today);
  });

  test('DELETE /api/habits/:id/entries removes the log entry', async ({ request }) => {
    const today = new Date().toISOString().slice(0, 10);
    const res = await request.delete(`/api/habits/${createdHabitId}/entries?date=${today}`);
    expect(res.status()).toBe(204);
  });

  test('DELETE /api/habits/:id removes the habit and returns 204', async ({ request }) => {
    const res = await request.delete(`/api/habits/${createdHabitId}`);
    expect(res.status()).toBe(204);
  });

  test('GET /api/habits/:id returns 404 after deletion', async ({ request }) => {
    const res = await request.get(`/api/habits/${createdHabitId}`);
    expect(res.status()).toBe(404);
  });

  test('POST /api/habits returns 401 without auth cookie', async ({ browser }) => {
    const unauthContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const req = await unauthContext.request.post('/api/habits', {
      data: { name: 'Should fail', frequency: 'daily', target_count: 1 },
    });
    expect(req.status()).toBe(401);
    await unauthContext.close();
  });
});
