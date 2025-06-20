import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
import { database } from "@/lib/database-service";

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get shortlisted user IDs
    const shortlistedIds = await database.shortlists.get(userId);
    const shortlistedProfiles = [];

    // Fetch each shortlisted user's profile
    for (const shortlistedId of shortlistedIds) {
      const userProfile = await database.users.getById(shortlistedId);

      if (userProfile) {
        shortlistedProfiles.push({
          id: `${userId}-${shortlistedId}`,
          userId: userId,
          shortlistedUser: {
            id: userProfile.id,
            fullName: userProfile.fullName,
            age: userProfile.age,
            location: userProfile.location,
            profession: userProfile.profession,
            education: userProfile.education,
            profilePhoto: userProfile.profilePhoto,
          },
          createdAt: userProfile.createdAt || new Date().toISOString(),
        });
      }
    }

    return NextResponse.json(shortlistedProfiles);
  } catch (error) {
    console.error("Get shortlist error:", error);
    return NextResponse.json(
      { error: "Failed to get shortlisted profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await request.json();
    const { shortlistedUserId } = body;

    if (!shortlistedUserId) {
      return NextResponse.json(
        { error: "shortlistedUserId is required" },
        { status: 400 }
      );
    }

    // Add 'user:' prefix if it doesn't exist
    let targetUserId = shortlistedUserId;
    if (!targetUserId.startsWith("user:")) {
      targetUserId = `user:${shortlistedUserId}`;
    }

    // Check if user exists
    const userExists = await database.users.getById(targetUserId);
    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already shortlisted
    const isAlreadyShortlisted = await database.shortlists.isShortlisted(
      userId,
      targetUserId
    );

    if (isAlreadyShortlisted) {
      // If already shortlisted, remove from shortlist
      await database.shortlists.remove(userId, targetUserId);

      return NextResponse.json({
        message: "Profile removed from shortlist",
        action: "removed",
      });
    }

    // Add to shortlist
    await database.shortlists.add(userId, targetUserId);

    // Create notification for the shortlisted user
    await database.notifications.create({
      userId: targetUserId,
      type: "shortlist",
      message: `${
        userExists ? userExists.fullName : "Someone"
      } has shortlisted your profile`,
      read: false,
      metadata: JSON.stringify({
        relatedUserId: userId,
        action: "shortlist",
      }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Profile added to shortlist",
      action: "added",
    });
  } catch (error) {
    console.error("Shortlist error:", error);
    return NextResponse.json(
      { error: "Failed to update shortlist" },
      { status: 500 }
    );
  }
}
