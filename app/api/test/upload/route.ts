import { NextResponse } from "next/server";
import { uploadProfilePhoto } from "@/lib/cloudinary-service";

export async function POST(req: Request) {
  try {
    console.log('🧪 Test upload endpoint hit');
    
    // Debug environment variables
    console.log('🔧 Upload API Environment Check:');
    console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
    
    const formData = await req.formData();
    const file = formData.get("photo") as File;

    if (!file) {
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

    // Get the file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Uploading to Cloudinary...");
    
    // Upload to Cloudinary
    const result = await uploadProfilePhoto(buffer, 'test-user-api');
    
    console.log("Cloudinary upload successful:", result.secure_url);
    
    return NextResponse.json({
      message: "Test upload successful",
      url: result.secure_url,
      cloudinary_public_id: result.public_id,
      size: { width: result.width, height: result.height },
      format: result.format
    });
    
  } catch (error) {
    console.error("Test upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
