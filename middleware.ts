import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          (req.nextUrl.pathname.startsWith("/dashboard") ||
            req.nextUrl.pathname.startsWith("/edit-profile") ||
            req.nextUrl.pathname.startsWith("/settings")) &&
          !token
        ) {
          return false
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/edit-profile/:path*", "/settings/:path*"],
}
