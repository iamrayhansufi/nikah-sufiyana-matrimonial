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
  users: {    async create(user: any): Promise<string> {
      const userId = user.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
      
      // Set the user ID in the user object
      user.id = `user:${cleanUserId}`;
      
      await redis.hset(`user:${cleanUserId}`, user);
      // Add to user index (store clean ID in the set)
      await redis.sadd('users', cleanUserId);
      return `user:${cleanUserId}`;
    },
      async get(userId: string): Promise<any | null> {
      // Remove 'user:' prefix if it exists to avoid double-prefixing
      const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
      const user = await redis.hgetall(`user:${cleanUserId}`);
      return user || null;
    },
      async update(userId: string, data: Partial<any>): Promise<boolean> {
      try {
        // Remove 'user:' prefix if it exists to avoid double-prefixing
        const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
        
        console.log(`🔄 Redis update for user:${cleanUserId}`);
        console.log(`📊 Data being written:`, JSON.stringify(data, null, 2));
        
        // Validate that we have data to write
        if (!data || Object.keys(data).length === 0) {
          console.error(`❌ No data provided for update`);
          return false;
        }
        
        // Ensure all values are strings (Redis requirement)
        const sanitizedData: Record<string, string> = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== null && value !== undefined) {
            sanitizedData[key] = String(value);
          }
        }
        
        console.log(`📊 Sanitized data:`, JSON.stringify(sanitizedData, null, 2));
        
        // Use hset which is the modern way (hmset is deprecated)
        const result = await redis.hset(`user:${cleanUserId}`, sanitizedData);
        
        console.log(`✅ Redis hset result:`, result);
        
        return true;
      } catch (error) {
        console.error(`❌ Redis update error for user ${userId}:`, error);
        console.error(`❌ Error details:`, {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown error type'
        });
        throw error; // Re-throw to be caught by the API route
      }
    },
    
    async delete(userId: string): Promise<boolean> {
      // Remove 'user:' prefix if it exists to avoid double-prefixing
      const cleanUserId = userId.startsWith('user:') ? userId.replace('user:', '') : userId;
      await redis.del(`user:${cleanUserId}`);
      await redis.srem('users', cleanUserId);
      return true;
    },
      async findByEmail(email: string): Promise<any | null> {
      // Validate email parameter
      if (!email || typeof email !== 'string') {
        console.error('findByEmail: Invalid email parameter:', { email, type: typeof email });
        return null;
      }
      
      try {
        // First get all user IDs
        const userIds = await redis.smembers('users');
        
        // Search through users to find one with matching email
        for (const userId of userIds) {
          const user = await redis.hgetall(`user:${userId}`);
          if (user && user.email && typeof user.email === 'string' && user.email === email) {
            return user;
          }
        }
        
        return null;
      } catch (error) {
        console.error('findByEmail: Error during search:', { error, email });
        throw error;
      }
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
    },    async isShortlisted(userId: string, targetUserId: string): Promise<boolean> {
      const result = await redis.sismember(`user:${userId}:shortlist`, targetUserId);
      return result === 1;
    }
  },
  
  // Notification operations
  notifications: {
    async create(notification: any): Promise<string> {
      const notificationId = notification.id || `notification:${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      if (!notification.id) notification.id = notificationId;
      
      await redis.hset(notificationId, notification);
      // Add to user's notifications list (using lpush to match how it's used elsewhere)
      await redis.lpush(`notifications:${notification.userId}`, notificationId);
      return notificationId;
    },
    
    async get(notificationId: string): Promise<any | null> {
      const notification = await redis.hgetall(notificationId);
      return notification && Object.keys(notification).length > 0 ? notification : null;
    },
    
    async markAsRead(notificationId: string): Promise<boolean> {
      await redis.hset(notificationId, { read: 'true' });
      return true;
    },
    
    async getUserNotifications(userId: string): Promise<any[]> {
      // Get notification IDs from the list (this matches how they're stored)
      const notificationIds = await redis.lrange(`notifications:${userId}`, 0, -1);
      const notifications = [];
      
      for (const id of notificationIds) {
        const notification = await redis.hgetall(id);
        if (notification && Object.keys(notification).length > 0) {
          notifications.push(notification);
        }
      }      // Sort by creation date (newest first)
      return notifications.sort((a, b) => {
        const dateA = new Date(a.createdAt ? String(a.createdAt) : Date.now()).getTime();
        const dateB = new Date(b.createdAt ? String(b.createdAt) : Date.now()).getTime();
        return dateB - dateA;
      });
    }
  }
};

export default redis;
