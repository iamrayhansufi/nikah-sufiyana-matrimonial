import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options-redis';
import { redis } from '@/lib/redis-client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
      // Get raw user data from Redis
    const userData = await redis.hgetall(`user:${userId}`);
    
    // Check if user data exists
    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({
        error: 'User not found',
        userId
      }, { status: 404 });
    }
    
    console.log('=== DEBUG: Raw user data from Redis ===');
    console.log('Photos field:', userData.photos);
    console.log('ProfilePhotos field:', userData.profilePhotos);
    console.log('ProfilePhoto field:', userData.profilePhoto);
    console.log('Cloudinary IDs:', userData.cloudinary_ids);
    
    // Parse the fields if they're JSON strings
    let parsedPhotos = null;
    let parsedProfilePhotos = null;
    let parsedCloudinaryIds = null;
    
    if (userData.photos && typeof userData.photos === 'string') {
      try {
        parsedPhotos = JSON.parse(userData.photos);
      } catch (e) {
        console.error('Error parsing photos field:', e);
      }
    }
    
    if (userData.profilePhotos && typeof userData.profilePhotos === 'string') {
      try {
        parsedProfilePhotos = JSON.parse(userData.profilePhotos);
      } catch (e) {
        console.error('Error parsing profilePhotos field:', e);
      }
    }
    
    if (userData.cloudinary_ids && typeof userData.cloudinary_ids === 'string') {
      try {
        parsedCloudinaryIds = JSON.parse(userData.cloudinary_ids);
      } catch (e) {
        console.error('Error parsing cloudinary_ids field:', e);
      }
    }
    
    return NextResponse.json({
      userId,
      raw: {
        photos: userData.photos,
        profilePhotos: userData.profilePhotos,
        profilePhoto: userData.profilePhoto,
        cloudinary_ids: userData.cloudinary_ids
      },
      parsed: {
        photos: parsedPhotos,
        profilePhotos: parsedProfilePhotos,
        profilePhoto: userData.profilePhoto,
        cloudinary_ids: parsedCloudinaryIds
      },
      fieldCount: Object.keys(userData).length
    });
  } catch (error) {
    console.error('Debug photos error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to debug photos' },
      { status: 500 }
    );
  }
}
