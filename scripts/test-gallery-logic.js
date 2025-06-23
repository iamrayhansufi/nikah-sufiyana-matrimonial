// Test to simulate the gallery display logic
const profileData = {
  profilePhoto: '/api/secure-image/profile-1750495215968-bkyhp1mtzhi-1750669737748',
  profilePhotos: ['/api/secure-image/profile-1750495215968-bkyhp1mtzhi-1750669737748']
};

function isValidPhotoUrl(url) {
  if (!url) return false;
  return url.startsWith('/api/secure-image/') || url.startsWith('http') || url.startsWith('data:image/');
}

console.log('🔍 Simulating gallery display logic...\n');

// Simulate the fixed logic
let photosFromData = [];

if (profileData?.profilePhotos) {
  if (Array.isArray(profileData.profilePhotos)) {
    photosFromData = profileData.profilePhotos;
  }
}

// Filter out the main profile photo to avoid showing it twice
const mainProfilePhoto = profileData?.profilePhoto;
let galleryPhotos = photosFromData;

if (mainProfilePhoto) {
  galleryPhotos = photosFromData.filter(photo => photo !== mainProfilePhoto);
}

// Filter out invalid URLs
const validGalleryPhotos = galleryPhotos.filter(photo => 
  photo && isValidPhotoUrl(photo)
);

console.log('📊 Results:');
console.log('Profile data photos:', profileData.profilePhotos);
console.log('Main profile photo:', mainProfilePhoto);
console.log('Photos from data:', photosFromData);
console.log('Gallery photos (after filtering main):', galleryPhotos);
console.log('Valid gallery photos:', validGalleryPhotos);
console.log('Gallery photo count:', validGalleryPhotos.length);

if (validGalleryPhotos.length === 0) {
  console.log('✅ No duplicate photos will be shown in gallery!');
} else {
  console.log('❌ There are still photos in the gallery:', validGalleryPhotos);
}
