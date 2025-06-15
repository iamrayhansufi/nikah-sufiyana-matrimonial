import { pgTable, serial, varchar, timestamp, text, integer, boolean, decimal, json } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  age: integer('age').notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: varchar('address', { length: 255 }),
  location: varchar('location', { length: 255 }).notNull(),
  education: varchar('education', { length: 255 }).notNull(),
  educationDetails: varchar('education_details', { length: 255 }),
  profession: varchar('profession', { length: 255 }),
  jobTitle: varchar('job_title', { length: 255 }),
  income: varchar('income', { length: 100 }),
  sect: varchar('sect', { length: 100 }).notNull(),
  motherTongue: varchar('mother_tongue', { length: 100 }).notNull(),
  height: varchar('height', { length: 20 }).notNull(),
  complexion: varchar('complexion', { length: 50 }),
  maritalStatus: varchar('marital_status', { length: 50 }),
  maritalStatusOther: varchar('marital_status_other', { length: 100 }),
  profileStatus: varchar('profile_status', { length: 20 }).notNull().default('approved'),
  subscription: varchar('subscription', { length: 20 }).notNull().default('free'),
  subscriptionExpiry: timestamp('subscription_expiry'),
  profilePhoto: text('profile_photo'),
  lastActive: timestamp('last_active').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // Additional profile fields
  religiousInclination: text('religious_inclination'),
  expectations: text('expectations'),
  aboutMe: text('about_me'),
  familyDetails: text('family_details'),
  fatherName: varchar('father_name', { length: 255 }),
  motherName: varchar('mother_name', { length: 255 }),
  housingStatus: varchar('housing_status', { length: 100 }),
  
  // JSON fields for complex data
  siblings: json('siblings'),
  brotherInLaws: json('brother_in_laws'),
  maternalPaternal: json('maternal_paternal'),
  
  // Partner preferences
  preferredAgeMin: integer('preferred_age_min'),
  preferredAgeMax: integer('preferred_age_max'),
  preferredEducation: varchar('preferred_education', { length: 255 }),
  preferredLocation: varchar('preferred_location', { length: 255 }),
  preferredOccupation: varchar('preferred_occupation', { length: 255 }),
  preferredHeight: varchar('preferred_height', { length: 100 }),
  preferredComplexion: varchar('preferred_complexion', { length: 100 }),
  preferredMaslak: varchar('preferred_maslak', { length: 100 }),
  
  // Privacy settings
  showContactInfo: boolean('show_contact_info').default(true),
  showPhotos: boolean('show_photos').default(true),
  hideProfile: boolean('hide_profile').default(false),
  showOnlineStatus: boolean('show_online_status').default(true),
  showFatherNumber: boolean('show_father_number').default(false),
  showMotherNumber: boolean('show_mother_number').default(false),
  mobileNumber: varchar('mobile_number', { length: 20 }),
  
  // Admin action fields
  approvedAt: timestamp('approved_at'),
  approvedBy: varchar('approved_by', { length: 255 }),
  rejectedAt: timestamp('rejected_at'),
  rejectedBy: varchar('rejected_by', { length: 255 }),
  suspendedAt: timestamp('suspended_at'),
  suspendedBy: varchar('suspended_by', { length: 255 }),
  premium: boolean('premium').notNull().default(false),
});

export const paymentOrders = pgTable('payment_orders', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().unique(),
  userId: integer('user_id').notNull(),
  planType: varchar('plan_type', { length: 50 }).notNull(),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('created'),
  paymentId: varchar('payment_id', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull(),
  receiverId: integer('receiver_id').notNull(),
  content: text('content').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const subscriptionPlans = pgTable('subscription_plans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration_days').notNull(), // in days
  features: text('features').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const subscriptionHistory = pgTable('subscription_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  planId: integer('plan_id').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  paymentId: varchar('payment_id', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userReports = pgTable('user_reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id').notNull(),
  reportedUserId: integer('reported_user_id').notNull(),
  reason: varchar('reason', { length: 100 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  reviewedBy: integer('reviewed_by'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  action: varchar('action', { length: 50 }), // block, warn, dismiss
});

export const blockedUsers = pgTable('blocked_users', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  blockedUserId: integer('blocked_user_id').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const interests = pgTable('interests', {
  id: serial('id').primaryKey(),
  fromUserId: integer('from_user_id').notNull(),
  toUserId: integer('to_user_id').notNull(),
  message: text('message'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, accepted, declined
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const shortlist = pgTable('shortlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  shortlistedUserId: integer('shortlisted_user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});