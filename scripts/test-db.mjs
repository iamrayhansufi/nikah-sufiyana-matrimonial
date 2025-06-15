// test-db.js
import { testDatabaseConnection } from '../src/db/index.js';

async function main() {
  try {
    await testDatabaseConnection();
    console.log('Database test successful!');
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

main();
