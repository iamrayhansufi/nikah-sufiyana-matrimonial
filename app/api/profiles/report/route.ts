import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";
import { nanoid } from "nanoid";

const reportSchema = z.object({
  reportedUserId: z.string(),
  reason: z.string(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = reportSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { reportedUserId, reason, description } = result.data;

    // Check if reported user exists
    const reportedUser = await redis.hgetall(`user:${reportedUserId}`);
    if (!reportedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create report record
    const reportId = nanoid();
    const report = {
      id: reportId,
      reporterId: session.user.id,
      reportedUserId,
      reason,
      description: description || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await redis.hset(`report:${reportId}`, report);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reporting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}