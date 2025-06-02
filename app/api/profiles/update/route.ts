import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { z } from "zod";
import { verifyAuth } from "../../../../src/lib/auth";

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  age: z.number().min(18).optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  sect: z.string().optional(),
  maritalStatus: z.string().optional(),
  religiousInclination: z.string().optional(),
  expectations: z.string().optional(),
  aboutMe: z.string().optional(),
  familyDetails: z.string().optional(),
  preferredAgeMin: z.number().min(18).optional(),
  preferredAgeMax: z.number().max(100).optional(),
  preferredEducation: z.string().optional(),
  preferredLocation: z.string().optional(),
});

export async function PUT(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const updates = updateProfileSchema.parse(body);

    // Get current user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser || existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update profile
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        age: updatedUser.age,
        location: updatedUser.location,
        education: updatedUser.education,
        profession: updatedUser.profession,
        sect: updatedUser.sect,
        maritalStatus: updatedUser.maritalStatus,
        profileStatus: updatedUser.profileStatus,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
} 