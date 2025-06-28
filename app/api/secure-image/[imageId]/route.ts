import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options-redis';
import { v2 as cloudinary } from 'cloudinary';
import { generateSignedUrl, canAccessUserPhotos } from '@/lib/cloudinary-service';

// Ensure environment variables are loaded with fallback to env object
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'nikahsufiyana';
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || '223722368374864';
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET || 'z075NYAKlJfEt2WESzLaQtC1oyk';

// Make sure Cloudinary is configured in this context as well
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    console.log('🔐 Secure image request for:', imageId);
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('❌ Unauthorized access attempt');
      return new NextResponse('Unauthorized - Please log in to view images', { 
        status: 401,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    const viewerUserId = session.user.id;
    console.log('👤 Viewer:', viewerUserId);    // Parse image ID to extract owner and type
    // Format: "profile-userId-timestamp" or "gallery-userId-index-timestamp"
    const imageIdParts = imageId.split('-');
    console.log('🔍 Image ID parts:', imageIdParts);
    
    if (imageIdParts.length < 3) {
      console.log('❌ Invalid image ID format - too few parts');
      return new NextResponse('Invalid image ID format', { status: 400 });
    }

    const photoType = imageIdParts[0] as 'profile' | 'gallery';
    
    // For profile: "profile-userId-timestamp" -> userId is at index 1
    // For gallery: "gallery-userId-index-timestamp" -> userId is at index 1 (need to handle userId with dashes)
    let photoOwnerUserId: string;
    
    if (photoType === 'profile') {
      // Profile format: profile-1750494368940-v1zhv1x2fb-1750660062020
      // Extract everything between first dash and last dash
      const firstDashIndex = imageId.indexOf('-');
      const lastDashIndex = imageId.lastIndexOf('-');
      photoOwnerUserId = imageId.substring(firstDashIndex + 1, lastDashIndex);
    } else {
      // Gallery format: gallery-1750494368940-v1zhv1x2fb-0-1750659725260
      // Extract everything between first dash and second-to-last dash (excluding index and timestamp)
      const parts = imageId.split('-');
      const indexPos = parts.length - 2; // Index is second to last
      photoOwnerUserId = parts.slice(1, indexPos).join('-');
    }
    
    console.log(`🎯 Photo type: ${photoType}, Owner: ${photoOwnerUserId}`);

    // Check access permissions
    console.log('🔐 Checking access permissions...');
    const hasAccess = await canAccessUserPhotos(viewerUserId, photoOwnerUserId, photoType);
    console.log(`🔐 Access result: ${hasAccess}`);
    
    if (!hasAccess) {
      console.log('🚫 Access denied for user:', viewerUserId, 'trying to access photos of:', photoOwnerUserId);
      return new NextResponse('Access denied - You do not have permission to view this image', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    console.log('✅ Access granted, proceeding to fetch image...');    // Generate signed URL for private image
    const folder = photoType === 'profile' ? 'matrimonial-profiles' : 'matrimonial-gallery';
    const fullPublicId = `${folder}/${imageId}`;
    
    console.log('🔗 Generating signed URL for:', fullPublicId);
    
    let imageResponse: Response;
    try {
      const signedUrl = generateSignedUrl(fullPublicId, {
        width: photoType === 'profile' ? 400 : 800,
        height: photoType === 'profile' ? 400 : 600,
        expiresIn: 3600 // 1 hour
      });
      
      console.log('✅ Signed URL generated:', signedUrl.substring(0, 100) + '...');
      
      // Fetch the image from Cloudinary
      console.log('📥 Fetching image from Cloudinary...');
      imageResponse = await fetch(signedUrl);
      
      if (!imageResponse.ok) {
        console.error('❌ Failed to fetch image from Cloudinary:', imageResponse.status, imageResponse.statusText);
        return new NextResponse('Image not found', { status: 404 });
      }
      
      console.log('✅ Image fetched successfully from Cloudinary');
      
    } catch (error) {
      console.error('❌ Error generating signed URL or fetching image:', error);
      return new NextResponse('Error processing image', { status: 500 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    console.log('✅ Image served successfully');

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour privately
        'X-Robots-Tag': 'noindex, nofollow', // Prevent search engine indexing
      }
    });

  } catch (error) {
    console.error('🚨 Secure image serving error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
