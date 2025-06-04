import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      );
    }

    // Get logged-in user id
    const userId = await verifyAuth(request);

    // Debug logging for auth and id
    console.log({ userId, id, authHeader: request.headers.get("authorization") });

    const profile = await db
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
    }

    // Allow user to view their own profile regardless of status
    if (profile[0].profileStatus !== "approved" && Number(userId) !== Number(id)) {
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