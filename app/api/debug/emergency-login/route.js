// Special API route for emergency login when debugging authentication issues
// WARNING: This should be removed in production!

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  // Only allowed in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: "Endpoint not available in production" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email, secretKey } = body;

    // Simple security check to prevent abuse (set this in .env)
    if (secretKey !== process.env.EMERGENCY_LOGIN_KEY) {
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
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '1h' }
    );

    // Set the cookie
    cookies().set({
      name: "next-auth.session-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 // 1 hour
    });

    return NextResponse.json({
      success: true,
      message: "Emergency login successful",
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        verified: true
      }
    });
  } catch (error) {
    console.error("Emergency login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
