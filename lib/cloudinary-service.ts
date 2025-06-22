/**
 * Cloudinary service for image upload and management
 * Handles image uploads, optimization, and URL generation
 */

import { v2 as cloudinary } from 'cloudinary';

// Ensure environment variables are loaded
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Debug environment variables
console.log('🔧 Cloudinary Config Debug:');
console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Missing Cloudinary environment variables!');
  console.error('   Please check your .env file contains:');
  console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.error('   CLOUDINARY_API_KEY=your_api_key');
  console.error('   CLOUDINARY_API_SECRET=your_api_secret');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
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
}

/**
 * Upload image buffer to Cloudinary
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
          console.log('Cloudinary upload successful:', result.public_id);
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Upload profile photo to Cloudinary
 */
export const uploadProfilePhoto = async (
  fileBuffer: Buffer,
  userId: string
): Promise<CloudinaryUploadResult> => {
  const fileName = `profile-${userId}-${Date.now()}`;
  return uploadToCloudinary(fileBuffer, fileName, {
    folder: 'matrimonial-profiles',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Square crop focused on face
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
};

/**
 * Upload gallery photo to Cloudinary
 */
export const uploadGalleryPhoto = async (
  fileBuffer: Buffer,
  userId: string,
  index: number
): Promise<CloudinaryUploadResult> => {
  const fileName = `gallery-${userId}-${index}-${Date.now()}`;
  return uploadToCloudinary(fileBuffer, fileName, {
    folder: 'matrimonial-gallery',
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
  isCloudinaryUrl
};
