import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { uploadProfilePhoto } from "@/lib/cloudinary-service";

export async function POST(req: Request) {  try {
    // Debug environment variables with fallbacks
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'nikahsufiyana';
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || '223722368374864';
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET || 'z075NYAKlJfEt2WESzLaQtC1oyk';
    
    console.log('🔧 Upload API Environment Check:');
    console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("Processing upload for user ID:", userId);
    
    const formData = await req.formData();
    
    // Explicitly check for the formData content
    console.log("FormData keys:", [...formData.keys()]);
    
    const file = formData.get("photo") as File;

    if (!file) {
      console.error("No file found in request");
      return NextResponse.json(
        { error: "No photo provided" },
        { status: 400 }
      );
    }
    
    console.log("File received:", file.name, "Type:", file.type, "Size:", file.size);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum file size is 5MB" },
        { status: 400 }
      );
    }

    // Create unique filename - make it URL-safe by removing spaces and special characters
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${userId}-${timestamp}-${sanitizedFileName}`;
      // Get the file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      console.log("Uploading to Cloudinary...");
        // Upload to Cloudinary
      const result = await uploadProfilePhoto(buffer, userId.replace('user:', ''));
      
      console.log("Cloudinary private upload successful:", result.secure_url);
      console.log("Public ID:", result.public_id);
      
      // Extract the image ID from public_id for secure URL generation
      const imageId = result.public_id.replace('matrimonial-profiles/', '');
      const secureUrl = `/api/secure-image/${imageId}`;
      
      console.log("Generated secure URL:", secureUrl);
      
      // Get existing photos from both `photos` and `profilePhotos` fields for robustness
      const existingPhotosStr = await redis.hget(`user:${userId}`, "photos");
      const existingProfilePhotosStr = await redis.hget(`user:${userId}`, "profilePhotos");
      let photos: string[] = [];

      const parsePhotoData = (photoData: unknown): string[] => {
        if (typeof photoData !== 'string') return [];
        try {
          const parsed = JSON.parse(photoData);
          if (Array.isArray(parsed)) {
            return parsed.filter((p): p is string => typeof p === 'string');
          }
        } catch (e) {
          console.warn("Could not parse photo data:", e);
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
      
      // Update both photos array and profilePhoto field
      const updateData: { [key: string]: string } = {
        photos: JSON.stringify(photos),
        profilePhotos: JSON.stringify(photos) // Also update profilePhotos for frontend compatibility
      };
      
      // If this is the first photo, also set it as the main profile photo
      if (photos.length === 1) {
        updateData.profilePhoto = secureUrl;
      }
        // Store the Cloudinary public_id for future management (deletion, etc.)
      const cloudinaryIds = await redis.hget(`user:${userId}`, "cloudinary_ids");
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
      
      // Update user profile with the secure URL
      await redis.hset(`user:${userId}`, updateData);
      
      console.log("User profile updated with secure URL:", secureUrl);
      
      return NextResponse.json({
        message: "Photo uploaded successfully",
        url: secureUrl, // Return secure URL instead of direct Cloudinary URL
        cloudinary_public_id: result.public_id,
        is_private: true // Indicate that this is a private image
      });
      
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to upload photo to Cloudinary" },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload photo" },
      { status: 500 }
    );
  }
}