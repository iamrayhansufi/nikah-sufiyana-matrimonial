// Database connection test script
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function testDbConnection() {
  console.log('Testing database connection...');
  
  try {
    // Get the database URL from environment variables
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!dbUrl) {
      throw new Error('No database URL defined in environment variables');
    }
    
    console.log('Database URL found');
    
    // Try to establish a connection
    const sql = neon(dbUrl);
    const result = await sql`SELECT 1 as test`;
    
    console.log('Connection successful!');
    console.log('Query result:', result);
    
    // Test a simple query against the users table
    try {
      console.log('Testing users table query...');
      const usersTest = await sql`SELECT COUNT(*) FROM users`;
      console.log('Users table query successful:', usersTest);
    } catch (tableError) {
      console.error('Error querying users table:', tableError);
    }
    
    return true;
  } catch (error) {
    console.error('Database connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return false;
  }
}

// Run the test
testDbConnection()
  .then(success => {
    console.log('Test completed. Success:', success);
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Test failed with uncaught error:', err);
    process.exit(1);
  });
