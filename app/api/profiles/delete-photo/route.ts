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
    console.log("=== DELETE PHOTO API CALLED ===");
    console.log("🌐 Request headers:", Object.fromEntries(request.headers.entries()));
    console.log("🍪 Request cookies:", request.cookies.getAll());
    
    const session = await getServerSession(authOptions);
    console.log("🔐 Session check result:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.id) {
      console.log("❌ Unauthorized: No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔐 User authenticated:", session.user.id);

    const body = await request.json();
    console.log("📨 Request body:", body);
    
    const result = deletePhotoSchema.safeParse(body);
    if (!result.success) {
      console.log("❌ Invalid request data:", result.error);
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { photoUrl } = result.data;
    console.log("🖼️ Photo URL to delete:", photoUrl);

    // Get current user
    const userKey = `user:${session.user.id}`;
    console.log("🔍 Fetching user data from Redis key:", userKey);
    
    const user = await redis.hgetall(userKey) as RedisUser;
    if (!user) {
      console.log("❌ User not found in Redis");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }    console.log("👤 User found, processing photos...");
    console.log("📸 Current user.photos:", user.photos);
    console.log("📸 Current user.profilePhotos:", user.profilePhotos);
    console.log("📸 Current user.profilePhoto:", user.profilePhoto);

    // Update photos array
    let photos: string[] = [];
    
    // Handle both string (JSON) and object (parsed) formats from Redis
    if (user.photos) {
      if (typeof user.photos === 'string') {
        try {
          photos = JSON.parse(user.photos);
        } catch (error) {
          console.error("Error parsing photos JSON:", error);
          photos = [];
        }
      } else if (Array.isArray(user.photos)) {
        // Redis client already parsed it as an array
        photos = user.photos;
      } else {
        console.warn("Unexpected photos format:", typeof user.photos, user.photos);
        photos = [];
      }
    }
    
    console.log(`📸 Current photos before deletion:`, photos);
    console.log(`🗑️ Deleting photo:`, photoUrl);

    const updatedPhotos = photos.filter(p => p !== photoUrl);
    
    console.log(`📸 Updated photos after deletion:`, updatedPhotos);
    
    // Update both photos and profilePhotos fields, and handle profile photo
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };

    // If the deleted photo was the main profile photo, update it
    if (user.profilePhoto === photoUrl) {
      // Set the first remaining photo as the new profile photo, or empty if no photos left
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
      console.log("🚨 Updated main profile photo to:", updateData.profilePhoto);
    }
    
    console.log("💾 Update data to be saved:", updateData);
    
    // Update user in Redis
    console.log("🔄 Updating user data in Redis...");
    await redis.hset(userKey, updateData);    // Verify the update
    console.log("✅ Verifying update...");
    const verifyUser = await redis.hgetall(userKey);
    if (verifyUser) {
      console.log("📸 Verified photos:", verifyUser.photos);
      console.log("📸 Verified profilePhotos:", verifyUser.profilePhotos);
      console.log("📸 Verified profilePhoto:", verifyUser.profilePhoto);
    } else {
      console.log("❌ Failed to verify update - user not found");
    }

    // If this was an image served from our API, also remove it from Redis
    if (photoUrl.startsWith('/api/images/')) {
      const filename = photoUrl.replace('/api/images/', '');
      console.log("🗑️ Removing image data from Redis for filename:", filename);
      await redis.del(`image:${filename}`);
    }

    console.log("✅ Photo deletion completed successfully");
    return NextResponse.json({ 
      success: true, 
      message: "Photo deleted successfully",
      remainingPhotos: updatedPhotos.length,
      updatedPhotos: updatedPhotos
    });
  } catch (error) {
    console.error("❌ Error deleting photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
