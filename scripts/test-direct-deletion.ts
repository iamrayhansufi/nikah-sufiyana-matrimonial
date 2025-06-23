import { redis } from "@/lib/redis-client";

async function testDirectDeletion() {
  console.log("🧪 Testing direct Redis deletion logic...");
  
  const userId = "1750495215968-bkyhp1mtzhi";
  const userKey = `user:${userId}`;
  const photoToDelete = "/api/secure-image/gallery-1750495215968-bkyhp1mtzhi-0-1750676149175";
  
  try {
    // Get current user data
    console.log("🔍 Fetching user data...");
    const user = await redis.hgetall(userKey);
    
    if (!user || !user.photos) {
      console.error("❌ User or photos not found");
      return;
    }
    
    console.log("📸 Current photos:", user.photos);
    
    // Parse current photos
    let photos: string[] = [];
    if (typeof user.photos === 'string') {
      photos = JSON.parse(user.photos);
    } else if (Array.isArray(user.photos)) {
      photos = user.photos;
    }
    
    console.log("📸 Parsed photos:", photos);
    console.log("🗑️ Photo to delete:", photoToDelete);
    
    // Filter out the photo
    const updatedPhotos = photos.filter(p => p !== photoToDelete);
    console.log("📸 Updated photos:", updatedPhotos);
    
    // Update data
    const updateData = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    
    console.log("💾 Update data:", updateData);
    
    // Perform the update
    console.log("🔄 Performing HSET...");
    const hsetResult = await redis.hset(userKey, updateData);
    console.log("✅ HSET result:", hsetResult);
    
    // Wait and verify
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("✅ Verifying update...");
    const verifyUser = await redis.hgetall(userKey);
    console.log("📸 Verified photos:", verifyUser?.photos);
      if (verifyUser?.photos) {
      let verifiedPhotos: string[] = [];
      
      if (typeof verifyUser.photos === 'string') {
        verifiedPhotos = JSON.parse(verifyUser.photos);
      } else if (Array.isArray(verifyUser.photos)) {
        verifiedPhotos = verifyUser.photos;
      }
      
      console.log("📊 Verified count:", verifiedPhotos.length);
      console.log("📊 Expected count:", updatedPhotos.length);
      console.log("📊 Still contains deleted photo?", verifiedPhotos.includes(photoToDelete));
    }
    
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

testDirectDeletion().catch(console.error);
