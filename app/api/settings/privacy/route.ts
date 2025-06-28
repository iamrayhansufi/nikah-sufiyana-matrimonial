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
    const updateData = await request.json();
    const userKey = `user:${userId}`;

    // Get current user data
    const currentUserData = await redis.hgetall(userKey);
    if (!currentUserData || Object.keys(currentUserData).length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }

    // Handle both new settings format and legacy privacy settings
    const updates: Record<string, string> = {};

    // New settings format (for settings page)
    const allowedFields = {
      'profileVisibility': ['all', 'premium', 'matches'],
      'photoPrivacy': ['all', 'premium', 'matches']
    };

    for (const [key, value] of Object.entries(updateData)) {
      if (key in allowedFields) {
        const validValues = allowedFields[key as keyof typeof allowedFields];
        const stringValue = String(value);
        
        if (validValues.includes(stringValue)) {
          updates[key] = stringValue;
        } else {
          return NextResponse.json({ 
            error: `Invalid value for ${key}. Allowed values: ${validValues.join(', ')}` 
          }, { status: 400 });
        }
      }
    }

    // Legacy privacy settings format
    const validProfileVisibility = ['public', 'logged_in_users', 'interested_users', 'connected_users', 'premium_users', 'private'];
    const validGalleryVisibility = ['connected_users', 'mutual_interest', 'premium_users', 'private'];
    const validMessagesFrom = ['everyone', 'interested_users', 'connected_users', 'premium_users', 'none'];
    
    if (updateData.profilePhotoVisibility || updateData.galleryVisibility || 
        updateData.showOnlineStatus !== undefined || updateData.allowMessagesFrom || 
        updateData.showLastSeen !== undefined) {
      
      const settings = {
        profilePhotoVisibility: validProfileVisibility.includes(updateData.profilePhotoVisibility) 
          ? updateData.profilePhotoVisibility : 'logged_in_users',
        galleryVisibility: validGalleryVisibility.includes(updateData.galleryVisibility) 
          ? updateData.galleryVisibility : 'connected_users',
        showOnlineStatus: typeof updateData.showOnlineStatus === 'boolean' ? updateData.showOnlineStatus : true,
        allowMessagesFrom: validMessagesFrom.includes(updateData.allowMessagesFrom) 
          ? updateData.allowMessagesFrom : 'connected_users',
        showLastSeen: typeof updateData.showLastSeen === 'boolean' ? updateData.showLastSeen : true
      };

      updates.privacy_settings = JSON.stringify(settings);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid privacy settings to update" 
      }, { status: 400 });
    }

    // Update privacy settings in Redis
    await redis.hset(userKey, updates);

    return NextResponse.json({
      success: true,
      message: "Privacy settings updated successfully",
      updated: Object.keys(updates)
    });

  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
