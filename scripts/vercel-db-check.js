// A simple script to test database connectivity on Vercel
const { Pool } = require('pg');
require('dotenv').config();

// Log the DATABASE_URL format (hiding credentials)
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

// Create a redacted version for logging
const redactedUrl = dbUrl.replace(/:([^@]+)@/, ':***@');
console.log(`Attempting to connect to database: ${redactedUrl}`);

// Parse the connection string to get components
try {
  const regex = /postgres:\/\/([^:]+):([^@]+)@([^\/]+)\/([^\?]+)/;
  const match = dbUrl.match(regex);
  
  if (match) {
    const [, user, password, host, database] = match;
    console.log(`User: ${user}`);
    console.log(`Host: ${host}`);
    console.log(`Database: ${database}`);
    console.log(`Password length: ${password.length} characters`);
  }
} catch (err) {
  console.error("Error parsing connection string:", err);
}

// Create a connection pool
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: true
  }
});

// Test the connection
async function testConnection() {
  let client;
  try {
    console.log("Attempting to connect to PostgreSQL...");
    client = await pool.connect();
    console.log("Connected successfully! Running test query...");
    
    const result = await client.query('SELECT 1 as test');
    console.log("Query executed successfully:", result.rows);
    
    // List tables
    console.log("Listing tables...");
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tables.rows.length === 0) {
      console.log("No tables found in public schema");
    } else {
      tables.rows.forEach((table, i) => {
        console.log(`${i + 1}. ${table.table_name}`);
      });
    }
    
    console.log("Database check completed successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    
    // More specific error handling
    if (err.message.includes("password authentication failed")) {
      console.error("AUTHENTICATION ERROR: The username or password is incorrect");
    } else if (err.message.includes("no pg_hba.conf entry")) {
      console.error("ACCESS ERROR: IP address not allowed to connect");
    } else if (err.message.includes("Could not resolve")) { 
      console.error("DNS ERROR: Could not resolve hostname");
    }
    
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    // Close pool
    await pool.end();
  }
}

testConnection();
