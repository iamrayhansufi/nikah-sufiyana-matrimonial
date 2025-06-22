#!/usr/bin/env tsx

import { redis } from '../lib/redis-client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface UserData {
  id?: string;
  fullName?: string;
  profilePhoto?: string;
  profilePhotos?: string | string[];
  photos?: string | string[];
  [key: string]: any;
}

async function debugUserPhotos() {
  try {
    console.log('🔍 Checking photo storage in Redis...\n');
    
    // Get user keys using Redis directly
    const userKeys = await redis.keys('user:*');
    console.log(`Found ${userKeys.length} users in database\n`);
    
    let usersWithPhotos = 0;
    
    for (const key of userKeys.slice(0, 5)) { // Check first 5 users
      const userData = await redis.hgetall(key) as UserData;
      
      if (userData && userData.fullName) {
        console.log(`👤 User: ${userData.fullName} (${key})`);
        
        // Check profilePhoto field
        if (userData.profilePhoto) {
          console.log(`   📷 Main Photo: ${userData.profilePhoto.substring(0, 50)}${userData.profilePhoto.length > 50 ? '...' : ''}`);
        }
        
        // Check profilePhotos field
        if (userData.profilePhotos) {
          try {
            const photosArray = typeof userData.profilePhotos === 'string' 
              ? JSON.parse(userData.profilePhotos) 
              : userData.profilePhotos;
            
            if (Array.isArray(photosArray) && photosArray.length > 0) {
              console.log(`   🖼️  Gallery: ${photosArray.length} photos`);
              photosArray.forEach((photo, index) => {
                console.log(`      ${index + 1}. ${photo.substring(0, 50)}${photo.length > 50 ? '...' : ''}`);
              });
              usersWithPhotos++;
            }
          } catch (e) {
            console.log(`   ❌ Error parsing profilePhotos: ${e}`);
          }
        }
        
        // Check photos field (alternative field name)
        if (userData.photos) {
          try {
            const photosArray = typeof userData.photos === 'string' 
              ? JSON.parse(userData.photos) 
              : userData.photos;
            
            if (Array.isArray(photosArray) && photosArray.length > 0) {
              console.log(`   📸 Photos field: ${photosArray.length} photos`);
            }
          } catch (e) {
            console.log(`   ❌ Error parsing photos: ${e}`);
          }
        }
        
        if (!userData.profilePhoto && !userData.profilePhotos && !userData.photos) {
          console.log(`   ❌ No photos found`);
        }
        
        console.log(''); // Empty line for readability
      }
    }
    
    console.log(`\n📊 Summary: ${usersWithPhotos} out of ${Math.min(userKeys.length, 5)} users have photos`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the debug function
debugUserPhotos().catch(console.error);
