import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(req: Request) {
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

    console.log("Processing photo deletion for user ID:", userId);
    
    const { photoUrl } = await req.json();

    if (!photoUrl) {
      console.error("No photo URL provided");
      return NextResponse.json(
        { error: "Photo URL is required" },
        { status: 400 }
      );
    }
    
    console.log("Photo URL to delete:", photoUrl);

    // Get current user data
    const currentUser = await db
      .select({ profilePhotos: users.profilePhotos })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let existingPhotos: string[] = [];
    
    if (currentUser[0].profilePhotos) {
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

    // Remove the photo URL from the array
    const updatedPhotos = existingPhotos.filter(photo => photo !== photoUrl);
    
    if (updatedPhotos.length === existingPhotos.length) {
      return NextResponse.json(
        { error: "Photo not found in user's profile" },
        { status: 404 }
      );
    }

    // Update user profile with the new photos array
    await db
      .update(users)
      .set({ 
        profilePhotos: JSON.stringify(updatedPhotos),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Try to delete the physical file (only if it's a local file, not a data URL)
    if (photoUrl.startsWith('/uploads/') && !process.env.VERCEL_ENV) {
      try {
        const filePath = join(process.cwd(), "public", photoUrl);
        await unlink(filePath);
        console.log("Physical file deleted:", filePath);
      } catch (fileError) {
        console.warn("Could not delete physical file (file may not exist):", fileError);
        // Don't fail the request if file deletion fails
      }
    }

    console.log("Photo deleted successfully. Remaining photos:", updatedPhotos.length);
    
    return NextResponse.json({
      message: "Photo deleted successfully",
      remainingPhotos: updatedPhotos.length
    });

  } catch (error) {
    console.error("Photo deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete photo" },
      { status: 500 }
    );
  }
}
