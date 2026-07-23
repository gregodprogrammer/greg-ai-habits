import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AUTH, PROTECTED_ROUTES, AUTH_ONLY_ROUTES, ROUTES } from '@/config/constants';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};

async function isAuthenticated(token: string): Promise<boolean> {
  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
    const {
      data: { user },
    } = await client.auth.getUser(token);
    return !!user;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  const isProtected = (PROTECTED_ROUTES as readonly string[]).some(
    (r) => pathname === r || pathname.startsWith(r + '/'),
  );
  const isAuthOnly = (AUTH_ONLY_ROUTES as readonly string[]).includes(pathname);

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH.COOKIE_NAME)?.value ?? null;
  const authenticated = token ? await isAuthenticated(token) : false;

  if (isProtected && !authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = ROUTES.DASHBOARD;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
