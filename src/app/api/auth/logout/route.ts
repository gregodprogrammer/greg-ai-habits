import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const token = req.headers.get('authorization')?.slice(7) ?? '';
    await requireAuth(req);
    const { authService } = getContainer();
    await authService.logout(token);
    return successResponse({ message: 'Logged out successfully' });
  });
}
