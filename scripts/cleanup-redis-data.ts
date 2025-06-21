import { redis } from "../lib/redis-client";

async function cleanupRedisData() {
  console.log("🧹 Redis Cleanup Script");
  console.log("=".repeat(50));
  
  try {
    // 1. Cleanup expired verification codes
    console.log("🔍 Cleaning up expired verification codes...");
    const verificationKeys = await redis.keys("verification:*");
    let expiredVerifications = 0;
    
    for (const key of verificationKeys) {
      const verification = await redis.hgetall(key);
      if (verification && verification.expiresAt && typeof verification.expiresAt === 'string') {
        const expiresAt = parseInt(verification.expiresAt);
        const now = Date.now();
        
        if (expiresAt < now) {
          await redis.del(key);
          expiredVerifications++;
          console.log(`  ✅ Deleted expired verification: ${key}`);
        }
      }
    }
    
    console.log(`🗑️  Removed ${expiredVerifications} expired verification codes`);
    
    // 2. Cleanup old notifications (older than 30 days)
    console.log("\n🔍 Cleaning up old notifications...");
    const notificationKeys = await redis.keys("notification:*");
    let oldNotifications = 0;
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    for (const key of notificationKeys) {
      const notification = await redis.hgetall(key);
      if (notification && notification.createdAt && typeof notification.createdAt === 'string') {
        const createdAt = new Date(notification.createdAt).getTime();
        
        if (createdAt < thirtyDaysAgo) {
          // Remove from user's notification list first
          const userId = notification.userId;
          if (userId && typeof userId === 'string') {
            await redis.srem(`user:${userId}:notifications`, key.replace('notification:', ''));
          }
          
          // Then delete the notification
          await redis.del(key);
          oldNotifications++;
          console.log(`  ✅ Deleted old notification: ${key}`);
        }
      }
    }
    
    console.log(`🗑️  Removed ${oldNotifications} old notifications (>30 days)`);
    
    // 3. Clean up orphaned notification references
    console.log("\n🔍 Cleaning up orphaned notification references...");
    const userKeys = await redis.keys("user:*:notifications");
    let orphanedRefs = 0;
    
    for (const userKey of userKeys) {
      const notificationIds = await redis.smembers(userKey);
      
      for (const notificationId of notificationIds) {
        const notificationExists = await redis.exists(`notification:${notificationId}`);
        
        if (!notificationExists) {
          await redis.srem(userKey, notificationId);
          orphanedRefs++;
          console.log(`  ✅ Removed orphaned reference: ${notificationId} from ${userKey}`);
        }
      }
    }
    
    console.log(`🗑️  Removed ${orphanedRefs} orphaned notification references`);
    
    // 4. Final summary
    console.log("\n📊 Final Summary:");
    const finalStats = {
      totalKeys: (await redis.keys("*")).length,
      userKeys: (await redis.keys("user:*")).length,
      notificationKeys: (await redis.keys("notification:*")).length,
      verificationKeys: (await redis.keys("verification:*")).length,
    };
    
    console.log(`Total Keys: ${finalStats.totalKeys}`);
    console.log(`User Keys: ${finalStats.userKeys}`);
    console.log(`Notification Keys: ${finalStats.notificationKeys}`);
    console.log(`Verification Keys: ${finalStats.verificationKeys}`);
    
    console.log("\n✅ Cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  }
}

// Run the cleanup
cleanupRedisData().then(() => {
  console.log("\n🎉 Cleanup script finished");
  process.exit(0);
}).catch(error => {
  console.error("Cleanup failed:", error);
  process.exit(1);
});
