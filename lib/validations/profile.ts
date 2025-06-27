import { z } from "zod"

// Regular expressions for validation
const PHONE_REGEX = /^[+]?[\d\s-]{10,}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Basic Info Schema
export const basicInfoSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  age: z.string().transform(Number).pipe(
    z.number().min(18, "Must be at least 18 years old").max(80, "Age seems incorrect")
  ),
  email: z.string().email("Invalid email address").regex(EMAIL_REGEX).optional(),
  phone: z.string().regex(PHONE_REGEX, "Invalid phone number format"),
  gender: z.enum(["male", "female"]),
  height: z.string().min(2, "Height is required"),
  weight: z.string().optional(),
  complexion: z.string().optional(),
  maritalStatus: z.enum(["never-married", "divorced", "widowed", "any"]),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
})

// Religious Info Schema
export const religiousInfoSchema = z.object({
  sect: z.enum(["Sunni", "Shia", "Other", "No Preference"]),
  prayerHabit: z.enum(["regular", "sometimes", "rarely", "never"]),
  hijab: z.enum(["always", "sometimes", "no"]).optional(),
  quranReading: z.enum(["fluent", "learning", "basic", "no"]),
  islamicEducation: z.string().optional(),
  religiousValues: z.string().optional(),
  attendsMosque: z.enum(["regularly", "sometimes", "rarely", "never"]).optional(),
})

// Education & Career Schema
export const educationCareerSchema = z.object({
  education: z.string().min(2, "Education details are required"),
  university: z.string().optional(),
  profession: z.string().min(2, "Profession is required"),
  company: z.string().optional(),
  experience: z.string().optional(),
  income: z.string().optional(),
})

// Family Info Schema
export const familyInfoSchema = z.object({
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyType: z.enum(["joint", "nuclear"]).optional(),
  familyValues: z.string().optional(),
  livingWithParents: z.boolean().optional(),
})

// Partner Preferences Schema
export const partnerPreferencesSchema = z.object({
  ageRange: z.string(),
  heightRange: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  location: z.string().min(2, "Preferred location is required"),
  sect: z.string().optional(),
  religiosity: z.string().optional(),
  expectations: z.string().optional(),
})

// Privacy Settings Schema
export const privacySettingsSchema = z.object({
  showContactInfo: z.boolean(),
  showPhotoToAll: z.boolean(),
  profileVisibility: z.enum(["all-members", "premium-only", "match-criteria"]),
  allowInterests: z.boolean(),
})

// Image Validation
export const imageValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  minDimensions: { width: 200, height: 200 },
  maxDimensions: { width: 2000, height: 2000 },
  aspectRatio: 1, // Square images
}

// Complete Profile Schema
export const profileSchema = z.object({
  basicInfo: basicInfoSchema,
  religiousInfo: religiousInfoSchema,
  educationCareer: educationCareerSchema,
  familyInfo: familyInfoSchema,
  partnerPreferences: partnerPreferencesSchema,
  privacySettings: privacySettingsSchema,
})

// Validation Error Type
export type ValidationError = {
  path: string[]
  message: string
}
