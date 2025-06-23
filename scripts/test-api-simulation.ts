import { redis } from "@/lib/redis-client";

async function testAPISimulation() {
  console.log("🧪 Testing API deletion simulation with fixed logic...");
  
  const userId = "1750495215968-bkyhp1mtzhi";
  const userKey = `user:${userId}`;
  const photoToDelete = "/api/secure-image/test-photo-1750676585597";
  
  try {
    console.log("=== STEP 1: GET USER DATA ===");
    const user = await redis.hgetall(userKey);
    
    if (!user || !user.photos) {
      console.error("❌ User or photos not found");
      return;
    }
    
    console.log("📸 Current user.photos:", user.photos);
    console.log("📸 Type of user.photos:", typeof user.photos);
    console.log("📸 Is array?", Array.isArray(user.photos));
    
    console.log("=== STEP 2: PARSE PHOTOS ===");
    let photos: string[] = [];
    
    // Handle both string (JSON) and object (parsed) formats from Redis
    if (user.photos) {
      if (typeof user.photos === 'string') {
        try {
          photos = JSON.parse(user.photos);
          console.log("📸 Parsed photos from JSON string");
        } catch (error) {
          console.error("Error parsing photos JSON:", error);
          photos = [];
        }
      } else if (Array.isArray(user.photos)) {
        // Redis client already parsed it as an array
        photos = user.photos;
        console.log("📸 Using photos as pre-parsed array");
      } else {
        console.warn("Unexpected photos format:", typeof user.photos, user.photos);
        photos = [];
      }
    }
    
    console.log(`📸 Current photos before deletion:`, photos);
    console.log(`🗑️ Deleting photo:`, photoToDelete);

    const updatedPhotos = photos.filter(p => p !== photoToDelete);
    
    console.log(`📸 Updated photos after deletion:`, updatedPhotos);
    
    console.log("=== STEP 3: PREPARE UPDATE DATA ===");
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };

    // If the deleted photo was the main profile photo, update it
    if (user.profilePhoto === photoToDelete) {
      // Set the first remaining photo as the new profile photo, or empty if no photos left
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
      console.log("🚨 Updated main profile photo to:", updateData.profilePhoto);
    }
    
    console.log("💾 Update data to be saved:", updateData);
    
    console.log("=== STEP 4: PERFORM UPDATE ===");
    const hsetResult = await redis.hset(userKey, updateData);
    console.log("✅ HSET completed with result:", hsetResult);
    console.log("HSET result type:", typeof hsetResult);
    
    if (hsetResult === null || hsetResult === undefined) {
      console.error("❌ HSET returned null/undefined - operation may have failed");
      throw new Error("Redis HSET operation failed");
    }
    
    console.log("=== STEP 5: VERIFY UPDATE ===");
    // Add a small delay to ensure consistency
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const verifyUser = await redis.hgetall(userKey);
    let verifiedPhotos: string[] = [];
    
    if (verifyUser) {
      console.log("📸 Verified photos:", verifyUser.photos);
      console.log("📸 Verified photos type:", typeof verifyUser.photos);
      console.log("📸 Verified profilePhotos:", verifyUser.profilePhotos);
      console.log("📸 Verified profilePhoto:", verifyUser.profilePhoto);
      
      // Parse and validate the verified data
      try {
        if (Array.isArray(verifyUser.photos)) {
          verifiedPhotos = verifyUser.photos;
          console.log("✅ Using verified photos as pre-parsed array");
        } else if (typeof verifyUser.photos === 'string') {
          verifiedPhotos = JSON.parse(verifyUser.photos);
          console.log("✅ Parsed verified photos from JSON string");
        } else {
          console.warn("⚠️ Unexpected verified photos format:", typeof verifyUser.photos);
          verifiedPhotos = [];
        }
        
        console.log("📊 Verified photos count:", verifiedPhotos.length);
        console.log("📊 Expected photos count:", updatedPhotos.length);
        console.log("📊 Counts match?", verifiedPhotos.length === updatedPhotos.length);
        console.log("📊 Deleted photo still exists?", verifiedPhotos.includes(photoToDelete));
        
        if (verifiedPhotos.length !== updatedPhotos.length) {
          console.error("❌ Photo count mismatch after update!");
          throw new Error("Photo deletion verification failed - count mismatch");
        }
        
        if (verifiedPhotos.includes(photoToDelete)) {
          console.error("❌ Deleted photo still exists in verified data!");
          throw new Error("Photo deletion verification failed - photo still exists");
        }
        
        console.log("✅ Verification successful - photo was actually deleted");
        
        console.log("=== FINAL RESULT ===");
        console.log("🎉 Photo deletion completed successfully");
        console.log("📊 Final photo count:", verifiedPhotos.length);
        console.log("📸 Final photos:", verifiedPhotos);
        
      } catch (verifyError) {
        console.error("❌ Error during verification:", verifyError);
        throw new Error(`Photo deletion verification failed: ${verifyError}`);
      }
    } else {
      console.log("❌ Failed to verify update - user not found");
      throw new Error("Failed to verify photo deletion - user not found after update");
    }
    
  } catch (error) {
    console.error("❌ API simulation error:", error);
  }
}

testAPISimulation().catch(console.error);
