// Function to validate image dimensions
export const validateImageDimensions = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        // Check dimensions
        const withinMinDimensions = width >= 200 && height >= 200;
        const withinMaxDimensions = width <= 2000 && height <= 2000;
        const hasValidAspectRatio = Math.abs(width / height - 1) < 0.1; // Allow 10% deviation from square
        
        resolve(withinMinDimensions && withinMaxDimensions && hasValidAspectRatio);
      };
    };
  });
};

// Main image validation function
export const validateImage = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Check file size
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 5MB" };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: "Only JPG, PNG and WebP images are allowed" 
    };
  }

  // Check dimensions
  try {
    const validDimensions = await validateImageDimensions(file);
    if (!validDimensions) {
      return {
        valid: false,
        error: "Image must be square and between 200x200 and 2000x2000 pixels"
      };
    }
  } catch (err) {
    return {
      valid: false,
      error: "Failed to validate image dimensions"
    };
  }

  return { valid: true };
};

// Helper function to resize an image maintaining aspect ratio
export const resizeImage = async (
  file: File,
  maxDimension: number = 800
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.85 // Quality setting
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};
