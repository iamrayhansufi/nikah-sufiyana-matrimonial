import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { uploadGalleryPhoto } from "@/lib/cloudinary-service";

export async function POST(req: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
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
          { error: `Invalid file type: ${file.name}. Only image files are allowed.` },
          { status: 400 }
        );
      }

      // Check individual file size (limit to 5MB each)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum file size is 5MB.` },
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

    // Process each file by uploading to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Processing file ${i + 1}:`, file.name, "Type:", file.type, "Size:", file.size);

      try {
        // Get the file bytes
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        console.log(`Uploading file ${i + 1} to Cloudinary...`);
        
        // Upload to Cloudinary
        const result = await uploadGalleryPhoto(buffer, userId.replace('user:', ''), i);
        
        console.log(`Cloudinary upload ${i + 1} successful:`, result.secure_url);
        
        photoUrls.push(result.secure_url);
        
      } catch (uploadError) {
        console.error(`Error uploading file ${i + 1}:`, uploadError);
        // Continue with other files even if one fails
        continue;
      }
    }
    
    if (photoUrls.length === 0) {
      return NextResponse.json(
        { error: "Failed to upload any photos to Cloudinary" },
        { status: 500 }
      );
    }

    // Get current user data
    const currentUser = await redis.hgetall(`user:${userId}`);
    if (!currentUser || Object.keys(currentUser).length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get existing photos
    let existingPhotos: string[] = [];
    if (currentUser.photos) {
      try {
        const parsed = JSON.parse(currentUser.photos as string);
        if (Array.isArray(parsed)) {
          existingPhotos = parsed;
        }
      } catch (e) {
        console.warn('Error parsing existing photos:', e);
      }
    }

    // Combine existing and new photos, limit to 5 total
    const allPhotos = [...existingPhotos, ...photoUrls].slice(0, 5);

    // Update user with new photos
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(allPhotos),
      profilePhotos: JSON.stringify(allPhotos) // Also update profilePhotos for frontend compatibility
    };

    // If this is the first photo(s) and no profile photo exists, set the first as main
    if (!currentUser.profilePhoto && allPhotos.length > 0) {
      updateData.profilePhoto = allPhotos[0];
    }

    // Update user profile
    await redis.hset(`user:${userId}`, updateData);

    console.log(`Successfully uploaded ${photoUrls.length} photos for user:`, userId);
    
    return NextResponse.json({
      message: `Successfully uploaded ${photoUrls.length} photo(s)`,
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
