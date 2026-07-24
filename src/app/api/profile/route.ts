import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/middleware/auth.middleware';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

const UpdateProfileDto = z.object({
  display_name: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    return successResponse(user);
  });
}

export async function PATCH(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { display_name } = UpdateProfileDto.parse(await req.json());
    const { authService } = getContainer();
    const updated = await authService.updateProfile(user.id, display_name);
    return successResponse(updated);
  });
}
