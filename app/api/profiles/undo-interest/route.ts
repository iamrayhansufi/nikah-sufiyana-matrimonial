import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";

const undoInterestSchema = z.object({
  receiverId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = undoInterestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { receiverId } = result.data;

    // Find relevant interest
    const interestKeys = await redis.keys("interest:*");
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key);
      if (interest &&
          interest.senderId === session.user.id &&
          interest.receiverId === receiverId &&
          interest.status === "pending") {
        // Delete the interest
        await redis.del(key);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Interest not found" }, { status: 404 });
  } catch (error) {
    console.error("Error undoing interest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
