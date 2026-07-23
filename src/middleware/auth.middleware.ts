import { NextRequest } from 'next/server';
import { getContainer } from '@/shared/lib/container';
import { getTokenFromRequest } from '@/features/auth/session';
import { User } from '@/shared/types';
import { UnauthorizedError } from '@/shared/utils/errors';

export async function requireAuth(req: NextRequest): Promise<User> {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }
  const { authService } = getContainer();
  return authService.getCurrentUser(token);
}
