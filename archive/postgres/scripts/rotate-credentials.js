// Usage: node scripts/rotate-credentials.js
const fs = require('fs');
const path = require('path');
const { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');
const { db } = require('../src/db');
const { adminUsers } = require('../src/db/schema');
const { eq } = require('drizzle-orm');
const dotenv = require('dotenv');

dotenv.config();

// Function to generate a random secure password/token
const generateSecureToken = (length = 32) => {
  return randomBytes(Math.ceil(length * 3/4))
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, length);
};

// Function to update the admin user password
async function updateAdminPassword() {
  try {
    const email = 'nikahsufiyana@gmail.com';
    // Generate a secure random password
    const newPassword = generateSecureToken(16);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin user in the database
    const result = await db.update(adminUsers)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(adminUsers.email, email));

    console.log('➡️ Admin password rotated successfully');
    console.log(`➡️ New admin password: ${newPassword}`);
    console.log('⚠️ IMPORTANT: Save this password securely, it will not be shown again!');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update admin password:', error);
    return false;
  }
}

// Function to generate new environment variables
function generateNewEnvVariables() {
  // Generate new secure tokens
  const newJwtSecret = randomBytes(32).toString('hex');
  const newNextAuthSecret = randomBytes(32).toString('hex');
  const newDbPassword = generateSecureToken(16);
  const newSmtpPassword = generateSecureToken(16);
  
  return {
    JWT_SECRET: newJwtSecret,
    NEXTAUTH_SECRET: newNextAuthSecret,
    DB_PASSWORD: newDbPassword,
    SMTP_PASSWORD: newSmtpPassword
  };
}

// Main function to rotate credentials
async function rotateCredentials() {
  console.log('🔄 Starting credentials rotation process...');
  
  // 1. Update admin password
  const adminPasswordUpdated = await updateAdminPassword();
  if (!adminPasswordUpdated) {
    console.log('⚠️ Admin password update failed. DB connection might be broken or admin user doesn\'t exist.');
    console.log('Continuing with environment variable rotation anyway...');
  }
  
  // 2. Generate new secure tokens for environment variables
  const newCredentials = generateNewEnvVariables();
  console.log('\n🔐 Generated new secure credentials:');
  console.log('➡️ New JWT_SECRET: Generated (32 bytes hex)');
  console.log('➡️ New NEXTAUTH_SECRET: Generated (32 bytes hex)');
  console.log(`➡️ New Database Password: ${newCredentials.DB_PASSWORD}`);
  console.log(`➡️ New SMTP Password: ${newCredentials.SMTP_PASSWORD}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Update these new credentials in your database provider (Neon DB)');
  console.log('2. Update the SMTP password in your email provider');
  console.log('3. Update all environment variables in Vercel');
  console.log('4. Update your local .env file with the new credentials');
  
  console.log('\nSample .env updates (replace existing lines):');
  console.log(`JWT_SECRET=${newCredentials.JWT_SECRET}`);
  console.log(`NEXTAUTH_SECRET=${newCredentials.NEXTAUTH_SECRET}`);
  console.log('DATABASE_URL=postgres://neondb_owner:NEW_PASSWORD@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');
  console.log('SMTP_PASS=NEW_SMTP_PASSWORD');

  console.log('\n⚠️ IMPORTANT: These credentials are extremely sensitive. Store them securely!');
}

rotateCredentials().catch(console.error).finally(() => process.exit());
