// Usage: node scripts/insert-admin-user.js [password]
// If password is not provided as command line argument, a secure random one will be generated
const bcrypt = require('bcryptjs');
const { db } = require('../src/db');
const { adminUsers } = require('../src/db/schema');
const { eq } = require('drizzle-orm');
const { randomBytes } = require('crypto');

// Function to generate a secure random password
const generateSecurePassword = (length = 16) => {
  return randomBytes(Math.ceil(length * 3/4))
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, length);
};

async function insertAdmin() {
  const email = 'nikahsufiyana@gmail.com';
  // Use command line argument if provided, otherwise generate a secure password
  const password = process.argv[2] || generateSecurePassword();
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
  console.log('Admin user inserted successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('IMPORTANT: Save this password securely. It will not be shown again.');
}

insertAdmin().then(() => process.exit()).catch(e => { console.error(e); process.exit(1); });
