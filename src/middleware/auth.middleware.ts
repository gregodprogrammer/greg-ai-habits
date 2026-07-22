import { NextRequest } from 'next/server';
import { getContainer } from '@/shared/lib/container';
import { User } from '@/shared/types';
import { UnauthorizedError } from '@/shared/utils/errors';

export async function requireAuth(req: NextRequest): Promise<User> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing authorization header');
  }

  const token = authHeader.slice(7);
  const { authService } = getContainer();
  return authService.getCurrentUser(token);
}
