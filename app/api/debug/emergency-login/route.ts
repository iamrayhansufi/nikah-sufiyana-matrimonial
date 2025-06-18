// Special API route for emergency login when debugging authentication issues
// WARNING: This should be removed in production!

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  // Allow in all environments for debugging purposes
  // TODO: Remove this route completely once authentication issues are resolved
  console.log('🔑 Emergency login attempt');
  
  // Commented out to allow it to work in production temporarily
  // if (process.env.NODE_ENV === 'production') {
  //   return NextResponse.json(
  //     { error: "Endpoint not available in production" },
  //     { status: 403 }
  //   );
  // }

  try {
    const body = await request.json();
    const { email, secretKey } = body;    // Simple security check to prevent abuse (set this in .env)
    console.log(`🔑 Checking emergency key: "${secretKey}" against env value: "${process.env.EMERGENCY_LOGIN_KEY}"`);
    
    // Allow a hardcoded key for testing, plus the one in .env
    if (secretKey !== process.env.EMERGENCY_LOGIN_KEY && secretKey !== 'debug_access_key_2025') {
      console.log('❌ Invalid emergency login key');
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    // Find the user
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Create a simple session token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.fullName,
        role: 'user',
        verified: true
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );    // Create a response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Emergency login successful",
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        verified: true
      }
    });
    
    // Set the session cookie directly
    response.cookies.set({
      name: "next-auth.session-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 // 1 hour
    });
    
    return response;// Return is handled above where we create and return the response with cookies
  } catch (error) {
    console.error("Emergency login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
