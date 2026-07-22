import { NextRequest } from 'next/server';
import { RegisterDto } from '@/features/auth/dtos/register.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = RegisterDto.parse(await req.json());
    const { authService } = getContainer();
    const result = await authService.register(body);
    return successResponse(result, 201);
  });
}
