import { redis } from "@/lib/redis-client";

async function debugRedisDataTypes() {
  console.log("🔍 Debug: Understanding Redis data types...");
  
  const userId = "1750495215968-bkyhp1mtzhi";
  const userKey = `user:${userId}`;
  
  try {
    // Get current data
    const user = await redis.hgetall(userKey);
    
    console.log("=== RAW REDIS DATA ===");
    console.log("user.photos:", user?.photos);
    console.log("Type:", typeof user?.photos);
    console.log("Is Array:", Array.isArray(user?.photos));
    console.log("Is String:", typeof user?.photos === 'string');
    
    if (user?.photos) {
      if (Array.isArray(user.photos)) {
        console.log("Array length:", user.photos.length);
        console.log("Array contents:", user.photos);
        
        // What happens when we stringify it?
        const stringified = JSON.stringify(user.photos);
        console.log("Stringified:", stringified);
        console.log("Stringified length:", stringified.length);
          // Are they the same?
        console.log("Are they the same (direct comparison)?", "Cannot compare array to string directly");
        console.log("Deep equal?", JSON.stringify(user.photos) === stringified);
        
        // This is why HSET returns 0 - we're trying to set the same value!
        console.log("\n🚨 THE PROBLEM:");
        console.log("Redis returns:", typeof user.photos, user.photos);
        console.log("We try to save:", typeof stringified, stringified);
        console.log("Redis thinks they're different (type mismatch):", typeof user.photos !== typeof stringified);
        console.log("But the actual data is the same, so HSET returns 0");
        
      } else if (typeof user.photos === 'string') {
        console.log("String value:", user.photos);
        console.log("String length:", user.photos.length);
        
        try {
          const parsed = JSON.parse(user.photos);
          console.log("Parsed:", parsed);
          console.log("Parsed type:", typeof parsed);
        } catch (e) {
          console.log("Parse error:", e);
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Debug error:", error);
  }
}

debugRedisDataTypes().catch(console.error);
