import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env" });

// Check for database URL
// Use POSTGRES_URL as fallback if DATABASE_URL is not defined
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("No database URL defined in environment variables (POSTGRES_URL or DATABASE_URL)");
}

// Explicitly cast to string for TypeScript
const connectionString: string = databaseUrl;

// Create the database connection
const sql = neon(connectionString);
const db = drizzle(sql);

async function main() {
  try {
    console.log("Starting database migration...");
    
    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main(); 