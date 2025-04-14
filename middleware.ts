import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl; // Get the path

  // Allow access to the root page and auth pages regardless of session
  // except redirect logged-in users away from login/register
  if (pathname === '/' || pathname.startsWith('/auth')) {
    if (session && (pathname === '/auth/login' || pathname === '/auth/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Allow access to root and other auth pages (like verification, callback)
    return res;
  }

  // If trying to access any other page AND no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Otherwise (user has session and is not on /, /auth/*), allow access
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - FootyLabs_logo.svg (Your specific logo file at the root of public)
     * Also exclude paths ending with common image/font extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|FootyLabs_logo.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
}