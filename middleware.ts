import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/register')
    const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                          req.nextUrl.pathname.startsWith('/edit-profile') ||
                          req.nextUrl.pathname.startsWith('/settings')    // Handle domain check
    const hostname = req.headers.get('host') || ''
    const mainDomain = new URL(process.env.NEXTAUTH_URL || '').hostname
    const previewUrls = (process.env.NEXTAUTH_PREVIEW_URLS || '').split(',')
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => {
        try {
          return new URL(url).hostname
        } catch {
          return null
        }
      })
      .filter(Boolean)

    // Allow preview URLs in development and preview environments
    if (process.env.NODE_ENV !== 'production' || previewUrls.includes(hostname)) {
      // Continue with auth checks
    } else if (hostname !== mainDomain && process.env.NODE_ENV === 'production') {
      // Redirect non-main domains to main domain in production
      return NextResponse.redirect(new URL(req.url, process.env.NEXTAUTH_URL))
    }

    // Redirect authenticated users from auth pages to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Allow access to protected pages for authenticated users
    if (isProtectedPage && !isAuth) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        return true // Let the middleware function handle the auth logic
      },
    },
  }
)

export const config = {
  matcher: [
    // Auth pages
    '/login',
    '/register',
    // Protected pages
    '/dashboard/:path*',
    '/edit-profile/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/interests/:path*',
    '/shortlist/:path*'
  ]
}
