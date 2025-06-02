import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  gender: z.enum(["male", "female"]),
  age: z.number().min(18),
  location: z.string(),
  education: z.string(),
  profession: z.string(),
  sect: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
      gender: userData.gender,
      age: userData.age,
      location: userData.location,
      education: userData.education,
      profession: userData.profession,
      sect: userData.sect,
      profileStatus: "pending",
      subscription: "free",
      lastActive: new Date(),
    }).returning();

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      profileStatus: newUser.profileStatus,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
