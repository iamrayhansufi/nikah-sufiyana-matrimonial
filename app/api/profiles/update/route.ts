import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { authOptions } from "@/lib/auth-options";
import { z } from "zod";

const updateProfileSchema = z.object({
  // Basic Info
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  age: z.number().min(18).optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  complexion: z.string().optional(),
  maritalStatus: z.string().optional(),
  languages: z.array(z.string()).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  
  // Religious Info
  sect: z.string().optional(),
  prayerHabit: z.string().optional(),
  hijab: z.string().optional(),
  quranReading: z.string().optional(),
  islamicEducation: z.string().optional(),
  religiousValues: z.string().optional(),
  attendsMosque: z.string().optional(),
  
  // Education & Career
  education: z.string().optional(),
  university: z.string().optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  experience: z.string().optional(),
  income: z.string().optional(),
  
  // Family Info
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyType: z.string().optional(),
  familyValues: z.string().optional(),
  livingWithParents: z.string().optional(),
  
  // Partner Preferences
  preferredAgeMin: z.number().min(18).optional(),
  preferredAgeMax: z.number().max(100).optional(),
  preferredHeight: z.string().optional(),
  preferredEducation: z.string().optional(),
  preferredProfession: z.string().optional(),
  preferredLocation: z.string().optional(),
  preferredSect: z.string().optional(),
  preferredReligiosity: z.string().optional(),
  expectations: z.string().optional(),
  
  // Privacy Settings
  showContactInfo: z.boolean().optional(),
  showPhotoToAll: z.boolean().optional(),
  profileVisibility: z.enum(["all-members", "premium-only", "match-criteria"]).optional(),
  allowMessages: z.boolean().optional(),
  
  // Other fields
  profilePhoto: z.string().optional(),
  gallery: z.array(z.string()).optional(),
});

export async function PUT(req: Request) {
  try {    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    const userId = parseInt(session.user.id);

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
        email: updatedUser.email,
        phone: updatedUser.phone,
        age: updatedUser.age,
        city: updatedUser.city,
        country: updatedUser.country,
        location: updatedUser.location,
        education: updatedUser.education,
        profession: updatedUser.profession,
        sect: updatedUser.sect,
        maritalStatus: updatedUser.maritalStatus,
        religiousInclination: updatedUser.religiousInclination,
        expectations: updatedUser.expectations,
        aboutMe: updatedUser.aboutMe,
        familyDetails: updatedUser.familyDetails,
        preferredAgeMin: updatedUser.preferredAgeMin,
        preferredAgeMax: updatedUser.preferredAgeMax,
        preferredEducation: updatedUser.preferredEducation,
        preferredLocation: updatedUser.preferredLocation,
        motherTongue: updatedUser.motherTongue,
        height: updatedUser.height,
        complexion: updatedUser.complexion,
        profilePhoto: updatedUser.profilePhoto,
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