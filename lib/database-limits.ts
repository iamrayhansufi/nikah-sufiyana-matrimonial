"use client"

// Database limits and transfer monitoring

import { useState, useEffect } from 'react';

// Simple flag to track if we've hit the Neon database limit in this session
let hasHitNeonLimit = false;

// Type definition for window CustomEvent
declare global {
  interface WindowEventMap {
    'app:data_limit': CustomEvent<{ type: string }>;
  }
}

/**
 * Set the Neon database limit status
 */
export function setNeonLimitHit(hit: boolean): void {
  hasHitNeonLimit = hit;
  // Save to localStorage to persist across page refreshes
  if (typeof window !== 'undefined') {
    localStorage.setItem('neon-limit-hit', hit ? 'true' : 'false');
    localStorage.setItem('neon-limit-hit-time', Date.now().toString());
    
    // Also trigger the existing data limit event for compatibility
    if (hit) {
      const event = new CustomEvent('app:data_limit', {
        detail: { type: 'rate_limit' }
      });
      window.dispatchEvent(event);
      sessionStorage.setItem('db_rate_limited', 'true');
    }
  }
}

/**
 * Check if a database error is related to Neon data transfer limits
 */
export function isNeonLimitError(error: any): boolean {
  if (!error) return false;
  
  // Convert error to string for easier checking
  const errorStr = typeof error === 'string' ? error : (
    error.message || (error.toString ? error.toString() : '')
  );
  
  // Check for common Neon limit error messages
  return errorStr.includes('data transfer allowance') || 
         errorStr.includes('upgrade your account') ||
         errorStr.includes('data transfer limit');
}

/**
 * React hook to track if we've hit the Neon database limit
 */
export function useNeonLimitStatus() {
  const [limitHit, setLimitHit] = useState<boolean>(false);

  useEffect(() => {
    // Check memory value first
    if (hasHitNeonLimit) {
      setLimitHit(true);
      return;
    }
    
    // Then check localStorage for persisted value
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('neon-limit-hit') === 'true';
      const limitHitTime = parseInt(localStorage.getItem('neon-limit-hit-time') || '0');
      const sessionLimitHit = sessionStorage.getItem('db_rate_limited') === 'true';
      
      // Only consider the limit hit if it happened in the last 30 minutes
      const isRecent = Date.now() - limitHitTime < 30 * 60 * 1000; // 30 minutes
      
      if ((storedValue && isRecent) || sessionLimitHit) {
        setLimitHit(true);
        hasHitNeonLimit = true;
      } else if (storedValue && !isRecent) {
        // Reset if it's been more than 30 minutes
        localStorage.removeItem('neon-limit-hit');
        localStorage.removeItem('neon-limit-hit-time');
      }
    }
  }, []);

  return limitHit;
}
