// Usage: node scripts/generate-credentials.js
const { randomBytes } = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Function to generate a random secure password/token
const generateSecureToken = (length = 32) => {
  return randomBytes(Math.ceil(length * 3/4))
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, length);
};

// Function to generate new environment variables
function generateNewEnvVariables() {
  // Generate new secure tokens
  const newJwtSecret = randomBytes(32).toString('hex');
  const newNextAuthSecret = randomBytes(32).toString('hex');
  const newDbPassword = generateSecureToken(16);
  const newSmtpPassword = generateSecureToken(16);
  const newAdminPassword = generateSecureToken(16);
  
  return {
    JWT_SECRET: newJwtSecret,
    NEXTAUTH_SECRET: newNextAuthSecret,
    DB_PASSWORD: newDbPassword,
    SMTP_PASSWORD: newSmtpPassword,
    ADMIN_PASSWORD: newAdminPassword
  };
}

// Main function to generate credentials
function generateCredentials() {
  console.log('🔄 Starting credentials generation process...');
  
  // Generate new secure tokens for environment variables
  const newCredentials = generateNewEnvVariables();
  console.log('\n🔐 Generated new secure credentials:');
  console.log('➡️ New JWT_SECRET: Generated (32 bytes hex)');
  console.log('➡️ New NEXTAUTH_SECRET: Generated (32 bytes hex)');
  console.log(`➡️ New Database Password: ${newCredentials.DB_PASSWORD}`);
  console.log(`➡️ New SMTP Password: ${newCredentials.SMTP_PASSWORD}`);
  console.log(`➡️ New Admin Password: ${newCredentials.ADMIN_PASSWORD}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Update these new credentials in your database provider (Neon DB)');
  console.log('2. Update the SMTP password in your email provider');
  console.log('3. Update all environment variables in Vercel');
  console.log('4. Update your local .env file with the new credentials');
  console.log('5. Update admin password manually in the database or using insert-admin-user.js script');
  
  console.log('\nSample .env updates (replace existing lines):');
  console.log(`JWT_SECRET=${newCredentials.JWT_SECRET}`);
  console.log(`NEXTAUTH_SECRET=${newCredentials.NEXTAUTH_SECRET}`);
  console.log('DATABASE_URL=postgres://neondb_owner:NEW_PASSWORD@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');
  console.log('SMTP_PASS=NEW_SMTP_PASSWORD');

  console.log('\n⚠️ IMPORTANT: These credentials are extremely sensitive. Store them securely!');
}

generateCredentials();
