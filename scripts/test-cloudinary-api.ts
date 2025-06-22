/**
 * Direct Cloudinary upload test in Next.js API context
 * This test runs in the same environment as the actual API routes
 */

// Load environment variables from .env files
import { config } from 'dotenv';
import path from 'path';

// Load .env.local first (highest priority), then .env
config({ path: path.join(process.cwd(), '.env.local') });
config({ path: path.join(process.cwd(), '.env') });

import { uploadProfilePhoto } from '../lib/cloudinary-service';
import fs from 'fs';

async function testCloudinaryUpload() {
  console.log('🧪 Testing Cloudinary upload in Next.js API context...');
  
  try {
    // Check if environment variables are loaded
    console.log('🔧 Environment variables:');
    console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
    
    // Create a simple test image buffer (1x1 PNG)
    // This is a minimal valid PNG file
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // width=1, height=1
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0xD5, 0xEF, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, // IEND chunk
      0x42, 0x60, 0x82
    ]);
    
    console.log('📷 Created test PNG buffer, size:', pngBuffer.length, 'bytes');
    
    // Test upload
    const result = await uploadProfilePhoto(pngBuffer, 'test-user-123');
    
    console.log('✅ Upload successful!');
    console.log('   Public ID:', result.public_id);
    console.log('   Secure URL:', result.secure_url);
    console.log('   Size:', result.width, 'x', result.height);
    console.log('   Format:', result.format);
    
    return result;
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Stack:', error.stack);
    }
    throw error;
  }
}

if (require.main === module) {
  testCloudinaryUpload()
    .then(() => {
      console.log('🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

export { testCloudinaryUpload };
