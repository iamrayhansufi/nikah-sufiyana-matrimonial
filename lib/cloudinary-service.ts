/**
 * Cloudinary service for image upload and management
 * Handles image uploads, optimization, and URL generation
 */

import { v2 as cloudinary } from 'cloudinary';

// Ensure environment variables are loaded with fallback to env object
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

// For production deployments, hard-code the values if they're missing
// This is a fallback mechanism for Vercel deployments where env vars might not load correctly
const FALLBACK_CLOUD_NAME = 'nikahsufiyana';  // Update this to match your actual cloud name
const FALLBACK_API_KEY = '223722368374864';   // Update this to your actual API key
const FALLBACK_API_SECRET = 'z075NYAKlJfEt2WESzLaQtC1oyk';  // Update this to your actual API secret

const finalCloudName = cloudName || FALLBACK_CLOUD_NAME;
const finalApiKey = apiKey || FALLBACK_API_KEY;
const finalApiSecret = apiSecret || FALLBACK_API_SECRET;

// Debug environment variables
console.log('🔧 Cloudinary Config Debug:');
console.log('  CLOUDINARY_CLOUD_NAME:', finalCloudName ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_API_KEY:', finalApiKey ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_API_SECRET:', finalApiSecret ? '✅ Set' : '❌ Missing');

if (!finalCloudName || !finalApiKey || !finalApiSecret) {
  console.error('❌ Missing Cloudinary environment variables even after fallback!');
  console.error('   Please check your .env file contains:');
  console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.error('   CLOUDINARY_API_KEY=your_api_key');
  console.error('   CLOUDINARY_API_SECRET=your_api_secret');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: finalCloudName,
  api_key: finalApiKey,
  api_secret: finalApiSecret,
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

interface UploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  quality?: string;
  transformation?: any[];
  type?: string; // 'upload' | 'private' | 'authenticated'
  access_mode?: string; // 'public' | 'authenticated'
}

/**
 * Upload image buffer to Cloudinary with privacy controls
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  const defaultOptions = {
    folder: 'matrimonial-photos',
    public_id: fileName,
    overwrite: true,
    quality: 'auto:good', // Automatic quality optimization
    fetch_format: 'auto', // Automatic format selection (WebP, AVIF)
    type: 'private', // 🔒 Make all uploads private by default
    access_mode: 'authenticated', // 🔐 Require authentication to access
    ...options
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...defaultOptions,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          console.log('Cloudinary private upload successful:', result.public_id);
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Generate signed URL for private image access
 */
export const generateSignedUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    expiresIn?: number; // seconds
  } = {}
): string => {
  const expiresAt = Math.floor(Date.now() / 1000) + (options.expiresIn || 3600); // Default 1 hour
  
  return cloudinary.url(publicId, {
    type: 'private',
    sign_url: true,
    expires_at: expiresAt,
    crop: options.crop || 'fill',
    quality: options.quality || 'auto:good',
    fetch_format: options.format || 'auto',
    width: options.width,
    height: options.height,
  });
};

/**
 * Check if user can access another user's photos based on matrimonial rules
 */
export const canAccessUserPhotos = async (
  viewerUserId: string, 
  photoOwnerUserId: string, 
  photoType: 'profile' | 'gallery' = 'profile'
): Promise<boolean> => {
  // Import the user connection service dynamically to avoid circular dependencies
  const { canAccessUserPhotos: checkAccess } = await import('./user-connections');
  return checkAccess(viewerUserId, photoOwnerUserId, photoType);
};

/**
 * Check if two users are connected (matched, interested, etc.)
 */
const checkUserConnection = async (user1: string, user2: string): Promise<boolean> => {
  // Import the user connection service dynamically
  const { areUsersConnected } = await import('./user-connections');
  return areUsersConnected(user1, user2);
};

/**
 * Upload profile photo to Cloudinary (private)
 */
export const uploadProfilePhoto = async (
  fileBuffer: Buffer,
  userId: string
): Promise<CloudinaryUploadResult> => {
  // Ensure Cloudinary is configured before upload
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
  
  console.log('🔧 Pre-upload config check:');
  console.log('  cloud_name:', config.cloud_name ? '✅' : '❌');
  console.log('  api_key:', config.api_key ? '✅' : '❌');
  console.log('  api_secret:', config.api_secret ? '✅' : '❌');
  
  // Re-configure Cloudinary just before upload to ensure it has the right values
  cloudinary.config(config);
  
  const fileName = `profile-${userId}-${Date.now()}`;
  return uploadToCloudinary(fileBuffer, fileName, {
    folder: 'matrimonial-profiles',
    type: 'private', // 🔒 Private profile photos
    access_mode: 'authenticated',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Square crop focused on face
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
};

/**
 * Upload gallery photo to Cloudinary (private)
 */
export const uploadGalleryPhoto = async (
  fileBuffer: Buffer,
  userId: string,
  index: number
): Promise<CloudinaryUploadResult> => {
  const fileName = `gallery-${userId}-${index}-${Date.now()}`;
  return uploadToCloudinary(fileBuffer, fileName, {
    folder: 'matrimonial-gallery',
    type: 'private', // 🔒 Private gallery photos
    access_mode: 'authenticated',
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Limit size while maintaining aspect ratio
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Generate optimized image URL
 */
export const getOptimizedImageUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string => {
  return cloudinary.url(publicId, {
    crop: options.crop || 'fill',
    quality: options.quality || 'auto:good',
    fetch_format: options.format || 'auto',
    width: options.width,
    height: options.height,
  });
};

/**
 * Extract public ID from Cloudinary URL
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URLs follow this pattern:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

/**
 * Check if URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

export default {
  uploadToCloudinary,
  uploadProfilePhoto,
  uploadGalleryPhoto,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  getPublicIdFromUrl,
  isCloudinaryUrl,
  generateSignedUrl,
  canAccessUserPhotos
};
