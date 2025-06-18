// Comprehensive connection test script
require("dotenv").config({ path: ".env.local" }); // First try local env
require("dotenv").config(); // Then fall back to main .env

const { neon } = require("@neondatabase/serverless");
const { Pool } = require("pg");

// Test all possible password variations
async function testCredentials() {
  console.log("\n======= TESTING NEON DATABASE CREDENTIALS =======\n");
  
  // Common password patterns when credentials are rotated
  const possiblePasswords = [
    process.env.PGPASSWORD,
    process.env.POSTGRES_PASSWORD,
    process.env.PGPASSWORD?.replace(/npg_/, ""), // Sometimes prefix is removed
    process.env.PGPASSWORD?.replace(/npg_/, "neon_"), // Sometimes prefix is changed
    "neondb_password", // Default pattern
    process.env.PGPASSWORD?.replace(/[0-9]+$/, "") + "2023", // Year might be updated
    process.env.PGPASSWORD?.replace(/[0-9]+$/, "") + "2024",
    process.env.PGPASSWORD?.replace(/[0-9]+$/, "") + "2025",
  ].filter(Boolean);

  // Log current config
  console.log("Current database settings:");
  console.log(`Host: ${process.env.PGHOST || process.env.POSTGRES_HOST || "not set"}`);
  console.log(`Database: ${process.env.PGDATABASE || process.env.POSTGRES_DATABASE || "not set"}`);
  console.log(`User: ${process.env.PGUSER || process.env.POSTGRES_USER || "not set"}`);
  console.log(`Password: ${(process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || "not set").substring(0, 3)}...`);
  console.log("");
  
  // Connection URLs
  const baseUrl = `postgresql://${process.env.PGUSER || "neondb_owner"}:PASSWORD@${process.env.PGHOST_UNPOOLED || process.env.PGHOST}/${process.env.PGDATABASE || "neondb"}?sslmode=require`;

  // Try direct connections with various passwords
  for (const password of possiblePasswords) {
    if (!password) continue;
    
    const url = baseUrl.replace("PASSWORD", password);
    const maskedUrl = url.replace(password, "*****");
    
    try {
      console.log(`Testing connection with: ${maskedUrl}`);
      const sql = neon(url);
      const result = await sql`SELECT 1 as test`;
      console.log(" CONNECTION SUCCESSFUL with this password!");
      console.log(` Password works: ${password.substring(0, 3)}...${password.substring(password.length-2)}`);
      console.log(" You should update your .env and .env.local files with this password.");
      return true;
    } catch (error) {
      console.log(` Failed with error: ${error.message}`);
    }
  }

  console.log("\n None of the password variations worked.");
  console.log("Please check your Neon dashboard for the correct credentials");
  return false;
}

// Run test
testCredentials().catch(console.error);