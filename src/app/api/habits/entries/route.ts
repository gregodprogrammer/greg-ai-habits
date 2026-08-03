import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/middleware/auth.middleware';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

const EntryQuerySchema = z.object({
  from: z.string().date('from must be YYYY-MM-DD'),
  to: z.string().date('to must be YYYY-MM-DD'),
});

// GET /api/habits/entries?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns all habit entries for the authenticated user in the given date range.
// Used by the frontend to hydrate the "logged today" state on page load without
// making N individual requests (one per habit).
export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { from, to } = EntryQuerySchema.parse({
      from: req.nextUrl.searchParams.get('from'),
      to: req.nextUrl.searchParams.get('to'),
    });
    const { habitsService } = getContainer();
    const entries = await habitsService.getAllEntries(user.id, from, to);
    return successResponse(entries);
  });
}
