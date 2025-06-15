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
      console.log("Running on Vercel production - using database storage instead of filesystem");
      
      // In production, store the image directly in the database as a data URL
      // This is a temporary solution until you implement proper cloud storage
      const base64Image = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64Image}`;
      
      // Update user profile with the data URL directly
      await db
        .update(users)
        .set({ 
          profilePhoto: dataUrl,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
        
      console.log("User profile updated with data URL image");
      
      return NextResponse.json({
        message: "Photo uploaded successfully",
        url: dataUrl,
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
      console.log("File written successfully to:", filepath);

      // Update user profile with photo URL
      const photoUrl = `/uploads/profiles/${filename}`;
      await db
        .update(users)
        .set({ 
          profilePhoto: photoUrl,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

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