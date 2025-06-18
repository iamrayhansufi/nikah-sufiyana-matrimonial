import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signIn } from "next-auth/react";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { z } from "zod";

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
    let user;
    if (credentials.email) {
      user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
    } else if (credentials.phone) {
      user = await db.select().from(users).where(eq(users.phone, credentials.phone)).limit(1);
    }
    
    if (!user || user.length === 0) {
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
      if (!user[0].verified) {
        // Try to update the verified status
        await db
          .update(users)
          .set({ verified: true })
          .where(eq(users.id, user[0].id))
          .catch(err => console.error("Error updating verification status:", err));
      }
      
      // Skip password verification for auto-login
    } else if (credentials.password) {
      // Normal login - verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user[0].password);
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
      { userId: user[0].id, email: user[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update last active
    await db
      .update(users)
      .set({ lastActive: new Date() })
      .where(eq(users.id, user[0].id));

    return NextResponse.json({
      user: {
        id: user[0].id,
        email: user[0].email,
        fullName: user[0].fullName,
        profileStatus: user[0].profileStatus,
        subscription: user[0].subscription,
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
