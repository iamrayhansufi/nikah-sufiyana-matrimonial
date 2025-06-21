// Redis client implementation using Upstash Redis
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

// Check Redis connection configuration
const redisRestUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

// Explicitly check if the URL and token are defined and throw error if not
if (!redisRestUrl) {
  throw new Error('No Redis REST API URL defined in environment variables (KV_REST_API_URL)');
}

if (!redisToken) {
  throw new Error('No Redis REST API token defined in environment variables (KV_REST_API_TOKEN)');
}

// Create Redis client
export const redis = new Redis({
  url: redisRestUrl,
  token: redisToken,
});

// Helper to test connection
export async function testRedisConnection() {
  try {
    await redis.set('test', 'connection successful');
    const result = await redis.get('test');
    console.log('Redis connection test:', result);
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}

// Helper to create and manage tables/collections in Redis
export const redisTables = {
  // User operations
  users: {
    async create(user: any): Promise<string> {
      const userId = user.id || `user:${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      if (!user.id) user.id = userId;
      
      await redis.hset(`user:${userId}`, user);
      // Add to user index
      await redis.sadd('users', userId);
      return userId;
    },
      async get(userId: string): Promise<any | null> {
      // Remove 'user:' prefix if it exists to avoid double-prefixing
      const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
      const user = await redis.hgetall(`user:${cleanUserId}`);
      return user || null;
    },
      async update(userId: string, data: Partial<any>): Promise<boolean> {
      // Remove 'user:' prefix if it exists to avoid double-prefixing
      const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
      await redis.hset(`user:${cleanUserId}`, data);
      return true;
    },
    
    async delete(userId: string): Promise<boolean> {
      // Remove 'user:' prefix if it exists to avoid double-prefixing
      const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
      await redis.del(`user:${cleanUserId}`);
      await redis.srem('users', cleanUserId);
      return true;
    },
    
    async findByEmail(email: string): Promise<any | null> {
      // First get all user IDs
      const userIds = await redis.smembers('users');
      
      // Search through users to find one with matching email
      for (const userId of userIds) {
        const user = await redis.hgetall(`user:${userId}`);
        if (user && user.email === email) {
          return user;
        }
      }
      
      return null;
    }
  },
  
  // Profile operations
  profiles: {
    async create(profile: any): Promise<string> {
      const profileId = profile.id || profile.userId || `profile:${Date.now()}`;
      if (!profile.id) profile.id = profileId;
      
      await redis.hset(`profile:${profileId}`, profile);
      // Add to profile index
      await redis.sadd('profiles', profileId);
      return profileId;
    },
    
    async get(profileId: string): Promise<any | null> {
      const profile = await redis.hgetall(`profile:${profileId}`);
      return profile || null;
    },
    
    async update(profileId: string, data: Partial<any>): Promise<boolean> {
      await redis.hset(`profile:${profileId}`, data);
      return true;
    },
    
    async delete(profileId: string): Promise<boolean> {
      await redis.del(`profile:${profileId}`);
      await redis.srem('profiles', profileId);
      return true;
    }
  },
  
  // Interest operations
  interests: {
    async create(interest: any): Promise<string> {
      const interestId = interest.id || `interest:${Date.now()}`;
      if (!interest.id) interest.id = interestId;
      
      await redis.hset(`interest:${interestId}`, interest);
      // Add indexes for quick access
      await redis.sadd('interests', interestId);
      await redis.sadd(`user:${interest.fromUserId}:interests:sent`, interestId);
      await redis.sadd(`user:${interest.toUserId}:interests:received`, interestId);
      return interestId;
    },
    
    async get(interestId: string): Promise<any | null> {
      const interest = await redis.hgetall(`interest:${interestId}`);
      return interest || null;
    },
    
    async update(interestId: string, data: Partial<any>): Promise<boolean> {
      await redis.hset(`interest:${interestId}`, data);
      return true;
    },
    
    async getReceivedInterests(userId: string): Promise<any[]> {
      const interestIds = await redis.smembers(`user:${userId}:interests:received`);
      const interests = [];
      
      for (const id of interestIds) {
        const interest = await redis.hgetall(`interest:${id}`);
        if (interest) interests.push(interest);
      }
      
      return interests;
    },
    
    async getSentInterests(userId: string): Promise<any[]> {
      const interestIds = await redis.smembers(`user:${userId}:interests:sent`);
      const interests = [];
      
      for (const id of interestIds) {
        const interest = await redis.hgetall(`interest:${id}`);
        if (interest) interests.push(interest);
      }
      
      return interests;
    }
  },
  
  // Shortlist operations
  shortlists: {
    async add(userId: string, targetUserId: string): Promise<boolean> {
      await redis.sadd(`user:${userId}:shortlist`, targetUserId);
      return true;
    },
    
    async remove(userId: string, targetUserId: string): Promise<boolean> {
      await redis.srem(`user:${userId}:shortlist`, targetUserId);
      return true;
    },
    
    async get(userId: string): Promise<string[]> {
      return await redis.smembers(`user:${userId}:shortlist`);
    },
      async isShortlisted(userId: string, targetUserId: string): Promise<boolean> {
      const result = await redis.sismember(`user:${userId}:shortlist`, targetUserId);
      return result === 1;
    }
  },
  
  // Notification operations
  notifications: {
    async create(notification: any): Promise<string> {
      const notificationId = notification.id || `notification:${Date.now()}`;
      if (!notification.id) notification.id = notificationId;
      
      await redis.hset(`notification:${notificationId}`, notification);
      // Add to user's notifications list
      await redis.sadd(`user:${notification.userId}:notifications`, notificationId);
      return notificationId;
    },
    
    async get(notificationId: string): Promise<any | null> {
      const notification = await redis.hgetall(`notification:${notificationId}`);
      return notification || null;
    },
    
    async markAsRead(notificationId: string): Promise<boolean> {
      await redis.hset(`notification:${notificationId}`, { read: true });
      return true;
    },
    
    async getUserNotifications(userId: string): Promise<any[]> {
      const notificationIds = await redis.smembers(`user:${userId}:notifications`);
      const notifications = [];
      
      for (const id of notificationIds) {
        const notification = await redis.hgetall(`notification:${id}`);
        if (notification) notifications.push(notification);
      }
      
      return notifications;
    }
  }
};

export default redis;
