// Test for Next.js API route database access patterns
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testNextApiDbAccess() {
  console.log('\n======= TESTING DATABASE ACCESS IN NEXT.JS API CONTEXT =======\n');
  
  // Get all possible URLs that might be used in Next.js
  const connectionUrls = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  };
  
  // Attempt connections with each URL
  for (const [urlName, url] of Object.entries(connectionUrls)) {
    if (!url) {
      console.log(`✗ ${urlName} not defined`);
      continue;
    }
    
    console.log(`Testing connection with ${urlName}...`);
    
    try {
      // Create fresh connection for each test
      const sql = neon(url);
      
      // Test connection with a simple query
      const result = await sql`SELECT current_user, current_database()`;
      console.log(`✓ Connection with ${urlName} successful!`);
      console.log(`  ↳ Connected as ${result[0].current_user} to database ${result[0].current_database}`);
      
      // Test user table query (this is what the registration API does)
      try {
        const testEmail = 'test@example.com';
        const userCheck = await sql`SELECT id FROM users WHERE email = ${testEmail} LIMIT 1`;
        console.log(`✓ Users table query successful (found ${userCheck.length} matching users)`);
      } catch (tableError) {
        console.error(`✗ Error querying users table:`, tableError.message);
      }
      
    } catch (error) {
      console.error(`✗ Connection with ${urlName} failed: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Try creating a connection the way the registration API does it
  console.log('Testing registration API connection pattern...');
  
  try {
    // Similar to how the API route creates the connection
    const unpooledUrl = process.env.DATABASE_URL_UNPOOLED || 
                        process.env.POSTGRES_URL_NON_POOLING ||
                        process.env.DATABASE_URL;
                          
    if (!unpooledUrl) {
      throw new Error("No database URL defined in environment");
    }
    
    const sql = neon(unpooledUrl);
    
    // Test with the same query pattern as the registration API
    const testEmail = 'test@example.com';
    const testPhone = '1234567890';
    
    const existingUsers = await sql`
      SELECT id, email, phone FROM users 
      WHERE email = ${testEmail} OR phone = ${testPhone}
      LIMIT 1
    `;
    
    console.log(`✓ Registration API query pattern successful`);
    console.log(`  ↳ Query returned ${existingUsers.length} results`);
    
  } catch (apiError) {
    console.error(`✗ Registration API connection pattern failed:`, apiError.message);
  }
  
  console.log('\n======= TEST COMPLETE =======\n');
}

testNextApiDbAccess();
