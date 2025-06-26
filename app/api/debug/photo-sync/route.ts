import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get all user data
    const userData = await redis.hgetall(`user:${userId}`);
    
    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract photo-related fields and parse them
    let parsedPhotos = null;
    let parsedProfilePhotos = null;
    
    try {
      if (userData.photos) {
        if (typeof userData.photos === 'string') {
          parsedPhotos = JSON.parse(userData.photos);
        } else if (Array.isArray(userData.photos)) {
          parsedPhotos = userData.photos;
        }
      }
    } catch (e) {
      console.error('Error parsing photos:', e);
    }
    
    try {
      if (userData.profilePhotos) {
        if (typeof userData.profilePhotos === 'string') {
          parsedProfilePhotos = JSON.parse(userData.profilePhotos);
        } else if (Array.isArray(userData.profilePhotos)) {
          parsedProfilePhotos = userData.profilePhotos;
        }
      }
    } catch (e) {
      console.error('Error parsing profilePhotos:', e);
    }

    const debugData = {
      userId: userId,
      timestamp: new Date().toISOString(),
      rawData: {
        photos: userData.photos,
        profilePhotos: userData.profilePhotos,
        profilePhoto: userData.profilePhoto,
      },
      parsedData: {
        photos: parsedPhotos,
        profilePhotos: parsedProfilePhotos,
        profilePhoto: userData.profilePhoto,
      },
      dataTypes: {
        photos: typeof userData.photos,
        profilePhotos: typeof userData.profilePhotos,
        profilePhoto: typeof userData.profilePhoto,
      },
      lengths: {
        photos: Array.isArray(parsedPhotos) ? parsedPhotos.length : 'N/A',
        profilePhotos: Array.isArray(parsedProfilePhotos) ? parsedProfilePhotos.length : 'N/A',
      },
      comparison: {
        photosMatchProfilePhotos: JSON.stringify(parsedPhotos) === JSON.stringify(parsedProfilePhotos),
        allFieldsPresent: !!(userData.photos && userData.profilePhotos && userData.profilePhoto)
      }
    };

    return NextResponse.json(debugData);

  } catch (error) {
    console.error("Debug sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to debug sync" },
      { status: 500 }
    );
  }
}
