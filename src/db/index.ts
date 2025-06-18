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

// Function to create a fresh connection each time
// This prevents stale connection issues and authentication problems
function createConnection(): NeonQueryFunction<any, any> {
  try {
    // For Neon specifically, prefer the non-pooled connection 
    // This helps avoid authentication issues in serverless environments
    const unpooledUrl = process.env.DATABASE_URL_UNPOOLED || 
                        process.env.POSTGRES_URL_NON_POOLING ||
                        connectionString;

    // Create connection with specific options for better reliability
    const sql = neon(unpooledUrl, { 
      // Add connection options that help with authentication issues
      authToken: process.env.NEON_AUTH_TOKEN, // If exists
      fullResults: true // Retrieve full result info for better error diagnosis
    });
    
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log("New unpooled database connection created");
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