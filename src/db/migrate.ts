import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env" });

// Check for DATABASE_URL and assert its type
const databaseUrl = process.env.DATABASE_URL as string | undefined;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create the database connection
const sql = neon(databaseUrl);
const db = drizzle({ client: sql, schema });

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