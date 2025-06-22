import { NextResponse } from "next/server";
import { writeFile, mkdir, access, constants } from "fs/promises";
import { join } from "path";
import path from "path";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";

// Helper function to check if running in Vercel production environment
function isVercelProduction() {
  return process.env.VERCEL_ENV === 'production';
}

interface RedisUser {
  [key: string]: string;
  id: string;
  photos: string;
}

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
      // Check if running on Vercel production (where filesystem writes won't work)
    if (isVercelProduction()) {
      console.log("Running on Vercel production - using Redis storage instead of filesystem");
      
      // Create unique filename - make it URL-safe by removing spaces and special characters
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${userId.replace('user:', '')}-${timestamp}-${sanitizedFileName}`;
      
      // Create a URL that points to our image serving endpoint
      const imageUrl = `/api/images/${filename}`;
      
      // Get existing photos
      const existingPhotos = await redis.hget(`user:${userId}`, "photos");
      let photos = [];
      
      // Handle existing photos - might be string or array due to Redis auto-deserialization
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
      
      // Add new photo
      photos.push(imageUrl);
      
      // Update both photos array and profilePhoto field (for main profile photo)
      const updateData: { [key: string]: string } = {
        photos: JSON.stringify(photos),
        profilePhotos: JSON.stringify(photos) // Also update profilePhotos for frontend compatibility
      };
      
      // If this is the first photo, also set it as the main profile photo
      if (photos.length === 1) {
        updateData.profilePhoto = imageUrl;
      }
      
      // Update user profile with the image URL
      await redis.hset(`user:${userId}`, updateData);
      
      // Store the actual file data in Redis for serving later
      await redis.hset(`image:${filename}`, {
        data: buffer.toString('base64'),
        contentType: file.type,
        uploadedAt: new Date().toISOString(),
        userId: userId
      });
        
      console.log("User profile updated with image URL:", imageUrl);
      
      return NextResponse.json({
        message: "Photo uploaded successfully",
        url: imageUrl,
      });
    }
    
    // For local development, continue using the filesystem
    try {
      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
      
      try {
        // Check if directory exists
        await access(uploadDir, constants.F_OK);
        console.log("Upload directory exists");
      } catch {
        // Create if it doesn't
        console.log("Creating upload directory");
        await mkdir(uploadDir, { recursive: true });
      }

      // Save file
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      console.log("File written successfully to:", filepath);      // Update user profile with photo URL
      const photoUrl = `/uploads/profiles/${filename}`;
      // Get existing photos
      const existingPhotos = await redis.hget(`user:${userId}`, "photos");
      let photos = [];
      
      // Handle existing photos - might be string or array due to Redis auto-deserialization
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
      
      // Add new photo
      photos.push(photoUrl);
        // Update both photos array and profilePhoto field (for main profile photo)
      const updateData: { [key: string]: string } = {
        photos: JSON.stringify(photos),
        profilePhotos: JSON.stringify(photos) // Also update profilePhotos for frontend compatibility
      };
      
      // If this is the first photo, also set it as the main profile photo
      if (photos.length === 1) {
        updateData.profilePhoto = photoUrl;
      }
      
      // Update user profile with photo URL
      await redis.hset(`user:${userId}`, updateData);

      console.log("User profile updated with photo URL:", photoUrl);
      
      return NextResponse.json({
        message: "Photo uploaded successfully",
        url: photoUrl,
      });
    } catch (fsError) {
      console.error("File system error:", fsError);
      return NextResponse.json(
        { error: "Failed to save uploaded file" },
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