/**
 * Premium Verification Utilities
 * Provides secure premium status checking with admin approval and expiry validation
 */

import { getUserPremiumStatus } from './premium-manager';

export interface PremiumStatus {
  isValid: boolean;
  plan?: string;
  expiryDate?: Date;
  daysRemaining?: number;
  adminApproved: boolean;
  displayBadge: boolean;
}

/**
 * Check if a user has valid premium status for UI display
 * This includes admin approval verification and expiry checks
 */
export async function getValidPremiumStatus(userId: string): Promise<PremiumStatus> {
  try {
    // Get premium status with expiry validation
    const premiumStatus = await getUserPremiumStatus(userId);
    
    // For now, we'll implement a simple check
    // In production, this should verify admin approval from a separate field
    const adminApproved = premiumStatus.isPremium && !premiumStatus.isExpired;
    
    return {
      isValid: premiumStatus.isPremium && !premiumStatus.isExpired && adminApproved,
      plan: premiumStatus.plan,
      expiryDate: premiumStatus.expiryDate,
      daysRemaining: premiumStatus.daysRemaining,
      adminApproved,
      displayBadge: premiumStatus.isPremium && !premiumStatus.isExpired && adminApproved
    };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return {
      isValid: false,
      adminApproved: false,
      displayBadge: false
    };
  }
}

/**
 * Client-side premium status validation
 * For use in components where we can't use async functions
 */
export function validatePremiumForDisplay(profile: any): boolean {
  // Strict validation - only show badge if all conditions are met
  if (!profile.premium) return false;
  
  // Check for admin approval field (should be added to user schema)
  if (profile.premiumAdminApproved === false) return false;
  
  // Check expiry
  if (profile.premiumExpiry) {
    const expiryDate = new Date(profile.premiumExpiry);
    const now = new Date();
    if (expiryDate <= now) return false;
  }
  
  // Check if premium was manually assigned by admin
  if (!profile.premiumApprovedBy) {
    // If no admin approval record, don't show badge
    return false;
  }
  
  return true;
}

/**
 * Get premium badge configuration
 */
export function getPremiumBadgeConfig(profile: any) {
  const isValidPremium = validatePremiumForDisplay(profile);
  
  if (!isValidPremium) {
    return null;
  }
  
  const plan = profile.premiumPlan || 'premium';
  
  const badgeConfigs = {
    'standard': {
      className: 'bg-blue-500 text-white',
      text: '⭐ Standard',
      icon: '⭐'
    },
    'premium': {
      className: 'bg-purple-500 text-white',
      text: '👑 Premium',
      icon: '👑'
    },
    'elite': {
      className: 'bg-gold-500 text-white',
      text: '💎 Elite',
      icon: '💎'
    }
  };
  
  return badgeConfigs[plan.toLowerCase() as keyof typeof badgeConfigs] || badgeConfigs.premium;
}
