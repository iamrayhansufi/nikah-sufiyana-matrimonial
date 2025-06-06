import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { shortlist, users } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyAuth } from "@/src/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shortlistedProfiles = await db
      .select({
        id: shortlist.id,
        userId: shortlist.userId,
        shortlistedUser: {
          id: users.id,
          fullName: users.fullName,
          age: users.age,
          location: users.location,
          profession: users.profession,
          education: users.education,
          profilePhoto: users.profilePhoto,
        },
        createdAt: shortlist.createdAt,
      })
      .from(shortlist)
      .leftJoin(users, eq(users.id, shortlist.shortlistedUserId))
      .where(eq(shortlist.userId, userId))
      .orderBy(shortlist.createdAt);

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
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shortlistedUserId } = body;

    if (!shortlistedUserId) {
      return NextResponse.json(
        { error: "shortlistedUserId is required" },
        { status: 400 }
      );
    }

    // Check if already shortlisted
    const existing = await db
      .select()
      .from(shortlist)
      .where(
        and(
          eq(shortlist.userId, userId),
          eq(shortlist.shortlistedUserId, shortlistedUserId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // If already shortlisted, remove from shortlist
      await db
        .delete(shortlist)
        .where(
          and(
            eq(shortlist.userId, userId),
            eq(shortlist.shortlistedUserId, shortlistedUserId)
          )
        );

      return NextResponse.json({
        message: "Profile removed from shortlist",
        action: "removed",
      });
    }

    // Add to shortlist
    const [newShortlist] = await db
      .insert(shortlist)
      .values({
        userId,
        shortlistedUserId,
      })
      .returning();

    return NextResponse.json({
      message: "Profile added to shortlist",
      action: "added",
      shortlist: newShortlist,
    });
  } catch (error) {
    console.error("Shortlist error:", error);
    return NextResponse.json(
      { error: "Failed to update shortlist" },
      { status: 500 }
    );
  }
}
