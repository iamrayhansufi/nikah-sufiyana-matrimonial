/**
 * User Connection Service for Matrimonial Privacy Controls
 * Manages user relationships and photo access permissions
 */

import { redis } from '@/lib/redis-client';

export type ConnectionType = 
  | 'mutual_interest'    // Both users showed interest
  | 'sent_interest'      // User sent interest to another
  | 'received_interest'  // User received interest from another
  | 'matched'           // Users are matched by admin/algorithm
  | 'connected'         // Users are actively communicating
  | 'premium_access'    // Premium user can view photos
  | 'blocked'           // User is blocked
  | 'none';             // No connection

export interface UserConnection {
  userId1: string;
  userId2: string;
  connectionType: ConnectionType;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

/**
 * Check if two users are connected and can access each other's photos
 */
export async function canAccessUserPhotos(
  viewerUserId: string,
  photoOwnerUserId: string,
  photoType: 'profile' | 'gallery' = 'profile'
): Promise<boolean> {
  // Self-access is always allowed
  if (viewerUserId === photoOwnerUserId) {
    return true;
  }

  // Get user privacy settings
  const ownerPrivacySettings = await getUserPrivacySettings(photoOwnerUserId);
  const viewerProfile = await getUserProfile(viewerUserId);
  
  // Check if photo owner has blocked the viewer
  const isBlocked = await isUserBlocked(photoOwnerUserId, viewerUserId);
  if (isBlocked) {
    console.log(`🚫 User ${viewerUserId} is blocked by ${photoOwnerUserId}`);
    return false;
  }

  // Profile photo access rules
  if (photoType === 'profile') {
    // Check profile photo privacy setting
    switch (ownerPrivacySettings.profilePhotoVisibility) {
      case 'public':
        return true; // Anyone can see
      
      case 'logged_in_users':
        return true; // Any authenticated user can see
      
      case 'interested_users':
        // Only users who showed interest or are connected
        const connection = await getUserConnection(viewerUserId, photoOwnerUserId);
        return connection !== 'none';
      
      case 'connected_users':
        // Only matched/connected users
        const isConnected = await areUsersConnected(viewerUserId, photoOwnerUserId);
        return isConnected;
      
      case 'premium_users':
        // Only premium users can see
        return viewerProfile?.isPremium || false;
      
      case 'private':
        return false; // No one can see except owner
      
      default:
        return true; // Default to public for backward compatibility
    }
  }

  // Gallery photo access rules (more restrictive)
  if (photoType === 'gallery') {
    switch (ownerPrivacySettings.galleryVisibility) {
      case 'connected_users':
        return await areUsersConnected(viewerUserId, photoOwnerUserId);
      
      case 'mutual_interest':
        const connection = await getUserConnection(viewerUserId, photoOwnerUserId);
        return connection === 'mutual_interest' || connection === 'matched' || connection === 'connected';
      
      case 'premium_users':
        return viewerProfile?.isPremium || false;
      
      case 'private':
        return false;
      
      default:
        // Default: only connected users can see gallery
        return await areUsersConnected(viewerUserId, photoOwnerUserId);
    }
  }

  return false;
}

/**
 * Get user connection status
 */
export async function getUserConnection(userId1: string, userId2: string): Promise<ConnectionType> {
  try {    // Check both directions of connection
    const connection1 = await redis.hget(`user_connections:${userId1}`, userId2);
    const connection2 = await redis.hget(`user_connections:${userId2}`, userId1);
    
    if (connection1 || connection2) {
      const conn1 = connection1 && typeof connection1 === 'string' ? JSON.parse(connection1) : null;
      const conn2 = connection2 && typeof connection2 === 'string' ? JSON.parse(connection2) : null;
      
      // Check for mutual interest
      if (conn1?.type === 'sent_interest' && conn2?.type === 'sent_interest') {
        return 'mutual_interest';
      }
      
      // Return the stronger connection
      const conn = conn1 || conn2;
      return conn.type || 'none';
    }
    
    return 'none';
  } catch (error) {
    console.error('Error checking user connection:', error);
    return 'none';
  }
}

/**
 * Check if users are connected (matched, mutual interest, etc.)
 */
export async function areUsersConnected(userId1: string, userId2: string): Promise<boolean> {
  const connection = await getUserConnection(userId1, userId2);
  return ['mutual_interest', 'matched', 'connected'].includes(connection);
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(blockerId: string, blockedUserId: string): Promise<boolean> {
  try {
    const blockedUsers = await redis.smembers(`blocked_users:${blockerId}`);
    return blockedUsers.includes(blockedUserId);
  } catch (error) {
    console.error('Error checking blocked status:', error);
    return false;
  }
}

/**
 * Get user privacy settings
 */
export async function getUserPrivacySettings(userId: string): Promise<{
  profilePhotoVisibility: 'public' | 'logged_in_users' | 'interested_users' | 'connected_users' | 'premium_users' | 'private';
  galleryVisibility: 'connected_users' | 'mutual_interest' | 'premium_users' | 'private';
}> {  try {
    const settings = await redis.hget(`user:${userId}`, 'privacy_settings');
    if (settings && typeof settings === 'string') {
      return JSON.parse(settings);
    }
    
    // Default privacy settings for matrimonial site
    return {
      profilePhotoVisibility: 'logged_in_users', // Profile photos visible to all logged-in users
      galleryVisibility: 'connected_users' // Gallery photos only for connected users
    };
  } catch (error) {
    console.error('Error getting privacy settings:', error);
    return {
      profilePhotoVisibility: 'logged_in_users',
      galleryVisibility: 'connected_users'
    };
  }
}

/**
 * Get basic user profile info
 */
export async function getUserProfile(userId: string): Promise<{
  isPremium: boolean;
  verified: boolean;
} | null> {  try {
    const profile = await redis.hgetall(`user:${userId}`);
    if (!profile) {
      return null;
    }
    return {
      isPremium: profile.isPremium === 'true' || profile.membership === 'premium',
      verified: profile.emailVerified === 'true'
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Send interest to another user
 */
export async function sendInterest(senderUserId: string, receiverUserId: string): Promise<boolean> {  try {
    // Store the interest
    await redis.hset(`user_connections:${senderUserId}`, {
      [receiverUserId]: JSON.stringify({
        type: 'sent_interest',
        createdAt: new Date().toISOString(),
        status: 'active'
      })
    });
    
    await redis.hset(`user_connections:${receiverUserId}`, {
      [senderUserId]: JSON.stringify({
        type: 'received_interest',
        createdAt: new Date().toISOString(),
        status: 'active'
      })
    });
    
    // Add to interests list for notifications
    await redis.sadd(`interests_sent:${senderUserId}`, receiverUserId);
    await redis.sadd(`interests_received:${receiverUserId}`, senderUserId);
    
    return true;
  } catch (error) {
    console.error('Error sending interest:', error);
    return false;
  }
}

/**
 * Block a user
 */
export async function blockUser(blockerId: string, blockedUserId: string): Promise<boolean> {
  try {
    await redis.sadd(`blocked_users:${blockerId}`, blockedUserId);
    
    // Remove any existing connections
    await redis.hdel(`user_connections:${blockerId}`, blockedUserId);
    await redis.hdel(`user_connections:${blockedUserId}`, blockerId);
    
    return true;
  } catch (error) {
    console.error('Error blocking user:', error);
    return false;
  }
}

export default {
  canAccessUserPhotos,
  getUserConnection,
  areUsersConnected,
  isUserBlocked,
  getUserPrivacySettings,
  getUserProfile,
  sendInterest,
  blockUser
};
