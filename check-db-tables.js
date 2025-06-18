require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function checkDatabaseTables() {
  try {
    console.log("Checking database tables...");
    
    // Use the non-pooling connection
    const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING;
    if (!dbUrl) {
      throw new Error("No non-pooling database URL defined in environment variables");
    }
    
    console.log("Connecting to database using non-pooled connection...");
    const sql = neon(dbUrl);
    
    // Test query to verify connection
    console.log("Testing connection...");
    await sql`SELECT 1 AS test`;
    console.log("Connection successful!");

    // Query to list all tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log("\nTables in database:");
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });

    // Check for verification_codes table specifically
    const verificationTable = tables.find(table => table.table_name === 'verification_codes');
    if (verificationTable) {
      console.log("\nVerification codes table found!");
          // Check columns in the verification_codes table
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'verification_codes'
        ORDER BY ordinal_position;
      `;
      
      console.log("\nColumns in verification_codes table:");
      columns.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}, nullable: ${column.is_nullable})`);
      });
      
      // Check if any verification codes exist
      const codesCount = await sql`
        SELECT COUNT(*) as count FROM verification_codes;
      `;
      console.log(`\nTotal verification codes in table: ${codesCount[0].count}`);
    } else {
      console.log("\nWARNING: verification_codes table not found!");
    }

  } catch (error) {
    console.error("Error checking database tables:", error);
  }
}

// Run the function
checkDatabaseTables();
