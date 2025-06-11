import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const hostname = req.headers.get('host') || '';
    const mainDomain = new URL(process.env.NEXTAUTH_URL || '').hostname;
    const previewUrls = (process.env.NEXTAUTH_PREVIEW_URLS || '').split(',')
      .map(url => new URL(url.trim()).hostname)
      .filter(Boolean);

    // Allow preview URLs in development and preview environments
    if (process.env.NODE_ENV !== 'production' || previewUrls.includes(hostname)) {
      return NextResponse.next();
    }

    // Redirect non-main domains to main domain in production
    if (hostname !== mainDomain) {
      return NextResponse.redirect(new URL(req.url, process.env.NEXTAUTH_URL));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Protected routes
        if (
          (req.nextUrl.pathname.startsWith("/dashboard") ||
            req.nextUrl.pathname.startsWith("/edit-profile") ||
            req.nextUrl.pathname.startsWith("/settings")) &&
          !token
        ) {
          return false;
        }
        return true;
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/edit-profile/:path*", "/settings/:path*"],
}
