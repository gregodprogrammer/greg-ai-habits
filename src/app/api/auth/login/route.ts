import { NextRequest } from 'next/server';
import { LoginDto } from '@/features/auth/dtos/login.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';
import { setSessionCookie } from '@/features/auth/session';

export async function POST(req: NextRequest) {
  let accessToken: string | null = null;

  const response = await handleRoute(async () => {
    const body = LoginDto.parse(await req.json());
    const { authService } = getContainer();
    const result = await authService.login(body);
    accessToken = result.accessToken;
    return successResponse(result);
  });

  if (accessToken) {
    setSessionCookie(response, accessToken);
  }

  return response;
}
