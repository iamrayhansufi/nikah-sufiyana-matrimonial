/**
 * This utility provides API access functions with built-in caching and rate limit handling
 * to reduce database load and provide better user experience when data transfer limits are reached.
 */

type CachedFetchConfig = {
  cacheDuration?: number; // In milliseconds (default: 30 minutes)
  cacheKey?: string; // Custom cache key
  fallbackToCache?: boolean; // Whether to use cache on error (default: true)
  showWarning?: boolean; // Whether to show warning banner on rate limit (default: true)
};

/**
 * Fetches data from API with built-in caching to reduce database load
 */
export async function cachedFetch<T>(
  url: string, 
  options?: RequestInit,
  config: CachedFetchConfig = {}
): Promise<T> {
  const {
    cacheDuration = 30 * 60 * 1000, // 30 minutes
    cacheKey = url,
    fallbackToCache = true,
    showWarning = true
  } = config;
  
  // Check for cached data
  const cachedData = sessionStorage.getItem(`data_${cacheKey}`);
  const cachedTimestamp = sessionStorage.getItem(`data_timestamp_${cacheKey}`);
  
  // Use cache if available and not expired
  if (cachedData && cachedTimestamp) {
    const age = Date.now() - parseInt(cachedTimestamp);
    if (age < cacheDuration) {
      console.log(`Using cached data for ${cacheKey} (Age: ${(age / 1000).toFixed(0)}s)`);
      return JSON.parse(cachedData) as T;
    }
  }
  
  try {
    // Fetch fresh data
    const response = await fetch(url, options);
    
    // Handle rate limiting
    if (response.status === 429) {
      console.warn(`Rate limit reached for ${url}`);
      
      // Show warning if enabled
      if (showWarning) {
        sessionStorage.setItem('db_rate_limited', 'true');
        window.dispatchEvent(new CustomEvent('app:data_limit', { 
          detail: { type: 'rate_limit' } 
        }));
      }
      
      // Try to use cached data if available
      if (fallbackToCache && cachedData) {
        console.log(`Falling back to cached data for ${cacheKey} due to rate limiting`);
        return JSON.parse(cachedData) as T;
      }
      
      throw new Error('Database rate limit reached');
    }
    
    // Handle other errors
    if (!response.ok) {
      throw new Error(`API error with status ${response.status}`);
    }
    
    // Parse and cache successful response
    const data = await response.json();
    sessionStorage.setItem(`data_${cacheKey}`, JSON.stringify(data));
    sessionStorage.setItem(`data_timestamp_${cacheKey}`, Date.now().toString());
    
    return data as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    
    // Fall back to cache on error if enabled
    if (fallbackToCache && cachedData) {
      console.log(`Falling back to cached data for ${cacheKey} due to error`);
      return JSON.parse(cachedData) as T;
    }
    
    throw error;
  }
}
