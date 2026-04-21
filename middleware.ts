import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';

  // 1. Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 2. Auth-based Rewrites for overlapping routes (home, service, meeting)
  if (isLoggedIn) {
    if (pathname === '/home') {
      return NextResponse.rewrite(new URL('/member-home', request.url));
    }
    if (pathname === '/service') {
      return NextResponse.rewrite(new URL('/member-service', request.url));
    }
    if (pathname === '/meeting') {
      return NextResponse.rewrite(new URL('/member-meeting', request.url));
    }
  }

  // 3. Protection for Member-only routes
  const memberRoutes = ['/profile', '/learning', '/careers', '/tools', '/store', '/member-home', '/member-service', '/member-meeting'];
  if (memberRoutes.some(route => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Protection for Login (if already logged in, go home)
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

// Config to match all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (local images)
     */
    '/((?!api|_next|favicon.ico|images).*)',
  ],
};
