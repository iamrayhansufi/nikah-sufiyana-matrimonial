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
        if (user && Object.keys(user).length > 0) {
          allUsers.push(user);
        }
      }
        
      // Filter users based on search criteria
      let filteredUsers = [...allUsers];
      
      // Filter by approved profiles only
      filteredUsers = filteredUsers.filter(user => 
        !user.profileStatus || user.profileStatus === 'approved'
      );
      
      // Gender filtering (most important for matrimonial)
      if (searchParams.gender) {
        filteredUsers = filteredUsers.filter(user => 
          user.gender === searchParams.gender
        );
      }
      
      // Age filtering with improved logic
      if (searchParams.ageMin && searchParams.ageMax) {
        filteredUsers = filteredUsers.filter(user => {
          const age = parseInt(String(user.age || '0'));
          return !isNaN(age) && 
            age >= parseInt(searchParams.ageMin) && 
            age <= parseInt(searchParams.ageMax);
        });
      } else if (searchParams.ageMin) {
        filteredUsers = filteredUsers.filter(user => {
          const age = parseInt(String(user.age || '0'));
          return !isNaN(age) && age >= parseInt(searchParams.ageMin);
        });
      } else if (searchParams.ageMax) {
        filteredUsers = filteredUsers.filter(user => {
          const age = parseInt(String(user.age || '0'));
          return !isNaN(age) && age <= parseInt(searchParams.ageMax);
        });
      }
      
      // Location filtering with improved matching
      if (searchParams.location) {
        filteredUsers = filteredUsers.filter(user => {
          const location = String(user.location || '').toLowerCase();
          const city = String(user.city || '').toLowerCase();
          const country = String(user.country || '').toLowerCase();
          const searchLoc = searchParams.location.toLowerCase();
          
          return location.includes(searchLoc) || 
                 city.includes(searchLoc) || 
                 country.includes(searchLoc) ||
                 searchLoc.includes(location) ||
                 searchLoc.includes(city);
        });
      }
      
      if (searchParams.city) {
        filteredUsers = filteredUsers.filter(user => {
          const city = String(user.city || '').toLowerCase();
          const searchCity = searchParams.city.toLowerCase();
          return city.includes(searchCity) || searchCity.includes(city);
        });
      }
      
      if (searchParams.country) {
        filteredUsers = filteredUsers.filter(user => {
          const country = String(user.country || '').toLowerCase();
          const searchCountry = searchParams.country.toLowerCase();
          return country.includes(searchCountry) || searchCountry.includes(country);
        });
      }
      
      // Education filtering with flexible matching
      if (searchParams.education) {
        filteredUsers = filteredUsers.filter(user => {
          if (!user.education) return false;
          const education = String(user.education).toLowerCase();
          const searchEd = searchParams.education.toLowerCase();
          
          // Exact match or contains matching
          return education === searchEd || 
                 education.includes(searchEd) ||
                 searchEd.includes(education);
        });
      }
      
      // Profession filtering
      if (searchParams.profession) {
        filteredUsers = filteredUsers.filter(user => {
          if (!user.profession) return false;
          const profession = String(user.profession).toLowerCase();
          const searchProf = searchParams.profession.toLowerCase();
          
          return profession.includes(searchProf) || searchProf.includes(profession);
        });
      }
      
      // Sect/Maslak filtering (very important for Islamic matrimony)
      if (searchParams.sect) {
        filteredUsers = filteredUsers.filter(user => 
          user.sect === searchParams.sect
        );
      }
      
      // Marital status filtering
      if (searchParams.maritalStatus) {
        filteredUsers = filteredUsers.filter(user => 
          user.maritalStatus === searchParams.maritalStatus
        );
      }
      
      // Height filtering (if provided)
      if (searchParams.heightMin) {
        filteredUsers = filteredUsers.filter(user => {
          if (!user.height) return false;
          // Convert height to comparable format (assuming format like "5'6\"" or "170cm")
          const height = String(user.height);
          // For now, just check if height exists - could be enhanced with proper height parsing
          return true; // Placeholder - implement height comparison logic if needed
        });
      }
      
      // Housing filtering
      if (searchParams.housing) {
        filteredUsers = filteredUsers.filter(user => 
          user.housing === searchParams.housing || user.housingStatus === searchParams.housing
        );
      }

      // Apply pagination
      const page = parseInt(searchParams.page || '1');
      const limit = parseInt(searchParams.limit || '10');
      const sortBy = searchParams.sortBy || 'match';
      const offset = (page - 1) * limit;
      
      // Get total before pagination
      const total = filteredUsers.length;
      
      // Map to the expected profile format first
      const profiles = filteredUsers.map(user => ({
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
        housing: user.housing,
        showPhotos: user.showPhotos !== 'false' && user.showPhotos !== false, // Convert to boolean properly
        // Handle profile photo - check multiple possible field names
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
        match: 85 + Math.floor(Math.random() * 15), // Random match 85-99% for now
      }));
      
      // Apply sorting with smart prioritization
      let sortedProfiles = [...profiles];
      switch (sortBy) {
        case 'match':
          // Smart match sorting: prioritize compatible gender profiles with higher match scores
          sortedProfiles.sort((a, b) => {
            // First, prioritize gender compatibility
            const aGenderScore = this.getGenderCompatibilityScore(a, searchParams);
            const bGenderScore = this.getGenderCompatibilityScore(b, searchParams);
            
            if (aGenderScore !== bGenderScore) {
              return bGenderScore - aGenderScore;
            }
            
            // Then sort by match percentage
            return (b.match || 0) - (a.match || 0);
          });
          break;
        case 'age':
          sortedProfiles.sort((a, b) => {
            const ageA = typeof a.age === 'number' ? a.age : parseInt(String(a.age)) || 0;
            const ageB = typeof b.age === 'number' ? b.age : parseInt(String(b.age)) || 0;
            return ageA - ageB;
          });
          break;
        case 'location':
          sortedProfiles.sort((a, b) => {
            const locA = String(a.location || a.city || '');
            const locB = String(b.location || b.city || '');
            return locA.localeCompare(locB);
          });
          break;
        case 'recent':
          sortedProfiles.sort((a, b) => {
            if (a.lastActive && b.lastActive) {
              const dateA = new Date(String(a.lastActive)).getTime();
              const dateB = new Date(String(b.lastActive)).getTime();
              return dateB - dateA;
            }
            const idA = String(a.id || '');
            const idB = String(b.id || '');
            return idB.localeCompare(idA);
          });
          break;
        default:
          // Default sorting: prioritize gender compatibility, then match score
          sortedProfiles.sort((a, b) => {
            const aGenderScore = this.getGenderCompatibilityScore(a, searchParams);
            const bGenderScore = this.getGenderCompatibilityScore(b, searchParams);
            
            if (aGenderScore !== bGenderScore) {
              return bGenderScore - aGenderScore;
            }
            
            return (b.match || 0) - (a.match || 0);
          });
          break;
      }
        // Apply pagination
      const paginatedProfiles = sortedProfiles.slice(offset, offset + limit);
      
      return { profiles: paginatedProfiles, total };
    },
    
    // Helper function to calculate gender compatibility score
    getGenderCompatibilityScore(profile: any, searchParams: any): number {
      // If gender filtering is applied, profiles already match the desired gender
      if (searchParams.gender && profile.gender === searchParams.gender) {
        return 100; // Perfect match
      }
      
      // For matrimonial purposes, opposite gender gets higher priority
      // This is a fallback in case gender filtering isn't applied
      if (profile.gender === 'female' || profile.gender === 'male') {
        return 50; // Good match
      }
      
      return 0; // No gender info or unknown
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
