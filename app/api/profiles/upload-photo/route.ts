import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { uploadProfilePhoto } from "@/lib/cloudinary-service";

export async function POST(req: Request) {
  try {
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
      
      console.log("Cloudinary upload successful:", result.secure_url);
      
      // Get existing photos
      const existingPhotos = await redis.hget(`user:${userId}`, "photos");
      let photos = [];
      
      // Handle existing photos
      if (existingPhotos) {
        if (typeof existingPhotos === 'string') {
          try {
            photos = JSON.parse(existingPhotos);
          } catch (e) {
            console.warn('Error parsing existing photos:', e);
            photos = [];
          }
        } else if (Array.isArray(existingPhotos)) {
          photos = existingPhotos;
        }
      }
      
      // Add new photo URL
      photos.push(result.secure_url);
      
      // Update both photos array and profilePhoto field
      const updateData: { [key: string]: string } = {
        photos: JSON.stringify(photos),
        profilePhotos: JSON.stringify(photos) // Also update profilePhotos for frontend compatibility
      };
      
      // If this is the first photo, also set it as the main profile photo
      if (photos.length === 1) {
        updateData.profilePhoto = result.secure_url;
      }
      
      // Update user profile with the Cloudinary URL
      await redis.hset(`user:${userId}`, updateData);
      
      console.log("User profile updated with Cloudinary URL:", result.secure_url);
      
      return NextResponse.json({
        message: "Photo uploaded successfully",
        url: result.secure_url,
        cloudinary_public_id: result.public_id      });
      
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