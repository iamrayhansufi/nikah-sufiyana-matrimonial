// Script to migrate data from PostgreSQL to Redis
import { redis, redisTables, testRedisConnection } from '../lib/redis-client';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env' });

async function migrateToRedis() {
  try {
    // Check Redis connection first
    console.log('Testing Redis connection...');
    const redisConnected = await testRedisConnection();
    
    if (!redisConnected) {
      console.error('Failed to connect to Redis. Please check your Redis configuration.');
      process.exit(1);
    }
    
    console.log('Redis connection successful!');
    
    // Check if backup data exists
    const backupFilePath = path.join(__dirname, 'backup-data.json');
    if (!fs.existsSync(backupFilePath)) {
      console.error('No backup data file found. Please create a backup-data.json file.');
      process.exit(1);
    }
    
    // Read backup data
    console.log(`Reading data from ${backupFilePath}...`);
    const fileContent = fs.readFileSync(backupFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Migrate users
    if (data.users && Array.isArray(data.users)) {
      console.log(`Found ${data.users.length} users in backup file`);
      for (const user of data.users) {
        try {
          // Clean up undefined values to prevent Redis errors
          Object.keys(user).forEach(key => {
            if (user[key] === undefined) {
              user[key] = null;
            }
          });
          
          // Add proper string conversion for IDs
          const userId = `user:${user.id}`;
          
          await redis.hset(userId, {
            ...user,
            id: userId
          });
          
          // Add to user index
          await redis.sadd('users', userId);
          
          console.log(`Migrated user: ${user.fullName} (${user.email})`);
        } catch (error) {
          console.error(`Error migrating user ${user.fullName}:`, error);
        }
      }
    }
    
    // Migrate interests
    if (data.interests && Array.isArray(data.interests)) {
      console.log(`Found ${data.interests.length} interests in backup file`);
      for (const interest of data.interests) {
        try {
          // Clean up undefined values
          Object.keys(interest).forEach(key => {
            if (interest[key] === undefined) {
              interest[key] = null;
            }
          });
          
          const interestId = `interest:${interest.id}`;
          const fromUserId = `user:${interest.fromUserId}`;
          const toUserId = `user:${interest.toUserId}`;
          
          // Store interest data
          await redis.hset(interestId, {
            ...interest,
            id: interestId,
            fromUserId: fromUserId,
            toUserId: toUserId
          });
          
          // Add indexes
          await redis.sadd('interests', interestId);
          await redis.sadd(`${fromUserId}:interests:sent`, interestId);
          await redis.sadd(`${toUserId}:interests:received`, interestId);
          
          console.log(`Migrated interest from ${fromUserId} to ${toUserId}`);
        } catch (error) {
          console.error(`Error migrating interest ${interest.id}:`, error);
        }
      }
    }
    
    // Migrate shortlists
    if (data.shortlists && Array.isArray(data.shortlists)) {
      console.log(`Found ${data.shortlists.length} shortlists in backup file`);
      for (const shortlist of data.shortlists) {
        try {
          const userId = `user:${shortlist.userId}`;
          const shortlistedUserId = `user:${shortlist.shortlistedUserId}`;
          
          await redis.sadd(`${userId}:shortlist`, shortlistedUserId);
          
          console.log(`Migrated shortlist: ${userId} -> ${shortlistedUserId}`);
        } catch (error) {
          console.error(`Error migrating shortlist:`, error);
        }
      }
    }
    
    // Migrate notifications
    if (data.notifications && Array.isArray(data.notifications)) {
      console.log(`Found ${data.notifications.length} notifications in backup file`);
      for (const notification of data.notifications) {
        try {
          // Clean up undefined values
          Object.keys(notification).forEach(key => {
            if (notification[key] === undefined) {
              notification[key] = null;
            }
          });
          
          const notificationId = `notification:${notification.id}`;
          const userId = `user:${notification.userId}`;
          
          // Extract related user ID from metadata if it exists
          const metadata = notification.metadata || {};
          const relatedUserId = metadata.relatedUserId ? `user:${metadata.relatedUserId}` : null;
          
          // Store notification data
          await redis.hset(notificationId, {
            ...notification,
            id: notificationId,
            userId: userId,
            relatedUserId: relatedUserId,
            metadata: JSON.stringify(metadata)
          });
          
          // Add to user's notifications list
          await redis.sadd(`${userId}:notifications`, notificationId);
          
          console.log(`Migrated notification for user ${userId}`);
        } catch (error) {
          console.error(`Error migrating notification ${notification.id}:`, error);
        }
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateToRedis();
