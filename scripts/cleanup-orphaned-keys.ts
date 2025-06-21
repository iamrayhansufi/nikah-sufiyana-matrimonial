import { redis } from '../lib/redis-client';

async function cleanupOrphanedKeys() {
  try {
    console.log('🧹 Cleaning up orphaned keys...');
    
    // Get all keys to identify orphaned data
    const allKeys = await redis.keys('*');
    console.log(`Found ${allKeys.length} total keys in Redis`);
    
    // Get current valid user IDs
    const validUserIds = await redis.smembers('users');
    console.log('Valid user IDs:', validUserIds);
    
    let deletedCount = 0;
    
    // Check for orphaned user keys
    const userKeys = allKeys.filter(key => key.startsWith('user:'));
    for (const key of userKeys) {
      const userId = key.replace('user:', '');
      if (!validUserIds.includes(userId)) {
        console.log(`Deleting orphaned user key: ${key}`);
        await redis.del(key);
        deletedCount++;
      }
    }
    
    // Check for orphaned interest keys
    const interestKeys = allKeys.filter(key => key.includes(':interests:'));
    for (const key of interestKeys) {
      // Extract user ID from interest key
      const parts = key.split(':');
      if (parts.length >= 2) {
        const userId = parts[1];
        if (!validUserIds.includes(userId)) {
          console.log(`Deleting orphaned interest key: ${key}`);
          await redis.del(key);
          deletedCount++;
        }
      }
    }
    
    // Check for orphaned notification keys
    const notificationKeys = allKeys.filter(key => key.startsWith('notification:') || key.includes(':notifications'));
    for (const key of notificationKeys) {
      // For notification keys that reference users
      if (key.includes(':notifications')) {
        const parts = key.split(':');
        if (parts.length >= 2) {
          const userId = parts[1];
          if (!validUserIds.includes(userId)) {
            console.log(`Deleting orphaned notification key: ${key}`);
            await redis.del(key);
            deletedCount++;
          }
        }
      }
    }
    
    // Check for orphaned shortlist keys
    const shortlistKeys = allKeys.filter(key => key.includes(':shortlist'));
    for (const key of shortlistKeys) {
      const parts = key.split(':');
      if (parts.length >= 2) {
        const userId = parts[1];
        if (!validUserIds.includes(userId)) {
          console.log(`Deleting orphaned shortlist key: ${key}`);
          await redis.del(key);
          deletedCount++;
        }
      }
    }
    
    // Check for any other user-related keys
    const otherUserKeys = allKeys.filter(key => 
      !key.startsWith('user:') && 
      !key.includes(':interests:') && 
      !key.includes(':notifications') && 
      !key.includes(':shortlist') &&
      key !== 'users' &&
      !key.startsWith('notification:') &&
      (key.includes('user:') || /user:\d+/.test(key))
    );
    
    for (const key of otherUserKeys) {
      console.log(`Found potential orphaned key: ${key}`);
      // You can decide whether to delete these or not
    }
    
    console.log(`\n✅ Cleanup completed. Deleted ${deletedCount} orphaned keys.`);
    
    // Show final key count
    const finalKeys = await redis.keys('*');
    console.log(`Final key count: ${finalKeys.length}`);
    
    // List remaining keys for verification
    if (finalKeys.length < 20) {
      console.log('Remaining keys:', finalKeys);
    } else {      console.log('Key types remaining:');
      const keyTypes: Record<string, number> = {};
      for (const key of finalKeys) {
        const type = key.split(':')[0];
        keyTypes[type] = (keyTypes[type] || 0) + 1;
      }
      console.table(keyTypes);
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupOrphanedKeys();
