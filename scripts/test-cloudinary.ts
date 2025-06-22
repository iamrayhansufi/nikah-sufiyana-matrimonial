#!/usr/bin/env tsx

import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryConnection() {
  console.log('🧪 Testing Cloudinary Connection...\n');
  
  try {
    // Test the configuration
    console.log('📋 Configuration:');
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log('');
    
    // Test API connection by getting account details
    console.log('🔍 Testing API connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Connection successful!');
    console.log('📊 API Response:', result);
    
    // Test upload folder structure
    console.log('\n📁 Checking upload folders...');
    try {
      const folders = await cloudinary.api.root_folders();
      console.log('📂 Existing folders:', folders.folders.map((f: any) => f.name));
    } catch (folderError) {
      console.log('📂 No existing folders (this is normal for new accounts)');
    }
    
    console.log('\n🎉 Cloudinary is ready to use!');
    console.log('💡 You can now upload photos and they will be stored in Cloudinary');
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid API key')) {
        console.log('\n💡 Troubleshooting: Check your API key and secret in .env file');
      } else if (error.message.includes('cloud name')) {
        console.log('\n💡 Troubleshooting: Check your cloud name in .env file');
      } else {
        console.log('\n💡 Troubleshooting: Verify all Cloudinary credentials are correct');
      }
    }
  }
}

// Run the test
testCloudinaryConnection().catch(console.error);
