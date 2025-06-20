import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"

export const dynamic = 'force-dynamic'; // Never cache this endpoint

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get all cookies for debugging
    const allCookies: Record<string, string> = {};
    request.cookies.getAll().forEach(cookie => {
      // Redact sensitive values but show cookie names
      if (cookie.name.includes('next-auth') || cookie.name.includes('__Secure') || cookie.name.includes('__Host')) {
        allCookies[cookie.name] = '[REDACTED]';
      } else {
        allCookies[cookie.name] = cookie.value;
      }
    });
    
    // Get all important headers
    const host = request.headers.get('host') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || 'unknown';

    // Collect domain info for debugging
    let parsedNextAuthUrl = null;
    let rawNextAuthUrl = process.env.NEXTAUTH_URL || 'Not set';
    try {
      if (process.env.NEXTAUTH_URL) {
        const url = new URL(process.env.NEXTAUTH_URL);
        parsedNextAuthUrl = {
          protocol: url.protocol,
          hostname: url.hostname,
          pathname: url.pathname,
          fullUrl: process.env.NEXTAUTH_URL
        };
      }
    } catch (e) {
      parsedNextAuthUrl = `Error parsing: ${e instanceof Error ? e.message : 'unknown'}`;
    }
    
    // Get request URL info
    const requestUrl = new URL(request.url);
    
    const debugInfo = {
      hasSession: !!session,
      sessionInfo: session ? {
        expires: session.expires,
        user: session.user ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        } : null
      } : null,
      
      cookies: {
        allCookies,
        count: request.cookies.getAll().length,
        // Explicitly check for auth cookies
        hasSessionToken: request.cookies.has('next-auth.session-token') || 
                        request.cookies.has('__Secure-next-auth.session-token'),
        hasCSRFToken: request.cookies.has('next-auth.csrf-token') || 
                      request.cookies.has('__Host-next-auth.csrf-token'),
      },
      
      requestInfo: {
        host: request.headers.get('host'),
        hostname: requestUrl.hostname,
        pathname: requestUrl.pathname,
        protocol: requestUrl.protocol,
        origin: requestUrl.origin,
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        secure: requestUrl.protocol === 'https:',
      },
      
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextauthUrl: process.env.NEXTAUTH_URL,
        parsedNextAuthUrl,
        vercelEnv: process.env.VERCEL_ENV || 'not set',
        hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        timestamp: new Date().toISOString(),
      }
    }
    
    return NextResponse.json(debugInfo, { status: 200 })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json({ 
      error: "Debug failed", 
      message: error instanceof Error ? error.message : "Unknown error",
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
