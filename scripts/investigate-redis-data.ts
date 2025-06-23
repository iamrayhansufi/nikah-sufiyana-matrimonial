import { redis } from "@/lib/redis-client";

async function investigateRedisData() {
  console.log("🔍 Investigating Redis data format...");
  
  const userId = "1750495215968-bkyhp1mtzhi";
  const userKey = `user:${userId}`;
  
  try {
    // Get raw data
    console.log("📡 Getting raw HGETALL data...");
    const user = await redis.hgetall(userKey);
      console.log("📄 Raw user.photos:", user?.photos);
    console.log("📄 Type of user.photos:", typeof user?.photos);
    console.log("📄 Is array?", Array.isArray(user?.photos));
    
    if (user?.photos) {
      const photosStr = user.photos as string;
      console.log("🔍 String length:", photosStr.length);
      console.log("🔍 First 100 chars:", photosStr.substring(0, 100));
      console.log("🔍 Last 100 chars:", photosStr.substring(photosStr.length - 100));
      
      // Try to parse it
      try {
        const parsed = JSON.parse(photosStr);
        console.log("✅ Successfully parsed:", parsed);
        console.log("📊 Parsed length:", parsed.length);
        
        // Now create the "updated" version
        const photoToDelete = "/api/secure-image/gallery-1750495215968-bkyhp1mtzhi-0-1750676149175";
        const filtered = parsed.filter((p: string) => p !== photoToDelete);
        console.log("🗑️ Filtered result:", filtered);
        console.log("📊 Filtered length:", filtered.length);
        
        const newJsonString = JSON.stringify(filtered);
        console.log("📝 New JSON string:", newJsonString);
        console.log("📊 New string length:", newJsonString.length);        
        // Check if they're the same
        console.log("🔍 Are they the same?", photosStr === newJsonString);
        
      } catch (parseError) {
        console.error("❌ Parse error:", parseError);
      }
    }
    
  } catch (error) {
    console.error("❌ Investigation error:", error);
  }
}

investigateRedisData().catch(console.error);
