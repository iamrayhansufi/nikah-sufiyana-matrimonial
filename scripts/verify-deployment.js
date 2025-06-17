// Usage: node scripts/verify-deployment.js
// This script runs various checks to verify the deployment and connections are working

const https = require('https');
// Use direct database connection from the check-db script
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
const db = drizzle(sql);

// Function to test database connection
async function testDatabaseConnection() {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Since we're not importing schema directly, define minimal users schema
const users = {
  id: 'id',
  premium: 'premium'
};

// Function to check if a website is accessible
function checkWebsite(url) {
  return new Promise((resolve, reject) => {
    console.log(`Checking website accessibility: ${url}`);
    https.get(url, (res) => {
      const statusCode = res.statusCode;
      console.log(`Status code: ${statusCode}`);
      
      if (statusCode >= 200 && statusCode < 300) {
        resolve({ success: true, statusCode });
      } else {
        resolve({ success: false, statusCode });
      }
    }).on('error', (err) => {
      console.error('Error accessing website:', err.message);
      resolve({ success: false, error: err.message });
    });
  });
}

// Function to verify database connections
async function verifyDatabase() {
  try {
    console.log('Verifying database connection...');
    await testDatabaseConnection();
    console.log('Database connection successful!');
    
    // Check if users table exists and has data
    const userCountResult = await sql`SELECT COUNT(*) FROM users`;
    const userCount = parseInt(userCountResult[0]?.count || '0');
    console.log(`Users table exists with ${userCount} records`);
    
    // Check if premium users exist
    const premiumCountResult = await sql`SELECT COUNT(*) FROM users WHERE premium = true`;
    const premiumCount = parseInt(premiumCountResult[0]?.count || '0');
    console.log(`Premium users count: ${premiumCount}`);
    
    return { success: true, userCount, premiumCount };
  } catch (error) {
    console.error('Database verification failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Function to check essential pages
async function checkEssentialPages(baseUrl) {
  const pagesToCheck = [
    '', // Home page
    '/login',
    '/register',
    '/browse',
    '/about',
    '/contact'
  ];
  
  const results = {};
  
  for (const page of pagesToCheck) {
    const url = `${baseUrl}${page}`;
    try {
      const result = await checkWebsite(url);
      results[page || 'home'] = result;
    } catch (error) {
      results[page || 'home'] = { success: false, error: error.message };
    }
  }
  
  return results;
}

// Main verification function
async function verifyDeployment() {
  try {
    console.log('🔍 Starting deployment verification process...');
    
    // 1. Check if the website is accessible
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.nikahsufiyana.com';
    console.log(`Using base URL: ${baseUrl}`);
    
    const websiteAccessible = await checkWebsite(baseUrl);
    if (!websiteAccessible.success) {
      console.error('❌ Website is not accessible!');
      return false;
    }
    console.log('✅ Website is accessible');
    
    // 2. Verify database connection
    const dbResult = await verifyDatabase();
    if (!dbResult.success) {
      console.error('❌ Database verification failed!');
      return false;
    }
    console.log('✅ Database verification successful');
    
    // 3. Check essential pages
    console.log('Checking essential pages...');
    const pageResults = await checkEssentialPages(baseUrl);
    
    let allPagesAccessible = true;
    for (const [page, result] of Object.entries(pageResults)) {
      if (result.success) {
        console.log(`✅ ${page} page is accessible`);
      } else {
        console.error(`❌ ${page} page is not accessible: ${result.statusCode || result.error}`);
        allPagesAccessible = false;
      }
    }
    
    if (!allPagesAccessible) {
      console.warn('⚠️ Some pages are not accessible!');
    } else {
      console.log('✅ All essential pages are accessible');
    }
    
    // Final summary
    console.log('\n📊 Deployment Verification Summary:');
    console.log(`Website Accessible: ${websiteAccessible.success ? '✅' : '❌'}`);
    console.log(`Database Connection: ${dbResult.success ? '✅' : '❌'}`);
    console.log(`Users Count: ${dbResult.userCount || 'N/A'}`);
    console.log(`Premium Users Count: ${dbResult.premiumCount || 'N/A'}`);
    console.log(`All Pages Accessible: ${allPagesAccessible ? '✅' : '❌'}`);
    
    const overallSuccess = websiteAccessible.success && dbResult.success && allPagesAccessible;
    console.log(`\nOverall Verification: ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    
    return overallSuccess;
  } catch (error) {
    console.error('❌ Deployment verification failed with an unexpected error:', error);
    return false;
  }
}

verifyDeployment()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Verification script failed with error:', error);
    process.exit(1);
  });
