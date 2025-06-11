import { z } from "zod";

// Validation schemas for different sections
export const basicInfoSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  age: z.string().transform(Number).pipe(
    z.number().min(18, "Must be at least 18 years old").max(80, "Age seems incorrect")
  ),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Invalid phone number format"),
  height: z.string().optional(),
  complexion: z.string().optional(),
  maritalStatus: z.string(),
  city: z.string().min(2, "City is required"),
  bio: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export const religiousInfoSchema = z.object({
  sect: z.string(),
  prayerHabit: z.string(),
  hijab: z.string(),
  quranReading: z.string(),
});

export const educationCareerSchema = z.object({
  education: z.string(),
  university: z.string().optional(),
  profession: z.string(),
  company: z.string().optional(),
  experience: z.string().optional(),
  income: z.string(),
});

export const familyInfoSchema = z.object({
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyType: z.string(),
  familyValues: z.string().optional(),
});

export const partnerPreferencesSchema = z.object({
  ageRange: z.string().regex(/^\d{2}-\d{2}$/, "Age range must be in format: 25-35"),
  heightRange: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  sect: z.string(),
  expectations: z.string().optional(),
});

// Image validation
export const validateImageDimensions = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const minWidth = 400;
      const minHeight = 400;
      resolve(img.width >= minWidth && img.height >= minHeight);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(false);
    };
  });
};

export const validateImage = async (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image');
  }
  
  if (file.size > maxSize) {
    throw new Error('Image size should be less than 5MB');
  }
  
  const validDimensions = await validateImageDimensions(file);
  if (!validDimensions) {
    throw new Error('Image dimensions should be at least 400x400 pixels');
  }
  
  return true;
};
