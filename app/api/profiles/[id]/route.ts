import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { authOptions } from "@/lib/auth-options"

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      )
    }    const profile = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        age: users.age,
        location: users.location,
        education: users.education,
        profession: users.profession,
        sect: users.sect,
        maritalStatus: users.maritalStatus,
        profilePhoto: users.profilePhoto,
        aboutMe: users.aboutMe,
        expectations: users.expectations,
        familyDetails: users.familyDetails,
        religiousInclination: users.religiousInclination,
        preferredAgeMin: users.preferredAgeMin,
        preferredAgeMax: users.preferredAgeMax,
        preferredEducation: users.preferredEducation,
        preferredLocation: users.preferredLocation,
        profileStatus: users.profileStatus,
        subscription: users.subscription,
        lastActive: users.lastActive,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!profile || profile.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }    // Allow user to view their own profile regardless of status
    if (parseInt(session.user.id) === id) {
      return NextResponse.json(profile[0]);
    }
    // For others, only allow if profile is approved
    if (profile[0].profileStatus !== "approved") {
      return NextResponse.json(
        { error: "Profile not available" },
        { status: 403 }
      );
    }
    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      )
    }
    
    // Only allow users to update their own profile
    if (parseInt(session.user.id) !== id) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Update user profile in database
    const updatedProfile = await db
      .update(users)
      .set({
        // Basic Info
        fullName: body.fullName || undefined,
        age: body.age !== undefined ? parseInt(body.age) : undefined,
        gender: body.gender || undefined,
        location: body.location || undefined,
        education: body.education || undefined,
        profession: body.profession || undefined,
        maritalStatus: body.maritalStatus || undefined,
        sect: body.sect || undefined,
        aboutMe: body.aboutMe || undefined,
        
        // Religious info
        religiousInclination: body.religiousInclination || undefined,
        
        // Family info
        familyDetails: body.familyDetails || undefined,
        
        // Education & Career
        income: body.income || undefined,
        
        // Partner preferences
        preferredAgeMin: body.preferredAgeMin !== undefined ? parseInt(body.preferredAgeMin) : undefined,
        preferredAgeMax: body.preferredAgeMax !== undefined ? parseInt(body.preferredAgeMax) : undefined,
        preferredEducation: body.preferredEducation || undefined,
        preferredLocation: body.preferredLocation || undefined,
        expectations: body.expectations || undefined,
        
        // Update timestamp
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedProfile || updatedProfile.length === 0) {
      return NextResponse.json(
        { error: "Profile could not be updated" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedProfile[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}