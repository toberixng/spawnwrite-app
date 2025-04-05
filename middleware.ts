// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/auth/sign-in', '/auth/sign-up', '/api/clerk-webhook']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Await the promise to get userId

  const url = new URL(req.url);

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  if (userId && (url.pathname === '/auth/sign-in' || url.pathname === '/auth/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};