// middleware.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes using a matcher
const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up'];

export async function middleware(request: NextRequest) {
  const { userId } = await auth(); // Use await to resolve the Promise

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname === route
  );

  // If the user is not authenticated and the route is not public, redirect to sign-in
  if (!userId && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // Allow the request to proceed if the user is authenticated or the route is public
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|triggers)(.*)'],
};