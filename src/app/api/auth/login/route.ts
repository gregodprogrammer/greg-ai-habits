import { NextRequest } from 'next/server';
import { LoginDto } from '@/features/auth/dtos/login.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = LoginDto.parse(await req.json());
    const { authService } = getContainer();
    const result = await authService.login(body);
    return successResponse(result);
  });
}
