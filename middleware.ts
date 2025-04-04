// middleware.ts
import { clerkMiddleware, ClerkMiddlewareAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Define public routes
const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up'];

export default clerkMiddleware((auth: ClerkMiddlewareAuth, request: NextRequest) => {
  const { userId } = auth;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route);

  // If the user is not authenticated and the route is not public, redirect to sign-in
  if (!userId && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // Allow the request to proceed if the user is authenticated or the route is public
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};