/**
 * Premium Badge Component with Admin Verification
 * Only displays premium badges for admin-approved users with valid subscriptions
 */

import { Badge } from "@/components/ui/badge"
import { validatePremiumForDisplay, getPremiumBadgeConfig } from "@/lib/premium-verification"

interface PremiumBadgeProps {
  profile: any;
  className?: string;
}

export function PremiumBadge({ profile, className = "" }: PremiumBadgeProps) {
  // Strict validation - only show badge if admin approved and not expired
  const isValidPremium = validatePremiumForDisplay(profile);
  
  if (!isValidPremium) {
    return null;
  }
  
  const badgeConfig = getPremiumBadgeConfig(profile);
  
  if (!badgeConfig) {
    return null;
  }
  
  return (
    <Badge className={`${badgeConfig.className} ${className}`}>
      {badgeConfig.text}
    </Badge>
  );
}

// Utility function to check if premium badge should be shown
export function shouldShowPremiumBadge(profile: any): boolean {
  return validatePremiumForDisplay(profile);
}
