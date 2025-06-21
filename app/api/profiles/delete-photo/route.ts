import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";

const deletePhotoSchema = z.object({
  photoUrl: z.string(),
});

interface RedisUser {
  [key: string]: string;
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = deletePhotoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { photoUrl } = result.data;

    // Get current user
    const user = await redis.hgetall(`user:${session.user.id}`) as RedisUser;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update photos array
    let photos: string[] = [];
    try {
      photos = user.photos ? JSON.parse(user.photos) : [];
    } catch (error) {
      console.error("Error parsing photos:", error);
      photos = [];
    }

    const updatedPhotos = photos.filter(p => p !== photoUrl);
    
    // Update user in Redis
    await redis.hset(`user:${session.user.id}`, {
      ...user,
      photos: JSON.stringify(updatedPhotos)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
