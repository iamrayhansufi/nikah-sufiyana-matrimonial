import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";

export async function POST(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No photo provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${userId}-${timestamp}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Update user profile with photo URL
    const photoUrl = `/uploads/profiles/${filename}`;
    await db
      .update(users)
      .set({ profilePhoto: photoUrl })
      .where(eq(users.id, userId));

    return NextResponse.json({
      message: "Photo uploaded successfully",
      url: photoUrl, // Changed to match what frontend expects
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}