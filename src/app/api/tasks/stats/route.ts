import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { tasksService } = getContainer();
    const stats = await tasksService.getStats(user.id);
    return successResponse(stats);
  });
}
