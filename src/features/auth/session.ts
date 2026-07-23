import { type NextRequest, NextResponse } from 'next/server';
import { AUTH } from '@/config/constants';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(AUTH.COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH.COOKIE_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(AUTH.COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Prefer Bearer header (API clients), fall back to cookie (browser)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.cookies.get(AUTH.COOKIE_NAME)?.value ?? null;
}
