import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { writeFile, mkdir, access, constants } from "fs/promises";
import { join } from "path";
import path from "path";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import fs from 'fs';

// Helper function to check if running in Vercel production environment
function isVercelProduction() {
  return process.env.VERCEL_ENV === 'production';
}

export async function POST(req: Request) {
  try {
    // Try both direct session check and verifyAuth for better compatibility
    let userId: number | null = null;
    
    try {
      // First try verifyAuth method
      userId = await verifyAuth(req);
    } catch (authError) {
      console.log("VerifyAuth failed, trying direct session access:", authError);
    }
    
    // If verifyAuth failed, try getting the session directly
    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id ? parseInt(session.user.id) : null;
    }
    
    // Check if we have a userId through either method
    if (!userId) {
      console.error("No user ID found in session");
      return NextResponse.json(
        { error: "Unauthorized - Please login again" },
        { status: 401 }
      );
    }

    console.log("Processing multiple photos upload for user ID:", userId);
    
    const formData = await req.formData();
    
    // Explicitly check for the formData content
    console.log("FormData keys:", [...formData.keys()]);
    
    const files = formData.getAll("photos") as File[];

    if (!files || files.length === 0) {
      console.error("No files found in request");
      return NextResponse.json(
        { error: "No photos provided" },
        { status: 400 }
      );
    }
    
    console.log("Files received:", files.length, "files");

    // Validate all files
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only images are allowed.` },
          { status: 400 }
        );
      }

      // Check file size (limit to 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum file size is 5MB per image.` },
          { status: 400 }
        );
      }
    }

    // Check total size (limit to 15MB total)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 15 * 1024 * 1024; // 15MB
    if (totalSize > maxTotalSize) {
      return NextResponse.json(
        { error: "Total file size too large. Maximum total size is 15MB." },
        { status: 400 }
      );
    }

    const photoUrls: string[] = [];

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Processing file ${i + 1}:`, file.name, "Type:", file.type, "Size:", file.size);

      // Create unique filename - make it URL-safe by removing spaces and special characters
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${userId}-${timestamp}-${i}-${sanitizedFileName}`;
      
      // Get the file bytes
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Check if running on Vercel production (where filesystem writes won't work)
      if (isVercelProduction()) {
        console.log("Running on Vercel production - using database storage instead of filesystem");
        
        // In production, store the image directly in the database as a data URL
        // This is a temporary solution until you implement proper cloud storage
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        photoUrls.push(dataUrl);
      } else {
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
          console.log("File written successfully to:", filepath);

          // Create photo URL
          const photoUrl = `/uploads/profiles/${filename}`;
          photoUrls.push(photoUrl);
        } catch (fsError) {
          console.error("File system error:", fsError);
          return NextResponse.json(
            { error: "Failed to save uploaded files" },
            { status: 500 }
          );
        }
      }
    }

    // Get current user data to preserve existing photos
    const currentUser = await db
      .select({ profilePhotos: users.profilePhotos })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    let existingPhotos: string[] = [];
    
    if (currentUser.length > 0 && currentUser[0].profilePhotos) {
      try {
        const photosData = currentUser[0].profilePhotos;
        if (typeof photosData === 'string') {
          existingPhotos = JSON.parse(photosData);
        } else if (Array.isArray(photosData)) {
          existingPhotos = photosData;
        }
      } catch (e) {
        console.warn("Error parsing existing photos:", e);
        existingPhotos = [];
      }
    }

    // Combine existing photos with new ones (limit to 5 total)
    const allPhotos = [...existingPhotos, ...photoUrls].slice(0, 5);

    // Update user profile with the new photos array
    await db
      .update(users)
      .set({ 
        profilePhotos: JSON.stringify(allPhotos),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log("User profile updated with new photos. Total photos:", allPhotos.length);
    
    return NextResponse.json({
      message: "Photos uploaded successfully",
      urls: photoUrls,
      totalPhotos: allPhotos.length
    });

  } catch (error) {
    console.error("Multiple photos upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload photos" },
      { status: 500 }
    );
  }
}
