import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    // Check both authentication and verification status
    const isVerified = token?.verified === true
    
    // Debug middleware execution with more details
    console.log('🔍 Middleware Debug:', { 
      path: req.nextUrl.pathname,
      isAuth,
      isVerified,
      token: {
        id: token?.id,
        email: token?.email,
        verified: token?.verified,
        sub: token?.sub,
        // Log all token properties to see what's available
        ...Object.fromEntries(
          Object.entries(token || {}).map(([key, value]) => 
            [key, typeof value === 'object' ? '[Object]' : value]
          )
        )
      },
      cookies: req.cookies.getAll().map(c => c.name)
    })
    
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/register')
    
    const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                          req.nextUrl.pathname === '/edit-profile' ||
                          req.nextUrl.pathname.startsWith('/edit-profile/') ||
                          req.nextUrl.pathname.startsWith('/settings')// Handle domain check
    const hostname = req.headers.get('host') || ''
      // Avoid URL parsing errors by providing a fallback
    let expectedDomain = 'www.nikahsufiyana.com'
    try {
      if (process.env.NEXTAUTH_URL) {
        expectedDomain = new URL(process.env.NEXTAUTH_URL).hostname
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
    const isVercelPreview = hostname.includes('vercel.app')
    
    // Just allow the current hostname to continue - don't do any redirects
    // This completely disables domain redirects to prevent loops
    if (process.env.NODE_ENV !== 'production' || 
        previewUrls.includes(hostname) || 
        isVercelPreview ||
        hostname === expectedDomain) {
      // Continue with auth checks - no redirect needed
    } else if (process.env.NODE_ENV === 'production') {
      // Don't attempt domain redirects in production for now - disable this code
      // Uncomment this after the redirect loop issue is fixed
      // return NextResponse.redirect(new URL(req.url, process.env.NEXTAUTH_URL))
    }    // Redirect authenticated users from auth pages to dashboard
    if (isAuthPage && isAuth) {
      console.log('🔄 Middleware: Redirecting from auth page to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Block access to protected pages for users who are not authenticated
    if (isProtectedPage && !isAuth) {
      console.log('🔒 Middleware: Blocking access to protected page - user not authenticated')
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Ensure verified status for protected pages
    if (isProtectedPage && isAuth && !isVerified) {
      console.log('📧 Middleware: Redirecting to verify-email - user not verified')
      // Redirect unverified users to verify-email with their email
      const verifyEmailUrl = new URL('/verify-email', req.url)
      if (token?.email) {
        verifyEmailUrl.searchParams.set('email', token.email)
      }
      return NextResponse.redirect(verifyEmailUrl)
    }

    return NextResponse.next()
  },  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.log('🔑 Middleware Authorization Callback:', { 
          path: req.nextUrl.pathname,
          hasToken: !!token,
          tokenId: token?.id,
          tokenSub: token?.sub,
          tokenEmail: token?.email,
          tokenVerified: token?.verified,
        });
        
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
