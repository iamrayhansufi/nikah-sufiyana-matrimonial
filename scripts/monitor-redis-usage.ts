import { redis } from "../lib/redis-client";

async function monitorRedisUsage() {
  console.log("🔍 Redis Usage Monitor");
  console.log("=".repeat(50));
  
  try {
    console.log("📊 Key Statistics:");
    
    // Count different types of keys
    const allKeys = await redis.keys("*");
    const userKeys = allKeys.filter(key => key.startsWith("user:"));
    const notificationKeys = allKeys.filter(key => key.startsWith("notification:"));
    const verificationKeys = allKeys.filter(key => key.startsWith("verification:"));
    const interestKeys = allKeys.filter(key => key.startsWith("interest:"));
    
    console.log(`Total Keys: ${allKeys.length}`);
    console.log(`User Keys: ${userKeys.length}`);
    console.log(`Notification Keys: ${notificationKeys.length}`);
    console.log(`Verification Keys: ${verificationKeys.length}`);
    console.log(`Interest Keys: ${interestKeys.length}`);
    
    console.log("\n🔄 Notification Structure Check:");
    
    // Sample some user notification keys to check structure
    const notificationUserKeys = userKeys.filter(key => key.includes(":notifications"));
    console.log(`Found ${notificationUserKeys.length} user notification keys`);
    
    for (const userKey of notificationUserKeys.slice(0, 5)) {
      try {
        const notificationIds = await redis.smembers(userKey);
        console.log(`${userKey}: ${notificationIds.length} notifications`);
      } catch (error) {
        console.log(`${userKey}: Error reading - ${error}`);
      }
    }
    
    console.log("\n💡 Optimization Suggestions:");
    if (notificationUserKeys.length > 10) {
      console.log("⚠️  Many notification keys found - consider cleanup of old notifications");
    }
    if (verificationKeys.length > 20) {
      console.log("⚠️  Many verification keys found - consider cleanup of expired OTPs");
    }
    
  } catch (error) {
    console.error("Error monitoring Redis:", error);
  }
}

// Run the monitor
monitorRedisUsage().then(() => {
  console.log("\n✅ Monitoring complete");
  process.exit(0);
}).catch(error => {
  console.error("Monitor failed:", error);
  process.exit(1);
});
