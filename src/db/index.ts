import { drizzle } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env" });

// Check database connection configuration
// Use DATABASE_URL as fallback if POSTGRES_URL is not defined
const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("No database URL defined in environment variables (POSTGRES_URL or DATABASE_URL)");
}

// Configure connection options for Neon
// Note: Neon's HTTP client doesn't support the same options as other clients
// So we're using the standard options for Neon

// Configure Neon with error handling
let sql: NeonQueryFunction<any, any>;
try {
  sql = neon(dbUrl);
  
  // Only log in development to avoid logging credentials in production
  if (process.env.NODE_ENV === 'development') {
    console.log("Database connection initialized");
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error);
  throw error;
}

// Initialize Drizzle with the SQL client and schema
export const db = drizzle(sql, { schema });

// Test the connection
export async function testDatabaseConnection() {
  try {
    await sql`SELECT 1`;
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Export the sql client for raw queries if needed
export const sqlClient = sql;