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
      
      // Get existing photos with robust error handling
      const existingPhotosStr = await redis.hget(userId, "photos");
      const existingProfilePhotosStr = await redis.hget(userId, "profilePhotos");
      
      console.log('📷 Existing photos field:', existingPhotosStr);
      console.log('📷 Existing profilePhotos field:', existingProfilePhotosStr);
      
      let photos: string[] = [];      const parsePhotoData = (photoData: unknown): string[] => {
        if (!photoData) return [];
        
        // Handle array (when Redis client auto-parses)
        if (Array.isArray(photoData)) {
          return photoData.filter((p): p is string => typeof p === 'string');
        }
        
        // Handle string (JSON or single URL)
        if (typeof photoData === 'string') {
          const trimmed = photoData.trim();
          if (!trimmed) return [];
          
          // If it's a single photo string (not a JSON array), wrap it in an array
          if (trimmed[0] !== '[') {
            // Check if it's a valid URL string
            if (trimmed.startsWith('/api/secure-image/') || trimmed.startsWith('http')) {
              return [trimmed];
            }
            return [];
          }
          
          try {
            const parsed = JSON.parse(photoData);
            if (Array.isArray(parsed)) {
              return parsed.filter((p): p is string => typeof p === 'string');
            }
          } catch (e) {
            console.warn("Could not parse photo data:", e);
          }
        }
        
        return [];
      };

      const fromPhotos = parsePhotoData(existingPhotosStr);
      const fromProfilePhotos = parsePhotoData(existingProfilePhotosStr);

      // Merge and deduplicate to ensure data integrity
      const combined = [...new Set([...fromPhotos, ...fromProfilePhotos])];
      photos = combined;
      
      // Add new photo URL if it's not already in the list
      if (!photos.includes(secureUrl)) {
        photos.push(secureUrl);
      }
      
      console.log(`📸 Final photos array (${photos.length} items):`, photos);
      
      // Prepare update data
      const updateData: { [key: string]: string } = {
        photos: JSON.stringify(photos),
        profilePhotos: JSON.stringify(photos) // Also update profilePhotos for frontend compatibility
      };
      
      // If this is the first photo, also set it as the main profile photo
      if (photos.length === 1 || !existingUser.profilePhoto) {
        updateData.profilePhoto = secureUrl;
        console.log('🎯 Setting as main profile photo');
      }
      
      // Store the Cloudinary public_id for future management (deletion, etc.)
      const cloudinaryIds = await redis.hget(userId, "cloudinary_ids");
      let ids = [];
      if (cloudinaryIds && typeof cloudinaryIds === 'string') {
        try {
          ids = JSON.parse(cloudinaryIds);
        } catch (e) {
          ids = [];
        }
      }
      ids.push({
        public_id: result.public_id,
        secure_url: secureUrl,
        type: 'profile',
        uploaded_at: new Date().toISOString()
      });
      updateData.cloudinary_ids = JSON.stringify(ids);
      
      console.log('💾 Preparing database update with data:', Object.keys(updateData));
      
      // Update user profile with the secure URL - WITH ERROR HANDLING
      try {
        const redisResult = await redis.hset(userId, updateData);
        console.log('✅ Redis hset result:', redisResult);
        
        // Verify the update was successful
        const verificationPhotos = await redis.hget(userId, "photos");
        const verificationProfilePhoto = await redis.hget(userId, "profilePhoto");
        
        console.log('🔍 Verification - photos field after update:', verificationPhotos);
        console.log('🔍 Verification - profilePhoto field after update:', verificationProfilePhoto);
        
        if (!verificationPhotos) {
          console.error('❌ Database update failed - photos field is still empty');
          return NextResponse.json({ error: "Failed to save photo to database" }, { status: 500 });
        }
        
        console.log("✅ User profile updated successfully with secure URL");
        
      } catch (redisUpdateError) {
        console.error('❌ Redis update failed:', redisUpdateError);
        return NextResponse.json({ error: "Failed to save photo to database" }, { status: 500 });
      }
      
      return NextResponse.json({
        message: "Photo uploaded successfully",
        url: secureUrl,
        cloudinary_public_id: result.public_id,
        is_private: true,
        debug: {
          userId: userId,
          totalPhotos: photos.length,
          isMainPhoto: photos.length === 1 || !existingUser.profilePhoto
        }
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