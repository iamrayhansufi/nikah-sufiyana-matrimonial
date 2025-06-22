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

export async function DELETE(request: NextRequest) {
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
    }    // Update photos array
    let photos: string[] = [];
    try {
      photos = user.photos ? JSON.parse(user.photos) : [];
    } catch (error) {
      console.error("Error parsing photos:", error);
      photos = [];
    }

    const updatedPhotos = photos.filter(p => p !== photoUrl);
    
    // Update both photos and profilePhotos fields, and handle profile photo
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };

    // If the deleted photo was the main profile photo, update it
    if (user.profilePhoto === photoUrl) {
      // Set the first remaining photo as the new profile photo, or empty if no photos left
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
    }
    
    // Update user in Redis
    await redis.hset(`user:${session.user.id}`, updateData);

    // If this was an image served from our API, also remove it from Redis
    if (photoUrl.startsWith('/api/images/')) {
      const filename = photoUrl.replace('/api/images/', '');
      console.log("Removing image data from Redis for filename:", filename);
      await redis.del(`image:${filename}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Photo deleted successfully",
      remainingPhotos: updatedPhotos.length 
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
