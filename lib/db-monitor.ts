/**
 * Database Usage Monitoring
 * 
 * This module provides tools to monitor and limit database usage to prevent exceeding
 * Neon's data transfer limits.
 */

// Singleton to track database usage across the application
export const dbMonitor = {
  // Initialize with default values
  lastReset: Date.now(),
  bytesTransferred: 0,
  queryCount: 0,
  resetInterval: 60 * 60 * 1000, // 1 hour
  dailyLimit: 10 * 1024 * 1024, // 10MB daily limit (adjust as needed)
  
  // Record a database query
  recordQuery(size: number = 1000) {
    const now = Date.now();
    
    // Reset counters if reset interval has passed
    if (now - this.lastReset > this.resetInterval) {
      console.log(`[DB Monitor] Resetting counters. Previous usage: ${this.bytesTransferred / 1024}KB, ${this.queryCount} queries`);
      this.bytesTransferred = 0;
      this.queryCount = 0;
      this.lastReset = now;
    }
    
    this.bytesTransferred += size;
    this.queryCount++;
    
    // Log every 100 queries
    if (this.queryCount % 100 === 0) {
      console.log(`[DB Monitor] ${this.queryCount} queries executed, ${this.bytesTransferred / 1024}KB transferred`);
    }
    
    return {
      isApproachingLimit: this.bytesTransferred > this.dailyLimit * 0.8,
      hasExceededLimit: this.bytesTransferred > this.dailyLimit
    };
  },
  
  // Get current usage statistics
  getUsage() {
    return {
      bytesTransferred: this.bytesTransferred,
      queryCount: this.queryCount,
      resetIn: this.resetInterval - (Date.now() - this.lastReset),
      percentUsed: (this.bytesTransferred / this.dailyLimit) * 100,
      isApproachingLimit: this.bytesTransferred > this.dailyLimit * 0.8,
      hasExceededLimit: this.bytesTransferred > this.dailyLimit
    };
  },
  
  // Get a user-friendly status message
  getStatusMessage() {
    const usage = this.getUsage();
    const resetTime = new Date(Date.now() + usage.resetIn).toLocaleTimeString();
    
    if (usage.hasExceededLimit) {
      return `⚠️ Database data transfer limit exceeded (${usage.percentUsed.toFixed(1)}%). Resets at ${resetTime}.`;
    }
    
    if (usage.isApproachingLimit) {
      return `⚠️ Approaching data transfer limit (${usage.percentUsed.toFixed(1)}%). Resets at ${resetTime}.`;
    }
    
    return `✅ Database usage: ${usage.percentUsed.toFixed(1)}% of daily limit. ${usage.queryCount} queries executed.`;
  }
};

// Create a middleware function to add to Next.js API routes
export function withDbMonitoring(handler: Function) {
  return async (req: any, res: any) => {
    // Record the query
    const status = dbMonitor.recordQuery();
    
    // Add monitoring header
    res.setHeader('X-DB-Usage', dbMonitor.getStatusMessage());
    
    // If we're over the limit, we might want to return a special response
    if (status.hasExceededLimit) {
      // In development, we'll still process the request
      if (process.env.NODE_ENV === 'development') {
        console.warn(dbMonitor.getStatusMessage());
        return await handler(req, res);
      }
      
      // In production, return an error response
      return res.status(429).json({
        error: 'Database data transfer limit exceeded',
        message: 'Please try again later',
        retryAfter: Math.ceil(dbMonitor.getUsage().resetIn / 1000)
      });
    }
    
    // Process the request normally
    return await handler(req, res);
  };
}
