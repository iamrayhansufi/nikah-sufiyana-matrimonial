// Usage: node scripts/insert-admin-user.js
const bcrypt = require('bcryptjs');
const { db } = require('../src/db');
const { adminUsers } = require('../src/db/schema');
const { eq } = require('drizzle-orm');

async function insertAdmin() {
  const email = 'nikahsufiyana@gmail.com';
  const password = 'Rayhan@786';
  const role = 'superadmin';
  const hashed = await bcrypt.hash(password, 10);

  // Check if already exists
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existing && existing.length > 0) {
    console.log('Admin user already exists.');
    return;
  }

  await db.insert(adminUsers).values({
    email,
    password: hashed,
    role,
    createdAt: new Date(),
  });
  console.log('Admin user inserted.');
}

insertAdmin().then(() => process.exit()).catch(e => { console.error(e); process.exit(1); });
