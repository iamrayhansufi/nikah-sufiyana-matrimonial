require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function checkUsersTable() {
  try {
    console.log("Checking users table structure...");
    
    // Use the database URL
    const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      throw new Error("No database URL defined in environment variables");
    }
    
    console.log("Connecting to database...");
    const sql = neon(dbUrl);
    
    // Test connection
    await sql`SELECT 1 AS test`;
    console.log("✅ Connection successful!");

    // Check if users table exists
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `;
    
    if (tables.length === 0) {
      console.log("❌ Users table does not exist!");
      return;
    }
    
    console.log("✅ Users table exists");

    // Check columns in the users table
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;
    
    console.log("\n📋 Columns in users table:");
    columns.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type}, nullable: ${column.is_nullable}, default: ${column.column_default || 'none'})`);
    });
    
    // Specifically check for role column
    const roleColumn = columns.find(col => col.column_name === 'role');
    if (roleColumn) {
      console.log("\n✅ ROLE COLUMN EXISTS!");
      console.log("Role column details:", roleColumn);
    } else {
      console.log("\n❌ ROLE COLUMN MISSING!");
      console.log("This is likely the cause of the authentication error.");
    }
    
    // Check sample user data
    console.log("\n📊 Sample user data:");
    const sampleUsers = await sql`
      SELECT id, full_name, email, CASE WHEN password IS NOT NULL THEN 'HAS_PASSWORD' ELSE 'NO_PASSWORD' END as password_status
      FROM users
      LIMIT 3
    `;
    
    sampleUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.full_name}, Email: ${user.email}, Password: ${user.password_status}`);
    });

  } catch (error) {
    console.error("❌ Error checking users table:", error);
  }
}

checkUsersTable();
