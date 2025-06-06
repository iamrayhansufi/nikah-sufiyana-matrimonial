import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { interests, users } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyAuth } from "@/src/lib/auth";
import { z } from "zod";

const interestSchema = z.object({
  toUserId: z.number(),
  message: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "received"; // "received" | "sent"

    const interestsQuery = db
      .select({
        id: interests.id,
        fromUserId: interests.fromUserId,
        toUserId: interests.toUserId,
        status: interests.status,
        createdAt: interests.createdAt,
        fromUser: {
          id: users.id,
          fullName: users.fullName,
          age: users.age,
          location: users.location,
          profession: users.profession,
          profilePhoto: users.profilePhoto,
        },
      })
      .from(interests)
      .leftJoin(users, type === "received" 
        ? eq(users.id, interests.fromUserId)
        : eq(users.id, interests.toUserId)
      )
      .where(
        type === "received"
          ? eq(interests.toUserId, userId)
          : eq(interests.fromUserId, userId)
      )
      .orderBy(interests.createdAt);

    const results = await interestsQuery;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Get interests error:", error);
    return NextResponse.json(
      { error: "Failed to get interests" },
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
    const { toUserId, message } = interestSchema.parse(body);

    // Check if interest already exists
    const existingInterest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.fromUserId, userId),
          eq(interests.toUserId, toUserId)
        )
      )
      .limit(1);

    if (existingInterest.length > 0) {
      return NextResponse.json(
        { error: "Interest already sent" },
        { status: 400 }
      );
    }

    // Create new interest
    const [interest] = await db
      .insert(interests)
      .values({
        fromUserId: userId,
        toUserId,
        message,
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      message: "Interest sent successfully",
      interest,
    });
  } catch (error) {
    console.error("Send interest error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send interest" },
      { status: 500 }
    );
  }
}
