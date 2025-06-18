// Quick script to check database connection and add role column if needed
require('dotenv').config();

const { neon } = require('@neondatabase/serverless');

async function fixRoleColumn() {
  try {
    console.log("Setting up database connection...");
    
    // Create connection using DATABASE_URL
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("No DATABASE_URL or POSTGRES_URL found");
    }
    
    console.log("Connection string found");
    console.log("Connecting to database...");
    
    const sql = neon(connectionString);
    console.log("✅ Connected!");    
    // Check if role column exists
    console.log("Checking for role column...");
    const checkResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `;
    
    if (checkResult.length > 0) {
      console.log("✅ Role column already exists!");
    } else {
      console.log("❌ Role column missing. Adding now...");
      
      // Add the role column
      await sql`ALTER TABLE users ADD COLUMN role varchar(20) NOT NULL DEFAULT 'user'`;
      console.log("✅ Role column added!");
      
      // Add index
      await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)`;
      console.log("✅ Index added!");
    }
    
    // Test the fix by selecting from users with role
    console.log("Testing the fix...");
    const testResult = await sql`
      SELECT id, full_name, email, role
      FROM users 
      LIMIT 1
    `;
    
    if (testResult.length > 0) {
      console.log("✅ Test successful! Sample user:");
      console.log(testResult[0]);
    } else {
      console.log("ℹ️ No users found in table");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes('already exists')) {
      console.log("✅ Column already exists (this is good!)");    } else {
      throw error;
    }
  } finally {
    console.log("Script completed");
  }
}

fixRoleColumn()
  .then(() => {
    console.log("🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Failed:", error);
    process.exit(1);
  });
