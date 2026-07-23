import { NextRequest } from 'next/server';
import { RegisterDto } from '@/features/auth/dtos/register.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';
import { setSessionCookie } from '@/features/auth/session';

export async function POST(req: NextRequest) {
  let accessToken: string | null = null;

  const response = await handleRoute(async () => {
    const body = RegisterDto.parse(await req.json());
    const { authService } = getContainer();
    const result = await authService.register(body);
    accessToken = result.accessToken;
    return successResponse(result, 201);
  });

  if (accessToken) {
    setSessionCookie(response, accessToken);
  }

  return response;
}
