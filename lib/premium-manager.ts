import { redis } from './redis-client';

interface PremiumUser {
  id: string;
  email: string;
  fullName: string;
  premium: string | boolean;
  premiumExpiry?: string;
  premiumPlan?: string;
  [key: string]: any;
}

/**
 * Check and update expired premium users
 * This should be run periodically (e.g., daily via cron job)
 */
export async function checkPremiumExpiry(): Promise<{
  checked: number;
  expired: number;
  updated: string[];
}> {
  console.log('🔍 Starting premium expiry check...');
  
  const now = new Date();
  let checkedCount = 0;
  let expiredCount = 0;
  const updatedUsers: string[] = [];

  try {
    // Get all user keys
    const userKeys = await redis.keys('user:*');
    
    for (const userKey of userKeys) {
      const user = await redis.hgetall(userKey) as PremiumUser;
      
      if (!user || !user.id) continue;
      
      checkedCount++;
      
      // Check if user has premium access
      const hasPremium = user.premium === 'true' || user.premium === true;
      
      if (hasPremium && user.premiumExpiry) {
        const expiryDate = new Date(user.premiumExpiry);
        
        // Check if premium has expired
        if (expiryDate <= now) {
          expiredCount++;
          
          // Update user to remove premium access
          await redis.hmset(userKey, {
            premium: 'false',
            premiumPlan: '',
            premiumExpiredAt: now.toISOString(),
            updatedAt: now.toISOString(),
          });
          
          updatedUsers.push(user.email || user.id);
          
          // Create notification for user
          const notificationId = `notification:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`;
          await redis.hmset(notificationId, {
            userId: user.id,
            type: 'premium_expired',
            title: 'Premium Access Expired',
            message: 'Your premium access has expired. Upgrade to continue enjoying premium features.',
            read: 'false',
            createdAt: now.toISOString(),
            metadata: JSON.stringify({
              expiredPlan: user.premiumPlan || 'premium',
              expiredAt: user.premiumExpiry,
            }),
          });
          
          await redis.lpush(`notifications:${user.id}`, notificationId);
          
          console.log(`⏰ Premium expired for user: ${user.email || user.id}`);
        }
      }
    }
    
    console.log(`✅ Premium expiry check complete: ${checkedCount} checked, ${expiredCount} expired`);
    
    return {
      checked: checkedCount,
      expired: expiredCount,
      updated: updatedUsers,
    };
    
  } catch (error) {
    console.error('❌ Error during premium expiry check:', error);
    throw error;
  }
}

/**
 * Get premium status for a user with expiry validation
 */
export async function getUserPremiumStatus(userId: string): Promise<{
  isPremium: boolean;
  plan?: string;
  expiryDate?: Date;
  daysRemaining?: number;
  isExpired: boolean;
}> {
  const userKey = userId.startsWith('user:') ? userId : `user:${userId}`;
  const user = await redis.hgetall(userKey) as PremiumUser;
  
  if (!user || !user.id) {
    return { isPremium: false, isExpired: false };
  }
  
  const hasPremium = user.premium === 'true' || user.premium === true;
  
  if (!hasPremium) {
    return { isPremium: false, isExpired: false };
  }
  
  if (!user.premiumExpiry) {
    // Premium without expiry (lifetime or manual assignment)
    return {
      isPremium: true,
      plan: user.premiumPlan || 'premium',
      isExpired: false,
    };
  }
  
  const expiryDate = new Date(user.premiumExpiry);
  const now = new Date();
  const isExpired = expiryDate <= now;
  
  if (isExpired) {
    // Auto-revoke expired premium
    await redis.hmset(userKey, {
      premium: 'false',
      premiumPlan: '',
      premiumExpiredAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    
    return { isPremium: false, isExpired: true };
  }
  
  const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    isPremium: true,
    plan: user.premiumPlan || 'premium',
    expiryDate,
    daysRemaining,
    isExpired: false,
  };
}

/**
 * Get premium statistics for admin dashboard
 */
export async function getPremiumStats(): Promise<{
  totalPremium: number;
  activePremium: number;
  expiredPremium: number;
  expiringThisWeek: number;
  planBreakdown: Record<string, number>;
}> {
  const userKeys = await redis.keys('user:*');
  
  let totalPremium = 0;
  let activePremium = 0;
  let expiredPremium = 0;
  let expiringThisWeek = 0;
  const planBreakdown: Record<string, number> = {};
  
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  for (const userKey of userKeys) {
    const user = await redis.hgetall(userKey) as PremiumUser;
    
    if (!user || !user.id) continue;
    
    const hasPremium = user.premium === 'true' || user.premium === true;
    
    if (hasPremium) {
      totalPremium++;
      
      const plan = user.premiumPlan || 'premium';
      planBreakdown[plan] = (planBreakdown[plan] || 0) + 1;
      
      if (user.premiumExpiry) {
        const expiryDate = new Date(user.premiumExpiry);
        
        if (expiryDate <= now) {
          expiredPremium++;
        } else {
          activePremium++;
          
          if (expiryDate <= oneWeekFromNow) {
            expiringThisWeek++;
          }
        }
      } else {
        activePremium++;
      }
    }
  }
  
  return {
    totalPremium,
    activePremium,
    expiredPremium,
    expiringThisWeek,
    planBreakdown,
  };
}

/**
 * Send premium expiry warnings to users (7 days, 3 days, 1 day before expiry)
 */
export async function sendPremiumExpiryWarnings(): Promise<{
  sent: number;
  errors: string[];
}> {
  const userKeys = await redis.keys('user:*');
  const now = new Date();
  const warningDays = [7, 3, 1]; // Days before expiry to send warnings
  
  let sentCount = 0;
  const errors: string[] = [];
  
  for (const userKey of userKeys) {
    try {
      const user = await redis.hgetall(userKey) as PremiumUser;
      
      if (!user || !user.id) continue;
      
      const hasPremium = user.premium === 'true' || user.premium === true;
      
      if (hasPremium && user.premiumExpiry) {
        const expiryDate = new Date(user.premiumExpiry);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (warningDays.includes(daysUntilExpiry)) {
          // Check if we already sent a warning for this day
          const warningKey = `premium_warning:${user.id}:${daysUntilExpiry}`;
          const alreadySent = await redis.get(warningKey);
          
          if (!alreadySent) {
            // Create notification
            const notificationId = `notification:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`;
            await redis.hmset(notificationId, {
              userId: user.id,
              type: 'premium_expiry_warning',
              title: `Premium Expiring in ${daysUntilExpiry} Day${daysUntilExpiry === 1 ? '' : 's'}`,
              message: `Your premium access will expire on ${expiryDate.toLocaleDateString()}. Renew now to continue enjoying premium features.`,
              read: 'false',
              createdAt: now.toISOString(),
              metadata: JSON.stringify({
                daysRemaining: daysUntilExpiry,
                expiryDate: user.premiumExpiry,
                plan: user.premiumPlan || 'premium',
              }),
            });
            
            await redis.lpush(`notifications:${user.id}`, notificationId);
            
            // Mark warning as sent (expires after 2 days to prevent duplicates)
            await redis.setex(warningKey, 2 * 24 * 60 * 60, '1');
            
            sentCount++;
            console.log(`⚠️ Premium expiry warning sent to ${user.email || user.id} (${daysUntilExpiry} days)`);
          }
        }
      }
    } catch (error) {
      const errorMsg = `Failed to process user ${userKey}: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  }
  
  return { sent: sentCount, errors };
}
