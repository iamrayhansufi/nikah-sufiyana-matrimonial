import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";

export async function GET() {
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
    }    // Extract photo-related fields
    const photoData = {
      userId: userId,
      profilePhoto: userData.profilePhoto || 'Not set',
      photos: userData.photos || 'Not set',
      profilePhotos: userData.profilePhotos || 'Not set',
      image: userData.image || 'Not set',
      // Show first 100 chars of each to avoid huge response
      profilePhotoPreview: userData.profilePhoto && typeof userData.profilePhoto === 'string' ? 
        (userData.profilePhoto.length > 100 ? 
          userData.profilePhoto.substring(0, 100) + '...' : 
          userData.profilePhoto) : 'Not set',
      
      // Parse and show photo arrays
      photosArray: (() => {
        if (!userData.photos) return [];
        try {
          const photosData = typeof userData.photos === 'string' ? userData.photos : JSON.stringify(userData.photos);
          const parsed = JSON.parse(photosData);
          return Array.isArray(parsed) ? parsed.map(url => 
            typeof url === 'string' && url.length > 100 ? url.substring(0, 100) + '...' : url
          ) : [];
        } catch (e) {
          const photosStr = typeof userData.photos === 'string' ? userData.photos : JSON.stringify(userData.photos);
          return ['Parse error: ' + photosStr.substring(0, 50) + '...'];
        }
      })(),
      
      profilePhotosArray: (() => {
        if (!userData.profilePhotos) return [];
        try {
          const profilePhotosData = typeof userData.profilePhotos === 'string' ? userData.profilePhotos : JSON.stringify(userData.profilePhotos);
          const parsed = JSON.parse(profilePhotosData);
          return Array.isArray(parsed) ? parsed.map(url => 
            typeof url === 'string' && url.length > 100 ? url.substring(0, 100) + '...' : url
          ) : [];
        } catch (e) {
          const profilePhotosStr = typeof userData.profilePhotos === 'string' ? userData.profilePhotos : JSON.stringify(userData.profilePhotos);
          return ['Parse error: ' + profilePhotosStr.substring(0, 50) + '...'];
        }
      })(),
      
      allFields: Object.keys(userData).length,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(photoData);

  } catch (error) {
    console.error("Debug photos error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to debug photos" },
      { status: 500 }
    );
  }
}
