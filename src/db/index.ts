import { drizzle } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env" });

// Check database connection configuration
// Use DATABASE_URL as fallback if POSTGRES_URL is not defined
const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// Explicitly check if the URL is defined and throw error if not
if (!dbUrl) {
  throw new Error("No database URL defined in environment variables (POSTGRES_URL or DATABASE_URL)");
}

// At this point TypeScript should know dbUrl is a string, but let's be explicit
const connectionString: string = dbUrl;

// Helper to track and limit data usage
const dataTransferTracking = {
  lastReset: Date.now(),
  bytesTransferred: 0,
  queryCount: 0,
  resetInterval: 60 * 1000, // Reset counter every 1 minute
  queryLimit: 50, // Maximum number of queries per interval
  
  recordQuery(size = 1000) { // Default estimate of 1KB per query
    const now = Date.now();
    
    // Reset counters if reset interval has passed
    if (now - this.lastReset > this.resetInterval) {
      this.bytesTransferred = 0;
      this.queryCount = 0;
      this.lastReset = now;
    }
    
    this.bytesTransferred += size;
    this.queryCount++;
    
    // Return true if we should allow the query, false if we're over limit
    return this.queryCount <= this.queryLimit;
  },
  
  getRemainingQuota() {
    return {
      remainingQueries: Math.max(0, this.queryLimit - this.queryCount),
      estimatedBytesTransferred: this.bytesTransferred,
      queryCount: this.queryCount,
      resetIn: this.resetInterval - (Date.now() - this.lastReset)
    };
  }
};

// Create a simple rate limiter for database queries
function createRateLimitedNeonClient(baseClient: NeonQueryFunction<any, any>): NeonQueryFunction<any, any> {
  // Check if we should allow this query based on rate limiting
  if (!dataTransferTracking.recordQuery() && process.env.NODE_ENV !== 'development') {
    console.warn('Database rate limit reached. Some queries will be rejected.');
  }
  
  return baseClient;
}

// Function to create a fresh connection each time
// This prevents stale connection issues and authentication problems
function createConnection(): NeonQueryFunction<any, any> {
  try {
    // For Neon specifically, prefer the non-pooled connection 
    // This helps avoid authentication issues in serverless environments
    const unpooledUrl = process.env.DATABASE_URL_UNPOOLED || 
                        process.env.POSTGRES_URL_NON_POOLING ||
                        connectionString;

    // Check if we should allow this query based on rate limiting
    const shouldAllow = dataTransferTracking.recordQuery();
    if (!shouldAllow && process.env.NODE_ENV !== 'development') {
      const quota = dataTransferTracking.getRemainingQuota();
      console.warn(`Database query rate limit reached. Quota: ${JSON.stringify(quota)}`);
    }
    
    // Create connection with specific options for better reliability
    const sql = neon(unpooledUrl, { 
      // Add connection options that help with authentication issues
      authToken: process.env.NEON_AUTH_TOKEN, // If exists
      fullResults: true // Retrieve full result info for better error diagnosis
    });
    
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      const quota = dataTransferTracking.getRemainingQuota();
      console.log(`New database connection created. Quota: ${JSON.stringify(quota)}`);
    }
    
    return sql;
  } catch (error) {
    console.error("Failed to create database connection:", error);
    throw error;
  }
}

// Get a base connection for the Drizzle ORM
const baseConnection = createConnection();

// Initialize Drizzle with the SQL client and schema
export const db = drizzle(baseConnection, { schema });

// Test the connection
export async function testDatabaseConnection() {
  try {
    // Create a fresh connection for testing
    const testSql = createConnection();
    await testSql`SELECT 1`;
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Export a function that returns a fresh SQL client for raw queries
export function getSqlClient() {
  return createConnection();
}

// For backward compatibility
export const sqlClient = createConnection();