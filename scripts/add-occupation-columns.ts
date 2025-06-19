import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function addOccupationColumns() {
  try {
    console.log("Adding father_occupation and mother_occupation columns...");

    // Add the columns if they don't exist
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS father_occupation VARCHAR(255),
      ADD COLUMN IF NOT EXISTS mother_occupation VARCHAR(255) DEFAULT 'Home Queen';
    `);

    console.log("✅ Occupation columns added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding columns:", error);
    process.exit(1);
  }
}

addOccupationColumns();
