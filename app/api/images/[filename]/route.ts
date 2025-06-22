import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";

type Props = {
  params: Promise<{ filename: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { filename } = await params;
    
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }
      // Get image data from Redis
    const imageData = await redis.hgetall(`image:${filename}`);
    
    if (!imageData || !imageData.data || typeof imageData.data !== 'string') {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    // Convert base64 back to buffer
    const buffer = Buffer.from(imageData.data, 'base64');
    const contentType = (imageData.contentType && typeof imageData.contentType === 'string') 
      ? imageData.contentType 
      : 'image/jpeg';
    
    // Return the image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
