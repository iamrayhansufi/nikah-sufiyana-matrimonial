require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function addVerifiedField() {
  try {
    // Use the non-pooling connection
    const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING;
    if (!dbUrl) {
      throw new Error("No non-pooling database URL defined in environment variables");
    }
    
    console.log("Connecting to database...");
    const sql = neon(dbUrl);
    
    console.log("Adding 'verified' field to users table...");
    await sql`
      ALTER TABLE IF EXISTS users 
      ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
    `;
    
    console.log("Verified field added successfully!");
  } catch (error) {
    console.error("Error adding verified field:", error);
  }
}

// Run the function
addVerifiedField();
