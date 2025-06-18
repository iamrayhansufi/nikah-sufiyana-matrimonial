// Extended test script to validate Neon database authentication
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

/**
 * Comprehensive database connection test for Neon Postgres
 */
async function testNeonConnection() {
  console.log('\n============== NEON DATABASE CONNECTION TEST ==============\n');
  
  // Test all possible connection URLs
  const urlKeys = [
    'DATABASE_URL', 
    'POSTGRES_URL', 
    'POSTGRES_URL_NON_POOLING',
    'POSTGRES_URL_NO_SSL'
  ];
  
  for (const key of urlKeys) {
    const url = process.env[key];
    if (!url) {
      console.log(`✗ ${key} not defined in environment variables`);
      continue;
    }
    
    // Mask the password in the URL for safe logging
    const maskedUrl = maskDatabasePassword(url);
    console.log(`Testing connection using ${key}: ${maskedUrl}`);
    
    try {
      const sql = neon(url);
      const startTime = Date.now();
      const result = await sql`SELECT current_database() as db, current_user as user`;
      const endTime = Date.now();
      
      console.log(`✓ Connection successful with ${key}!`);
      console.log(`  ↳ Connected to database: ${result[0].db}`);
      console.log(`  ↳ Connected as user: ${result[0].user}`);
      console.log(`  ↳ Response time: ${endTime - startTime}ms\n`);
    } catch (error) {
      console.error(`✗ Connection failed with ${key}:`);
      console.error(`  ↳ Error: ${error.message}`);
      
      if (error.message.includes('password authentication')) {
        console.error('  ↳ Authentication error! Please check your database credentials.');
      } else if (error.message.includes('SSL')) {
        console.error('  ↳ SSL connection error! Neon requires SSL for connections.');
      } else if (error.message.includes('timeout')) {
        console.error('  ↳ Connection timeout! Check network or firewall settings.');
      }
      console.error('\n');
    }
  }
  
  console.log('============== TEST COMPLETE ==============\n');
}

/**
 * Masks the password in a database URL for safe logging
 */
function maskDatabasePassword(url) {
  try {
    if (!url) return 'undefined';
    // Format: postgres://username:password@hostname:port/database
    return url.replace(/\/\/([^:]+):([^@]+)@/, '//\\1:********@');
  } catch (e) {
    return '[Error masking URL]';
  }
}

// Run the test
testNeonConnection();
