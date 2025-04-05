// middleware.ts
import { createSupabaseServerClient } from './lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};