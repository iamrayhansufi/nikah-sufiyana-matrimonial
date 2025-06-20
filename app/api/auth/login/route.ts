import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { redis, redisTables } from "../../../../lib/redis-client";
import { database } from "@/lib/database-service";

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  autoLogin: z.boolean().optional(),
  verificationToken: z.string().optional(),
}).refine(data => {
  // Either email/phone + password OR email + verificationToken must be provided
  return (data.email || data.phone) && (data.password || (data.autoLogin && data.verificationToken));
}, {
  message: "Either provide credentials or verification token"
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const credentials = loginSchema.parse(body);

    // Find user by email or phone
    let user = null;
    if (credentials.email) {
      user = await database.users.getByEmail(credentials.email);
    } else if (credentials.phone) {
      // Get all users and find by phone
      const userIds = await redis.smembers("users");
      for (const id of userIds) {
        const userData = await redis.hgetall(`user:${id}`);
        if (userData && userData.phone === credentials.phone) {
          user = userData;
          break;
        }
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Handle auto-login after verification
    if (credentials.autoLogin && credentials.verificationToken) {
      // Validate the verification token (simple check to prevent abuse)
      const [tokenEmail, tokenCode] = credentials.verificationToken.split(':');
      
      if (tokenEmail !== credentials.email || !tokenCode || tokenCode.length !== 6) {
        return NextResponse.json(
          { success: false, error: "Invalid verification token" },
          { status: 400 }
        );
      }
      
      // Check if user is verified
      if (user.verified !== true && user.verified !== 'true') {
        // Update verified status
        await database.users.update(user.id, { verified: true });
      }
      
      // Skip password verification for auto-login
    } else if (credentials.password) {
      // Normal login - verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } else {
      // If we get here, the schema validation failed
      return NextResponse.json(
        { error: "Invalid login request" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update last active
    await database.users.update(user.id, { 
      lastActive: new Date().toISOString() 
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        profileStatus: user.profileStatus,
        subscription: user.subscription,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
