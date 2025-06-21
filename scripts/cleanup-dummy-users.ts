#!/usr/bin/env node

import { redis } from '../lib/redis-client.js';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  profileStatus?: string;
}

async function cleanupDummyUsers() {
  try {
    console.log('🧹 Starting cleanup of dummy and test users...');
    
    // Get all user IDs from the users set
    const userIds = await redis.smembers('users');
    console.log(`📋 Found ${userIds.length} user IDs in users set:`, userIds);

    // Get all actual user keys
    const userKeys = await redis.keys('user:*');
    const actualUserKeys = userKeys.filter((key: string) => 
      key.match(/^user:\d+$/) // Only keys like user:1, user:2, etc.
    );
    console.log(`📋 Found ${actualUserKeys.length} actual user keys:`, actualUserKeys);

    // Keep track of valid user IDs
    const validUserIds = new Set<string>();
    const usersToKeep: UserData[] = [];

    // Check each actual user and decide if we should keep them
    for (const userKey of actualUserKeys) {
      const userId = userKey.replace('user:', '');
      const userData = await redis.hgetall(userKey);
      
      if (!userData || Object.keys(userData).length === 0) {
        console.log(`⚠️  Empty user data for ${userKey}, will be removed`);
        continue;
      }

      const user: UserData = {
        id: userId,
        name: String(userData.fullName || userData.name || 'Unknown'),
        email: String(userData.email || 'unknown@example.com'),
        phone: userData.phone ? String(userData.phone) : undefined,
        role: String(userData.role || 'user'),
        createdAt: userData.createdAt ? String(userData.createdAt) : undefined,
        profileStatus: String(userData.profileStatus || userData.status || 'unknown')
      };

      // Determine if this is a dummy/test user
      const isDummy = (
        user.name.toLowerCase().includes('test') ||
        user.name.toLowerCase().includes('dummy') ||
        user.email.includes('test') ||
        user.email.includes('dummy') ||
        user.email.includes('example.com') && user.role !== 'admin'
      );

      if (isDummy) {
        console.log(`🗑️  Will remove dummy/test user: ${user.name} (${user.email})`);
      } else {
        console.log(`✅ Will keep user: ${user.name} (${user.email}) - Role: ${user.role}`);
        validUserIds.add(userId);
        usersToKeep.push(user);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`- Users to keep: ${usersToKeep.length}`);
    console.log(`- Users to remove: ${actualUserKeys.length - usersToKeep.length}`);

    // Clean up the users set - remove invalid IDs
    console.log('\n🧹 Cleaning up users set...');
    for (const userId of userIds) {
      if (!validUserIds.has(userId.toString())) {
        console.log(`🗑️  Removing invalid user ID from set: ${userId}`);
        await redis.srem('users', userId);
      }
    }

    // Remove user data for users we don't want to keep
    for (const userKey of actualUserKeys) {
      const userId = userKey.replace('user:', '');
      if (!validUserIds.has(userId)) {
        console.log(`🗑️  Deleting user data: ${userKey}`);
        await redis.del(userKey);
      }
    }

    // Clean up related data (interests, notifications, shortlists)
    console.log('\n🧹 Cleaning up related data...');

    // Clean up interests
    const interestKeys = await redis.keys('*interest*');
    console.log(`📋 Found ${interestKeys.length} interest-related keys`);
    
    for (const key of interestKeys) {
      // Check if it's a malformed key or related to a removed user
      if (
        key.includes('interest:interest:') || // Double prefix
        key.match(/user:user:\d+/) || // Double user prefix
        key.match(/interest:\d+/) // Simple interest:ID format
      ) {
        console.log(`🗑️  Removing malformed interest key: ${key}`);
        await redis.del(key);
      } else if (key.match(/user:(\d+):interests/)) {
        // Check if the user exists
        const userIdMatch = key.match(/user:(\d+):interests/);
        if (userIdMatch && !validUserIds.has(userIdMatch[1])) {
          console.log(`🗑️  Removing interests for deleted user: ${key}`);
          await redis.del(key);
        }
      }
    }

    // Clean up notifications
    const notificationKeys = await redis.keys('*notification*');
    console.log(`📋 Found ${notificationKeys.length} notification-related keys`);

    for (const key of notificationKeys) {
      // Check if it's a malformed key or related to a removed user
      if (
        key.includes('notification:notification:') || // Double prefix
        key.match(/user:user:\d+/) // Double user prefix
      ) {
        console.log(`🗑️  Removing malformed notification key: ${key}`);
        await redis.del(key);
      } else if (key.match(/user:(\d+):notifications/)) {
        // Check if the user exists
        const userIdMatch = key.match(/user:(\d+):notifications/);
        if (userIdMatch && !validUserIds.has(userIdMatch[1])) {
          console.log(`🗑️  Removing notifications for deleted user: ${key}`);
          await redis.del(key);
        }
      }
    }

    // Clean up shortlists
    const shortlistKeys = await redis.keys('*shortlist*');
    console.log(`📋 Found ${shortlistKeys.length} shortlist-related keys`);

    for (const key of shortlistKeys) {
      // Check if it's a malformed key or related to a removed user
      if (key.match(/user:user:\d+/)) { // Double user prefix
        console.log(`🗑️  Removing malformed shortlist key: ${key}`);
        await redis.del(key);
      } else if (key.match(/user:(\d+):shortlist/)) {
        // Check if the user exists
        const userIdMatch = key.match(/user:(\d+):shortlist/);
        if (userIdMatch && !validUserIds.has(userIdMatch[1])) {
          console.log(`🗑️  Removing shortlist for deleted user: ${key}`);
          await redis.del(key);
        }
      }
    }

    // Clean up any other orphaned keys
    console.log('\n🧹 Looking for other orphaned keys...');
    const allKeys = await redis.keys('*');
    let orphanedCount = 0;

    for (const key of allKeys) {
      // Skip keys we want to keep
      if (
        key === 'users' || 
        key === 'profiles' ||
        key === 'lastUserId' ||
        validUserIds.has(key.replace('user:', '')) ||
        key.match(/^user:\d+$/) && validUserIds.has(key.replace('user:', ''))
      ) {
        continue;
      }

      // Check for user-specific keys for users that no longer exist
      const userMatch = key.match(/user:(\d+):/);
      if (userMatch && !validUserIds.has(userMatch[1])) {
        console.log(`🗑️  Removing orphaned key: ${key}`);
        await redis.del(key);
        orphanedCount++;
      }
    }

    console.log(`\n✅ Cleanup completed!`);
    console.log(`📊 Final summary:`);
    console.log(`- Valid users remaining: ${validUserIds.size}`);
    console.log(`- Orphaned keys cleaned: ${orphanedCount}`);

    // List remaining users
    console.log(`\n👥 Remaining users:`);
    for (const user of usersToKeep) {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDummyUsers().catch(console.error);
