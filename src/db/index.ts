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
// This prevents stale connection issues
function createConnection(): NeonQueryFunction<any, any> {
  try {
    const sql = neon(connectionString);
    
    // Only log in development to avoid logging credentials in production
    if (process.env.NODE_ENV === 'development') {
      console.log("New database connection created");
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