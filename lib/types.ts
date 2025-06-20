// Define the app's data types

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  gender?: 'male' | 'female';
  age?: number;
  country?: string;
  city?: string;
  location?: string;
  education?: string;
  profession?: string;
  sect?: string;
  motherTongue?: string | null;
  height?: string | null;
  complexion?: string | null;
  maritalStatus?: string;
  maritalStatusOther?: string;
  profilePhoto?: string;
  profilePhotos?: string[];
  aboutMe?: string;
  familyDetails?: string;
  role?: string;
  verified?: boolean;
  profileStatus?: string;
  subscription?: string;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Interest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  metadata?: string | Record<string, any>;
  createdAt: string;
}

export interface Shortlist {
  userId: string;
  targetUserId: string;
  createdAt: string;
}

export interface VerificationCode {
  id: string;
  email: string;
  code: string;
  purpose: 'registration' | 'password-reset';
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}
