require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createVerificationCodesTable() {
  try {
    console.log("Creating verification_codes table...");
    
    // Use the non-pooling connection
    const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING;
    if (!dbUrl) {
      throw new Error("No non-pooling database URL defined in environment variables");
    }
    
    console.log("Connecting to database...");
    const sql = neon(dbUrl);
    
    // Create the verification_codes table
    console.log("Creating table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "verification_codes" (
        "id" serial PRIMARY KEY,
        "email" varchar(255) NOT NULL,
        "code" varchar(6) NOT NULL,
        "purpose" varchar(20) NOT NULL DEFAULT 'registration',
        "expires_at" timestamp NOT NULL,
        "is_used" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `;
    
    // Create an index for faster lookups
    console.log("Creating index...");
    await sql`
      CREATE INDEX IF NOT EXISTS "verification_codes_email_idx" ON "verification_codes" ("email");
    `;
    
    console.log("Verification codes table created successfully!");
    
    // Verify table was created
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'verification_codes';
    `;
    
    if (tables.length > 0) {
      console.log("Confirmed: verification_codes table exists in database.");
    } else {
      console.log("ERROR: Failed to create verification_codes table!");
    }
    
  } catch (error) {
    console.error("Error creating verification_codes table:", error);
  }
}

// Run the function
createVerificationCodesTable();
