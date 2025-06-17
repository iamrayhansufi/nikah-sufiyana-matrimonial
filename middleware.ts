import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {    const token = req.nextauth.token
    const isAuth = !!token
      const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/register')
    
    const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                          req.nextUrl.pathname === '/edit-profile' ||
                          req.nextUrl.pathname.startsWith('/edit-profile/') ||
                          req.nextUrl.pathname.startsWith('/settings')// Handle domain check
    const hostname = req.headers.get('host') || ''
    
    // Avoid URL parsing errors by providing a fallback
    let mainDomain = 'nikahsufiyana.com'
    try {
      if (process.env.NEXTAUTH_URL) {
        mainDomain = new URL(process.env.NEXTAUTH_URL).hostname
      }
    } catch (error) {
      console.error('Error parsing NEXTAUTH_URL:', error)
    }
      // Parse preview URLs safely
    const previewUrls = (process.env.NEXTAUTH_PREVIEW_URLS || '').split(',')
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => {
        try {
          return new URL(url).hostname
        } catch {
          return url // Keep as is if URL parsing fails
        }
      })
      .filter(Boolean)

    // Always allow Vercel preview domains
    const isVercelPreview = hostname.includes('vercel.app') && hostname !== mainDomain
    
    // Treat both www and non-www versions of the domain as valid
    const isWwwVersion = hostname === `www.${mainDomain}`
    
    // Allow known domains in development and preview environments
    if (process.env.NODE_ENV !== 'production' || 
        previewUrls.includes(hostname) || 
        isVercelPreview ||
        isWwwVersion) {
      // Continue with auth checks - no redirect needed
    } else if (hostname !== mainDomain && process.env.NODE_ENV === 'production') {
      // Redirect non-main domains to main domain in production
      return NextResponse.redirect(new URL(req.url, process.env.NEXTAUTH_URL || `https://${mainDomain}`))
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
    '/edit-profile', // Added without path wildcard to match exact path
    '/edit-profile/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/interests/:path*',
    '/shortlist/:path*'
    // Profile pages are not strictly protected by middleware
    // The page itself handles auth state
  ]
}
