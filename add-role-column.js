// Script to add missing role column to users table
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function addRoleColumn() {
  try {
    console.log("Attempting to add role column to users table...");
    
    // Get database URL
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      throw new Error("No database URL found in environment variables");
    }
    
    console.log("Connecting to database...");
    const sql = neon(dbUrl);
    
    // Test connection
    await sql`SELECT 1`;
    console.log("✅ Connected to database");
    
    // Check if role column exists
    console.log("Checking if role column exists...");
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `;
    
    if (columns.length > 0) {
      console.log("✅ Role column already exists!");
      return;
    }
    
    console.log("❌ Role column missing. Adding it now...");
    
    // Add the role column
    await sql`ALTER TABLE users ADD COLUMN role varchar(20) NOT NULL DEFAULT 'user'`;
    console.log("✅ Role column added successfully!");
    
    // Add index for performance
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)`;
      console.log("✅ Index on role column created");
    } catch (indexError) {
      console.log("ℹ️ Index may already exist or failed to create:", indexError.message);
    }
    
    // Verify the column was added
    const verification = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `;
    
    if (verification.length > 0) {
      console.log("✅ Verification successful!");
      console.log("Column details:", verification[0]);
    } else {
      console.log("❌ Verification failed - column still missing");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
    
    // If it's a "column already exists" error, that's actually good
    if (error.message && error.message.includes('already exists')) {
      console.log("✅ Column already exists (this is good!)");
      return;
    }
    
    throw error;
  }
}

addRoleColumn()
  .then(() => {
    console.log("🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
