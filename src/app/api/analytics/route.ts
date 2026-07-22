import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { AnalyticsQueryDto } from '@/features/analytics/dtos/analytics-query.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const query = AnalyticsQueryDto.parse({
      from: req.nextUrl.searchParams.get('from') ?? undefined,
      to: req.nextUrl.searchParams.get('to') ?? undefined,
    });
    const { analyticsService } = getContainer();
    const summary = await analyticsService.getSummary(user.id, query.from, query.to);
    return successResponse(summary);
  });
}
