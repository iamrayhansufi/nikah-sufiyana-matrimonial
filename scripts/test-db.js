"use strict";

const { testDatabaseConnection } = require("../src/db");

async function testDb() {
  try {
    console.log("Testing database connection...");
    await testDatabaseConnection();
    console.log("Database connection test successful!");
    process.exit(0);
  } catch (error) {
    console.error("Database connection test failed:", error);
    process.exit(1);
  }
}

testDb();
