// middleware.ts
import { createSupabaseServerClient } from './lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Export the middleware function explicitly
export const middleware = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const requestUrl = new URL(request.url);
  const isAuthPath = requestUrl.pathname.startsWith('/auth');
  const isDashboardPath = requestUrl.pathname.startsWith('/dashboard');

  if (!session && isDashboardPath) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  cookieStore.getAll().forEach((cookie: { name: string; value: string }) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
};

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};