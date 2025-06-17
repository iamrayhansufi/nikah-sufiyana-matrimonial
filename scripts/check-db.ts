import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env" });

// Check for DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

async function checkConnection() {
  try {
    // At this point databaseUrl must be a string, as we've done the check above
    const dbUrl = databaseUrl as string;
    
    console.log("Attempting to connect to database...");
    console.log(`Database URL format: ${dbUrl.substring(0, 15)}...`);
    
    const sql = neon(dbUrl);
    const db = drizzle(sql);
    
    // Try a simple query
    const result = await sql`SELECT 1 as test`;
    console.log("✅ Database connection successful!");
    console.log("Query result:", result);
    
    // Try listing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log("\n📊 Database tables:");
    if (tables.length === 0) {
      console.log("No tables found in public schema");
    } else {
      tables.forEach((table: any, i: number) => {
        console.log(`${i + 1}. ${table.table_name}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error("\nError details:");
      console.error(`- Name: ${error.name}`);
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
      
      // Additional information for common errors
      if (error.message.includes("self signed certificate")) {
        console.error("\n⚠️ SSL Certificate Error: Your database connection is using a self-signed certificate.");
        console.error("Try adding ?sslmode=require or ?sslmode=no-verify to your connection string.");
      }
      
      if (error.message.includes("password authentication failed")) {
        console.error("\n⚠️ Authentication Error: Username or password is incorrect.");
      }
      
      if (error.message.includes("connect ECONNREFUSED")) {
        console.error("\n⚠️ Connection Refused: The database server is not accessible.");
        console.error("This could be due to network restrictions or firewall settings.");
      }
    }
    
    process.exit(1);
  }
}

checkConnection();
