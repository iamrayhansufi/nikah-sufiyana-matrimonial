// Database verification script
// This script only checks the database connection and structure

const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
require('dotenv').config();

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

// Create database connection
const sql = neon(databaseUrl);

async function verifyDatabase() {
  try {
    console.log('🔍 Starting database verification...');
    
    // Test 1: Basic connection
    console.log('\nTest 1: Basic connection');
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log(`Query result: ${JSON.stringify(result)}`);
    
    // Test 2: List tables
    console.log('\nTest 2: Available tables');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('⚠️ No tables found in the database!');
    } else {
      console.log('📊 Database tables:');
      tables.forEach((table, i) => {
        console.log(`${i + 1}. ${table.table_name}`);
      });
    }
    
    // Test 3: Check users table
    console.log('\nTest 3: Users table check');
    try {
      const userCount = await sql`SELECT COUNT(*) FROM users`;
      console.log(`✅ Users table exists with ${userCount[0]?.count || 0} records`);
    } catch (error) {
      console.error('❌ Error accessing users table:', error.message);
    }

    // Test 4: Check premium users
    console.log('\nTest 4: Premium users check');
    try {
      const premiumUsers = await sql`SELECT COUNT(*) FROM users WHERE premium = true`;
      console.log(`Premium users count: ${premiumUsers[0]?.count || 0}`);
    } catch (error) {
      console.error('❌ Error checking premium users:', error.message);
    }
    
    console.log('\n✅ Database verification completed!');
    return true;
  } catch (error) {
    console.error('\n❌ Database verification failed:', error.message);
    return false;
  }
}

verifyDatabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Verification script failed with error:', error);
    process.exit(1);
  });
