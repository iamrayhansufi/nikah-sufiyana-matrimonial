import { redis } from "../lib/redis-client";

async function checkUserDataStructure() {
  try {
    console.log("🔍 Checking User Data Structure in Redis");
    console.log("=".repeat(50));
    
    // Get a few sample users
    const userIds = await redis.smembers('users');
    console.log(`Found ${userIds.length} user IDs in the users set`);
      // Check the first few users
    for (let i = 0; i < Math.min(3, userIds.length); i++) {
      const userId = userIds[i];
      console.log(`\n--- User ${userId} ---`);
      
      const userData = await redis.hgetall(`user:${userId}`);
      if (!userData) {
        console.log("❌ No data found for this user");
        continue;
      }
      
      console.log("Available fields:", Object.keys(userData));
      console.log("Sample data:", {
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.fullName,
        profilePhoto: userData.profilePhoto || userData.image,
        verified: userData.verified,
        createdAt: userData.createdAt
      });
    }
    
    // Also check user keys that might not be in the users set
    const allUserKeys = await redis.keys("user:*");
    const nonSetUserKeys = allUserKeys.filter(key => 
      !key.includes(':') || key.split(':').length === 2
    );
    
    console.log(`\nFound ${nonSetUserKeys.length} direct user keys`);
      if (nonSetUserKeys.length > 0) {
      const sampleKey = nonSetUserKeys[0];
      console.log(`\n--- Sample from ${sampleKey} ---`);
      const userData = await redis.hgetall(sampleKey);
      if (!userData) {
        console.log("❌ No data found for this key");
      } else {
        console.log("Available fields:", Object.keys(userData));
        console.log("Sample data:", {
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.fullName,
          profilePhoto: userData.profilePhoto || userData.image || userData.photos,
          verified: userData.verified
        });
      }
    }
    
  } catch (error) {
    console.error("Error checking user data:", error);
  }
}

checkUserDataStructure().then(() => {
  console.log("\n✅ User data structure check complete");
  process.exit(0);
}).catch(error => {
  console.error("Check failed:", error);
  process.exit(1);
});
