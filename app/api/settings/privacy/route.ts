import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options-redis';
import { redis } from '@/lib/redis-client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
      // Get current privacy settings
    const settings = await redis.hget(`user:${userId}`, 'privacy_settings');
    
    const defaultSettings = {
      profilePhotoVisibility: 'logged_in_users',
      galleryVisibility: 'connected_users',
      showOnlineStatus: true,
      allowMessagesFrom: 'connected_users',
      showLastSeen: true
    };
    
    const currentSettings = settings && typeof settings === 'string' ? JSON.parse(settings) : defaultSettings;
    
    return NextResponse.json({
      success: true,
      settings: currentSettings
    });
    
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    // Validate settings
    const validProfileVisibility = ['public', 'logged_in_users', 'interested_users', 'connected_users', 'premium_users', 'private'];
    const validGalleryVisibility = ['connected_users', 'mutual_interest', 'premium_users', 'private'];
    const validMessagesFrom = ['everyone', 'interested_users', 'connected_users', 'premium_users', 'none'];
    
    const settings = {
      profilePhotoVisibility: validProfileVisibility.includes(body.profilePhotoVisibility) 
        ? body.profilePhotoVisibility : 'logged_in_users',
      galleryVisibility: validGalleryVisibility.includes(body.galleryVisibility) 
        ? body.galleryVisibility : 'connected_users',
      showOnlineStatus: typeof body.showOnlineStatus === 'boolean' ? body.showOnlineStatus : true,
      allowMessagesFrom: validMessagesFrom.includes(body.allowMessagesFrom) 
        ? body.allowMessagesFrom : 'connected_users',
      showLastSeen: typeof body.showLastSeen === 'boolean' ? body.showLastSeen : true
    };
      // Save to database
    await redis.hset(`user:${userId}`, {
      privacy_settings: JSON.stringify(settings)
    });
    
    console.log(`🔐 Privacy settings updated for user ${userId}:`, settings);
    
    return NextResponse.json({
      success: true,
      message: "Privacy settings updated successfully",
      settings
    });
    
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
