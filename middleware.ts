// middleware.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from './lib/supabase-server';

export async function middleware(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const pathname = url.pathname;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (error || !data.user) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    // Fetch username for redirect (temporary until Phase 2)
    const { data: userData } = await supabase
      .from('users')
      .select('username')
      .eq('id', data.user.id)
      .single();

    if (userData?.username) {
      return NextResponse.next(); // Proceed to /dashboard for now
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all /dashboard routes
};