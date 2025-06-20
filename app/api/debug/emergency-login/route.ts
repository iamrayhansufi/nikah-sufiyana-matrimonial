// Special API route for emergency login when debugging authentication issues
// WARNING: This should be removed in production!

import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
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

    // Find all users and check for matching email
    const keys = await redis.keys('user:*');
    
    for (const key of keys) {
      const user = await redis.hgetall(key);
      if (user && user.email === email) {
        // Generate JWT token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            name: user.fullName || user.email,
            role: user.role || 'user',
          },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '24h' }
        );

        // Log the successful emergency login
        console.log(`🔓 Emergency login successful for user: ${email}`);

        return NextResponse.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.fullName || user.email,
            role: user.role || 'user',
            isVerified: user.isVerified === 'true',
            phone: user.phone,
          }
        });
      }
    }

    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  } catch (error) {
    console.error('❌ Emergency login error:', error);
    return NextResponse.json(
      { error: "Failed to process emergency login" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
