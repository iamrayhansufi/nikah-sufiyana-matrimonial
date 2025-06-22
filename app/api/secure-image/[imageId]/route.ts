import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options-redis';
import { generateSignedUrl, canAccessUserPhotos } from '@/lib/cloudinary-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    console.log('🔐 Secure image request for:', params.imageId);
    
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
    console.log('👤 Viewer:', viewerUserId);

    // Parse image ID to extract owner and type
    // Format: "profile-userId-timestamp" or "gallery-userId-index-timestamp"
    const imageIdParts = params.imageId.split('-');
    if (imageIdParts.length < 3) {
      return new NextResponse('Invalid image ID format', { status: 400 });
    }

    const photoType = imageIdParts[0] as 'profile' | 'gallery';
    const photoOwnerUserId = imageIdParts[1];
    
    console.log(`🎯 Photo type: ${photoType}, Owner: ${photoOwnerUserId}`);

    // Check access permissions
    const hasAccess = await canAccessUserPhotos(viewerUserId, `user:${photoOwnerUserId}`, photoType);
    
    if (!hasAccess) {
      console.log('🚫 Access denied for user:', viewerUserId);
      return new NextResponse('Access denied - You do not have permission to view this image', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    // Generate signed URL for private image
    const folder = photoType === 'profile' ? 'matrimonial-profiles' : 'matrimonial-gallery';
    const fullPublicId = `${folder}/${params.imageId}`;
    
    console.log('🔗 Generating signed URL for:', fullPublicId);
    
    const signedUrl = generateSignedUrl(fullPublicId, {
      width: photoType === 'profile' ? 400 : 800,
      height: photoType === 'profile' ? 400 : 600,
      expiresIn: 3600 // 1 hour
    });

    // Fetch the image from Cloudinary
    const imageResponse = await fetch(signedUrl);
    
    if (!imageResponse.ok) {
      console.error('❌ Failed to fetch image from Cloudinary:', imageResponse.statusText);
      return new NextResponse('Image not found', { status: 404 });
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
