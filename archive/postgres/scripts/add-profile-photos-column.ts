import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function addProfilePhotosColumn() {
  try {
    console.log("Adding profile_photos column...");
    
    // Add the column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_photos json;
    `);
    
    console.log("✅ profile_photos column added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding column:", error);
    process.exit(1);
  }
}

addProfilePhotosColumn();
