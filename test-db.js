// Simple script to test database connection
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testConnection() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  console.log(`Testing connection to database...`);
  console.log(`URL format: ${url.substring(0, 20)}...`);
  
  try {
    const sql = neon(url);
    const result = await sql`SELECT 1 as test`;
    console.log(`Connection successful! Result:`, result);
    return true;
  } catch (error) {
    console.error(`Connection failed:`, error);
    return false;
  }
}

testConnection();