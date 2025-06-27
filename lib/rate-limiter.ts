import { NextRequest } from 'next/server';
import { redis } from './redis-client';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
}

// Default configurations for different endpoints
export const rateLimitConfigs = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registration attempts per hour
  },
  otp: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 3, // 3 OTP requests per 5 minutes
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 API requests per minute
  },
} as const;

export class RateLimiter {
  private config: RateLimitConfig;
  private keyPrefix: string;

  constructor(config: RateLimitConfig, keyPrefix: string = 'rate_limit') {
    this.config = config;
    this.keyPrefix = keyPrefix;
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, email, etc.)
   * @returns Object with isLimited, remainingRequests, resetTime
   */
  async checkLimit(identifier: string): Promise<{
    isLimited: boolean;
    remainingRequests: number;
    resetTime: number;
    totalRequests: number;
  }> {
    const key = `${this.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Get current request count within the window using zcard and zremrangebyscore
      // First, clean up old entries
      await redis.zremrangebyscore(key, 0, windowStart - 1);
      
      // Get current count
      const currentRequests = await redis.zcard(key) || 0;
      const isLimited = currentRequests >= this.config.maxRequests;
      const remainingRequests = Math.max(0, this.config.maxRequests - currentRequests);
      
      // Calculate reset time (end of current window)
      const resetTime = windowStart + this.config.windowMs;

      if (!isLimited) {
        // Add current request to the window
        await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
        
        // Set expiration
        await redis.expire(key, Math.ceil(this.config.windowMs / 1000));
      }

      return {
        isLimited,
        remainingRequests: isLimited ? 0 : remainingRequests - 1,
        resetTime,
        totalRequests: currentRequests,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, allow the request (fail open)
      return {
        isLimited: false,
        remainingRequests: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
        totalRequests: 0,
      };
    }
  }

  /**
   * Reset rate limit for a specific identifier
   * @param identifier - Unique identifier to reset
   */
  async resetLimit(identifier: string): Promise<void> {
    const key = `${this.keyPrefix}:${identifier}`;
    await redis.del(key);
  }
}

/**
 * Get client identifier from request (IP address with fallbacks)
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (clientIp) {
    return clientIp;
  }
  
  // Fallback - use a hash of headers for identification
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const fingerprint = `${userAgent}-${acceptLanguage}`;
  
  return fingerprint.substring(0, 50) || 'unknown';
}

/**
 * Create rate limit response with proper headers
 */
export function createRateLimitResponse(
  message: string = 'Too many requests',
  remainingRequests: number = 0,
  resetTime: number = Date.now()
) {
  return new Response(
    JSON.stringify({
      error: message,
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': remainingRequests.toString(),
        'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
      },
    }
  );
}

/**
 * Middleware helper for rate limiting
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): Promise<Response | null> {
  const clientId = identifier || getClientIdentifier(request);
  const rateLimiter = new RateLimiter(config);
  
  const result = await rateLimiter.checkLimit(clientId);
  
  if (result.isLimited) {
    console.warn(`Rate limit exceeded for ${clientId}:`, {
      totalRequests: result.totalRequests,
      limit: config.maxRequests,
      windowMs: config.windowMs,
    });
    
    return createRateLimitResponse(
      'Too many requests. Please try again later.',
      result.remainingRequests,
      result.resetTime
    );
  }
  
  return null;
}

// Pre-configured rate limiters
export const authRateLimiter = new RateLimiter(rateLimitConfigs.auth, 'auth_limit');
export const registrationRateLimiter = new RateLimiter(rateLimitConfigs.registration, 'reg_limit');
export const otpRateLimiter = new RateLimiter(rateLimitConfigs.otp, 'otp_limit');
export const apiRateLimiter = new RateLimiter(rateLimitConfigs.api, 'api_limit');
