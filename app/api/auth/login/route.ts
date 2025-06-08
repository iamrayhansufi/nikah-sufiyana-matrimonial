import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required"
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

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user[0].password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
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
