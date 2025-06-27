import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { uploadProfilePhoto } from "@/lib/cloudinary-service";

export async function POST(req: Request) {
  try {
    console.log('🚀 Starting photo upload process...');
    
    // Get session first
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error('❌ No session found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`✅ Session verified for user: ${userId}`);
    
    // Test Redis connection before proceeding
    try {
      await redis.ping();
      console.log('✅ Redis connection verified');
    } catch (redisError) {
      console.error('❌ Redis connection failed:', redisError);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    const formData = await req.formData();
    console.log('📋 FormData keys:', [...formData.keys()]);
    
    const file = formData.get("photo") as File;

    if (!file) {
      console.error('❌ No file found in request');
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }
    
    console.log(`📁 File received: ${file.name}, Type: ${file.type}, Size: ${file.size}`);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json({ error: "File too large. Maximum file size is 5MB" }, { status: 400 });
    }

    // Get the file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      console.log("☁️ Uploading to Cloudinary...");
      
      // Upload to Cloudinary
      const result = await uploadProfilePhoto(buffer, userId.replace('user:', ''));
      
      console.log("✅ Cloudinary upload successful:", {
        secure_url: result.secure_url,
        public_id: result.public_id
      });
      
      // Extract the image ID from public_id for secure URL generation
      const imageId = result.public_id.replace('matrimonial-profiles/', '');
      const secureUrl = `/api/secure-image/${imageId}`;
      
      console.log(`🔗 Generated secure URL: ${secureUrl}`);
      
      // First, verify user exists in database
      const existingUser = await redis.hgetall(userId);
      if (!existingUser || Object.keys(existingUser).length === 0) {
        console.error(`❌ User ${userId} not found in database`);
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
      }
      
      console.log(`✅ User ${userId} verified in database`);
      
      // Get existing profilePhotos with robust error handling
      const existingProfilePhotosStr = await redis.hget(userId, "profilePhotos");
      let profilePhotos: string[] = [];
      if (existingProfilePhotosStr) {
        if (typeof existingProfilePhotosStr === 'string') {
          try {
            profilePhotos = JSON.parse(existingProfilePhotosStr);
          } catch {
            profilePhotos = [];
          }
        } else if (Array.isArray(existingProfilePhotosStr)) {
          profilePhotos = existingProfilePhotosStr;
        }
      }
      // Add the new photo
      const updatedProfilePhotos = [secureUrl, ...profilePhotos].slice(0, 5);
      // Update profilePhotos in Redis
      await redis.hset(userId, { 
        profilePhotos: JSON.stringify(updatedProfilePhotos),
        profilePhoto: secureUrl, // Always update main profile photo with latest upload
        image: secureUrl // Also update image field for compatibility
      });
      return NextResponse.json({
        success: true,
        url: secureUrl, // Add this for compatibility with edit profile
        urls: updatedProfilePhotos
      });
      
    } catch (cloudinaryError) {
      console.error("☁️ Cloudinary upload error:", cloudinaryError);
      return NextResponse.json(
        { error: cloudinaryError instanceof Error ? cloudinaryError.message : "Failed to upload photo to Cloudinary" },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("💥 Photo upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload photo" },
      { status: 500 }
    );
  }
}