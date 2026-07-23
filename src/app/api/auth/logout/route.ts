import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { getTokenFromRequest, clearSessionCookie } from '@/features/auth/session';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function POST(req: NextRequest) {
  let shouldClear = false;

  const response = await handleRoute(async () => {
    await requireAuth(req);
    const token = getTokenFromRequest(req);
    if (token) {
      const { authService } = getContainer();
      await authService.logout(token);
    }
    shouldClear = true;
    return successResponse({ message: 'Logged out successfully' });
  });

  if (shouldClear) {
    clearSessionCookie(response);
  }

  return response;
}
