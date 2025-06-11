import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env" });

// Check if DATABASE_URL is defined
if (!process.env.POSTGRES_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Configure Neon
const sql = neon(process.env.POSTGRES_URL);

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