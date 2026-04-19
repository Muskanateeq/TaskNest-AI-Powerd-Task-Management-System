/**
 * Next.js Middleware for Authentication
 *
 * Handles route protection and authentication checks centrally
 * to prevent race conditions from multiple page-level checks.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// Public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup'];

// Auth routes that authenticated users shouldn't access
const authRoutes = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has session cookie using Better Auth helper
  // This automatically handles __Secure- prefix in production
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // Redirect authenticated users away from auth pages
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isAuthenticated) {
    // Redirect to signin with return URL
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by Better Auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
