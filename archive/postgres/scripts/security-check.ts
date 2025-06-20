/**
 * Security Check Script
 * 
 * This script performs two important functions:
 * 1. Tests the database connection using environment variables
 * 2. Checks for any hardcoded credentials in the codebase
 */

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: ".env" });

// Sensitive patterns to search for in code
const SENSITIVE_PATTERNS = [
  /password\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /apiKey\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /secret\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /auth.*user\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /auth.*pass\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /smtp.*pass\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /smtp.*user\s*[:=]\s*['"][^'"]+['"](?!\s*\/\/\s*example)/i,
  /nikahsufiyana\.com/i, // to find hardcoded domain references
];

// File extensions to check
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', '.next', 'out', '.git'];

async function checkDatabaseConnection() {
  console.log("🔍 Checking database connection...");
  
  // Check for DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    return false;
  }
  
  try {
    console.log(`📊 Connecting to database (${databaseUrl.substring(0, 15)}...)`);
    const sql = neon(databaseUrl);
    
    // Try a simple query
    const result = await sql`SELECT current_timestamp as time`;
    console.log("✅ Database connection successful!");
    console.log(`🕒 Current database time: ${result[0]?.time}`);
    
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      if (error.message.includes("password authentication failed")) {
        console.error("\n⚠️ Authentication Error: Username or password is incorrect.");
        console.error("Please check your database credentials in Vercel environment variables and .env file.");
        console.error("You might need to generate a new password for your database user.");
      }
    }
    
    return false;
  }
}

async function scanForHardcodedCredentials(dir: string = '.'): Promise<boolean> {
  console.log("\n🔍 Scanning for hardcoded credentials...");
  const fullPath = path.resolve(dir);
  let found = false;
  
  // Skip excluded directories
  if (EXCLUDE_DIRS.some(exclude => fullPath.includes(`/${exclude}/`) || fullPath.endsWith(`/${exclude}`))) {
    return found;
  }
  
  try {
    const files = fs.readdirSync(fullPath);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
        // Recursively scan subdirectories
        const subDirFound: boolean = await scanForHardcodedCredentials(filePath);
        found = found || subDirFound;
      } else if (FILE_EXTENSIONS.includes(path.extname(file)) && 
                !file.endsWith('.env.example') &&
                !file.endsWith('security-check.ts')) {
        // Check file content for sensitive patterns
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of SENSITIVE_PATTERNS) {
          const matches = content.match(pattern);
          if (matches) {
            console.error(`⚠️ Potential hardcoded credentials in ${filePath}:`);
            console.error(`   ${matches[0]}`);
            found = true;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${fullPath}:`, error);
  }
  
  return found;
}

async function main() {
  console.log("🛡️ Starting security check...\n");
  
  // Check database connection
  const dbConnected = await checkDatabaseConnection();
  
  // Scan for hardcoded credentials
  const credentialsFound = await scanForHardcodedCredentials();
  
  console.log("\n📝 Security Check Summary:");
  console.log(`- Database Connection: ${dbConnected ? '✅ Success' : '❌ Failed'}`);
  console.log(`- Hardcoded Credentials: ${!credentialsFound ? '✅ None Found' : '❌ Found'}`);
  
  if (!dbConnected || credentialsFound) {
    process.exit(1);
  }
}

main();
