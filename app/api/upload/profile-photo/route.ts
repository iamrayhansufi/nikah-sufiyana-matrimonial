import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getAuthSession } from "@/lib/auth"
import { redis } from "@/lib/redis-client"

interface RedisUser {
  [key: string]: string;
}

function parsePhotos(photosStr: string | undefined): string[] {
  if (!photosStr) return [];
  try {
    const photos = JSON.parse(photosStr);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data once to get all required data
    const formData = await request.formData();
    const file = formData.get("photo") as File;
    const userIdFromForm = formData.get("userId");
    
    let userId: string;
    
    if (userIdFromForm) {
      // Registration flow - use provided userId
      userId = userIdFromForm.toString();
    } else {
      // Normal authenticated flow
      const session = await getAuthSession();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.type.split("/")[1];
    const filename = `${userId}-${Date.now()}.${ext}`;
    const filePath = join(uploadDir, filename);

    // Save file to disk
    await writeFile(filePath, buffer);

    // Build public URL
    const publicUrl = `/uploads/profiles/${filename}`;

    // Update user profile in Redis
    const userKey = `user:${userId}`;
    const user = (await redis.hgetall(userKey)) as RedisUser;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update photos array
    const photos = parsePhotos(user.photos);
    photos.push(publicUrl);

    // Update main photo if none exists
    if (!user.mainPhotoUrl) {
      await redis.hmset(userKey, {
        mainPhotoUrl: publicUrl,
        photos: JSON.stringify(photos)
      });
    } else {
      await redis.hmset(userKey, {
        photos: JSON.stringify(photos)
      });
    }

    return NextResponse.json({
      message: "Photo uploaded successfully",
      url: publicUrl
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
