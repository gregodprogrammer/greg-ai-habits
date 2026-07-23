import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const sp = req.nextUrl.searchParams;
    const now = new Date();
    const month = Number(sp.get('month') ?? now.getMonth() + 1);
    const year = Number(sp.get('year') ?? now.getFullYear());
    const { budgetService } = getContainer();
    const summary = await budgetService.getSummary(user.id, month, year);
    return successResponse(summary);
  });
}
