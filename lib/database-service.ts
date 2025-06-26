/**
 * Database service that provides a unified interface for Redis operations
 */

import { config } from 'dotenv';
// Load environment variables
config({ path: '.env' });

// Import Redis client
import { redis, redisTables } from './redis-client';

// Set database type to Redis only
const USE_DATABASE = 'redis';

// Define a unified interface for database operations
export const database = {
  users: {
    async getAllUserIds(): Promise<string[]> {
      return await redis.smembers('users');
    },
    
    async create(userData: any): Promise<string> {
      return await redisTables.users.create(userData);
    },
    
    async getById(userId: string): Promise<any | null> {
      return await redisTables.users.get(userId);
    },

    async getByEmail(email: string): Promise<any | null> {
      return await redisTables.users.findByEmail(email);
    },
      async update(userId: string, data: any): Promise<boolean> {
      return await redisTables.users.update(userId, data);
    },

    // Admin methods
    async getUsers(page: number = 1, limit: number = 10): Promise<any[]> {
      const userIds = await redis.smembers('users');
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedIds = userIds.slice(startIndex, endIndex);
      
      const users = await Promise.all(
        paginatedIds.map(async (id) => {
          const userData = await redis.hgetall(`user:${id}`);
          return userData && Object.keys(userData).length > 0 ? { ...userData, id } : null;
        })
      );
      
      return users.filter(user => user !== null);
    },

    async getUserStats(): Promise<{ total: number; premium: number; pending: number }> {
      const userIds = await redis.smembers('users');
      const users = await Promise.all(
        userIds.map(async (id) => {
          const userData = await redis.hgetall(`user:${id}`);
          return userData && Object.keys(userData).length > 0 ? userData : null;
        })
      );
      
      const validUsers = users.filter(user => user !== null);
      const premium = validUsers.filter(user => user.subscription === 'premium').length;
      const pending = validUsers.filter(user => user.profileStatus === 'pending').length;
      
      return {
        total: validUsers.length,
        premium,
        pending
      };
    },

    async getUserById(userId: string): Promise<any | null> {
      return await this.getById(userId);
    },

    async updateUserProfile(userId: string, data: any): Promise<boolean> {
      return await this.update(userId, data);
    },
  },
    interests: {
    async create(interestData: any): Promise<string> {
      return await redisTables.interests.create(interestData);
    },

    async getReceivedInterests(userId: string): Promise<any[]> {
      return await redisTables.interests.getReceivedInterests(userId);
    },
    
    async getSentInterests(userId: string): Promise<any[]> {
      return await redisTables.interests.getSentInterests(userId);
    },
    
    async update(interestId: string, data: any): Promise<boolean> {
      return await redisTables.interests.update(interestId, data);
    },
  },
  
  shortlists: {
    async add(userId: string, targetUserId: string): Promise<boolean> {
      return await redisTables.shortlists.add(userId, targetUserId);
    },

    async get(userId: string): Promise<any[]> {
      const shortlistedIds = await redisTables.shortlists.get(userId);
      const shortlistedUsers = [];

      for (const id of shortlistedIds) {
        const user = await redisTables.users.get(id);
        if (user) shortlistedUsers.push(user);
      }

      return shortlistedUsers;
    },
    
    async remove(userId: string, targetUserId: string): Promise<boolean> {
      return await redisTables.shortlists.remove(userId, targetUserId);
    },
    
    async isShortlisted(userId: string, targetUserId: string): Promise<boolean> {
      return await redisTables.shortlists.isShortlisted(userId, targetUserId);
    },
  },
  
  notifications: {
    async create(notificationData: any): Promise<string> {
      return await redisTables.notifications.create(notificationData);
    },

    async getUserNotifications(userId: string): Promise<any[]> {
      return await redisTables.notifications.getUserNotifications(userId);
    },
    
    async markAsRead(notificationId: string): Promise<boolean> {
      return await redisTables.notifications.markAsRead(notificationId);
    },
    
    async get(notificationId: string): Promise<any | null> {
      return await redisTables.notifications.get(notificationId);
    },
  },

  profiles: {
    async searchProfiles(searchParams: any): Promise<{ profiles: any[], total: number }> {
      // Search profiles in Redis
      const userIds = await redis.smembers('users');
      const allUsers = [];
      
      // Get all users
      for (const userId of userIds) {
        const user = await redis.hgetall(`user:${userId}`);
        if (user) allUsers.push(user);
      }
        
      // Filter users based on search criteria
      let filteredUsers = [...allUsers];
      
      if (searchParams.ageMin && searchParams.ageMax) {
        filteredUsers = filteredUsers.filter(user => {
          const age = parseInt(String(user.age || '0'));
          return !isNaN(age) && 
            age >= parseInt(searchParams.ageMin) && 
            age <= parseInt(searchParams.ageMax);
        });
      }
      
      if (searchParams.location) {
        filteredUsers = filteredUsers.filter(user => 
          user.location && String(user.location).toLowerCase().includes(searchParams.location.toLowerCase())
        );
      }
      
      if (searchParams.education) {
        filteredUsers = filteredUsers.filter(user => 
          user.education === searchParams.education
        );
      }
      
      if (searchParams.profession) {
        filteredUsers = filteredUsers.filter(user => 
          user.profession === searchParams.profession
        );
      }
      
      if (searchParams.sect) {
        filteredUsers = filteredUsers.filter(user => 
          user.sect === searchParams.sect
        );
      }
      
      if (searchParams.maritalStatus) {
        filteredUsers = filteredUsers.filter(user => 
          user.maritalStatus === searchParams.maritalStatus
        );
      }
      
      // Apply pagination
      const page = parseInt(searchParams.page || '1');
      const limit = parseInt(searchParams.limit || '10');
      const offset = (page - 1) * limit;
      
      // Get total before pagination
      const total = filteredUsers.length;
        // Apply pagination
      const paginatedUsers = filteredUsers.slice(offset, offset + limit);
      
      // Map to the expected profile format
      const profiles = paginatedUsers.map(user => ({
        id: (user.id && typeof user.id === 'string') ? user.id.replace('user:', '') : user.id, // Remove user: prefix for cleaner URLs
        name: user.fullName || user.name || 'Unknown', // Map fullName to name for frontend compatibility
        fullName: user.fullName || user.name || 'Unknown',
        age: user.age,
        location: user.location,
        city: user.city,
        country: user.country,
        education: user.education,
        profession: user.profession,
        sect: user.sect,
        height: user.height,
        maritalStatus: user.maritalStatus,
        motherTongue: user.motherTongue,
        complexion: user.complexion,
        income: user.income,
        housing: user.housing,        // Handle profile photo - check multiple possible field names
        profilePhoto: (() => {
          // Priority: profilePhoto -> first photo from profilePhotos array -> image -> fallback
          if (user.profilePhoto) return user.profilePhoto;
          if (user.profilePhotos) {
            let photosArray;
            if (typeof user.profilePhotos === 'string') {
              try {
                photosArray = JSON.parse(user.profilePhotos);
              } catch (e) {
                return user.image || '/placeholder-user.jpg';
              }
            } else if (Array.isArray(user.profilePhotos)) {
              photosArray = user.profilePhotos;
            }
            if (Array.isArray(photosArray) && photosArray.length > 0) {
              return photosArray[0];
            }
          }
          return user.image || '/placeholder-user.jpg';
        })(),
        image: (() => {
          if (user.profilePhoto) return user.profilePhoto;
          if (user.profilePhotos) {
            let photosArray;
            if (typeof user.profilePhotos === 'string') {
              try {
                photosArray = JSON.parse(user.profilePhotos);
              } catch (e) {
                return user.image || '/placeholder-user.jpg';
              }
            } else if (Array.isArray(user.profilePhotos)) {
              photosArray = user.profilePhotos;
            }
            if (Array.isArray(photosArray) && photosArray.length > 0) {
              return photosArray[0];
            }
          }
          return user.image || '/placeholder-user.jpg';
        })(),
        premium: user.premium === 'true' || user.premium === true,
        verified: user.verified === 'true' || user.verified === true,
        lastActive: user.lastActive,
        gender: user.gender,
        profileStatus: user.profileStatus,
      }));
      
      return { profiles, total };
    },
    
    async getById(profileId: string): Promise<any | null> {
      return await redisTables.profiles.get(profileId);
    },
    
    async update(profileId: string, data: any): Promise<boolean> {
      return await redisTables.profiles.update(profileId, data);
    },
  },

  // Testing function to check if Redis is connected
  testRedisConnection: async function() {
    try {
      const testKey = 'test_connection';
      await redis.set(testKey, 'Connected to Redis!');
      const result = await redis.get(testKey);
      console.log('Redis connection test result:', result);
      return true;
    } catch (error) {
      console.error('Redis connection test failed:', error);
      return false;
    }
  }
};

export default database;
