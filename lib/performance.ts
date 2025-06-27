import { NextRequest, NextResponse } from 'next/server';

/**
 * Performance monitoring middleware
 * Measures API response times and logs slow requests
 */
export function performanceMiddleware() {
  return async (request: NextRequest, handler: Function) => {
    const startTime = Date.now();
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    try {
      // Execute the actual API handler
      const response = await handler(request);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Log performance metrics
      logPerformanceMetrics({
        method,
        pathname,
        responseTime,
        status: response.status || 200,
        success: true,
      });
      
      // Add performance headers
      if (response instanceof NextResponse) {
        response.headers.set('X-Response-Time', `${responseTime}ms`);
        response.headers.set('X-Timestamp', new Date().toISOString());
      }
      
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Log error with performance data
      logPerformanceMetrics({
        method,
        pathname,
        responseTime,
        status: 500,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  };
}

interface PerformanceMetrics {
  method: string;
  pathname: string;
  responseTime: number;
  status: number;
  success: boolean;
  error?: string;
}

function logPerformanceMetrics(metrics: PerformanceMetrics) {
  const { method, pathname, responseTime, status, success, error } = metrics;
  
  // Define slow request threshold (500ms)
  const SLOW_REQUEST_THRESHOLD = 500;
  
  // Log level based on response time and success
  const isSlowRequest = responseTime > SLOW_REQUEST_THRESHOLD;
  const logLevel = !success ? 'error' : isSlowRequest ? 'warn' : 'info';
  
  const logMessage = `${method} ${pathname} - ${responseTime}ms - ${status}`;
  
  const logData = {
    method,
    pathname,
    responseTime,
    status,
    success,
    ...(error && { error }),
    timestamp: new Date().toISOString(),
  };
  
  switch (logLevel) {
    case 'error':
      console.error(`🚨 API Error: ${logMessage}`, logData);
      break;
    case 'warn':
      console.warn(`⚠️ Slow Request: ${logMessage}`, logData);
      break;
    default:
      // Only log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API: ${logMessage}`);
      }
      break;
  }
  
  // Log performance warnings for specific thresholds
  if (responseTime > 1000) {
    console.warn(`🐌 Very slow request detected: ${pathname} took ${responseTime}ms`);
  }
  
  if (responseTime > 2000) {
    console.error(`🚨 Extremely slow request: ${pathname} took ${responseTime}ms - Consider optimization!`);
  }
}

/**
 * Simple caching utility for API responses
 */
interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string; // Custom cache key
}

const cache = new Map<string, { data: any; expires: number }>();

export function withCache<T>(
  handler: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 300, key } = options; // Default 5 minutes
  const cacheKey = key || `cache_${Date.now()}_${Math.random()}`;
  
  // Check if we have cached data that hasn't expired
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    console.log(`🚀 Cache hit for key: ${cacheKey}`);
    return Promise.resolve(cached.data);
  }
  
  // Execute handler and cache result
  return handler().then((data) => {
    cache.set(cacheKey, {
      data,
      expires: Date.now() + (ttl * 1000),
    });
    
    console.log(`💾 Cached data for key: ${cacheKey} (TTL: ${ttl}s)`);
    return data;
  });
}

/**
 * Clean up expired cache entries
 */
export function cleanupCache() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (value.expires <= now) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
  }
}

// Run cache cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, 10 * 60 * 1000);
}

/**
 * Compression utility for large API responses
 */
export function compressResponse(data: any): NextResponse {
  const jsonString = JSON.stringify(data);
  const response = NextResponse.json(data);
  
  // Add compression hint for large responses (> 1KB)
  if (jsonString.length > 1024) {
    response.headers.set('Vary', 'Accept-Encoding');
    console.log(`📦 Large response detected: ${(jsonString.length / 1024).toFixed(2)}KB`);
  }
  
  return response;
}

/**
 * Database query optimization utilities
 */
export const dbOptimization = {
  /**
   * Batch multiple database operations
   */
  batchOperations: async <T>(operations: (() => Promise<T>)[]): Promise<T[]> => {
    const startTime = Date.now();
    const results = await Promise.all(operations.map(op => op()));
    const duration = Date.now() - startTime;
    
    console.log(`⚡ Batched ${operations.length} operations in ${duration}ms`);
    return results;
  },
  
  /**
   * Add delay to prevent overwhelming the database
   */
  throttle: (ms: number = 10) => new Promise(resolve => setTimeout(resolve, ms)),
};

/**
 * Image optimization utilities
 */
export const imageOptimization = {
  /**
   * Generate optimized image URLs with proper sizing
   */
  optimizeImageUrl: (url: string, width?: number, height?: number): string => {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }
    
    try {
      const urlParts = url.split('/upload/');
      if (urlParts.length !== 2) return url;
      
      let transformations = [];
      
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      
      // Always add quality optimization
      transformations.push('q_auto', 'f_auto');
      
      const optimizedUrl = `${urlParts[0]}/upload/${transformations.join(',')}/${urlParts[1]}`;
      return optimizedUrl;
    } catch (error) {
      console.warn('Failed to optimize image URL:', error);
      return url;
    }
  },
  
  /**
   * Generate multiple image sizes for responsive images
   */
  generateResponsiveSizes: (url: string) => ({
    thumbnail: imageOptimization.optimizeImageUrl(url, 150, 150),
    small: imageOptimization.optimizeImageUrl(url, 300, 300),
    medium: imageOptimization.optimizeImageUrl(url, 600, 600),
    large: imageOptimization.optimizeImageUrl(url, 1200, 1200),
    original: url,
  }),
};
