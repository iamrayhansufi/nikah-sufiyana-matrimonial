// Test script to manually verify a user's login credentials
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node test-credentials.js <email> <password>');
  process.exit(1);
}

async function runScript() {
  try {
    console.log(`🔍 Looking up user with email: ${email}`);
    
    // Get user data
    const userArr = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!userArr || userArr.length === 0) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }
    
    const user = userArr[0];
    console.log('📋 User found:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      verified: user.verified,
      hashedPasswordLength: user.password?.length || 0
    });
    
    // Check password
    console.log('🔑 Verifying password...');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ Password is VALID');
      console.log('🔒 Login should be successful with these credentials');
    } else {
      console.log('❌ Password is INVALID');
      console.log('🔒 These credentials will NOT allow login');
      
      // For troubleshooting only - DO NOT include this in production code
      console.log('DEBUG INFO:');
      console.log('- Provided password:', password);
      console.log('- Stored hash (first 10 chars):', user.password.substring(0, 10) + '...');
    }
    
    console.log('\n🔍 User information that would be returned to NextAuth:');
    console.log({
      id: user.id.toString(),
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      verified: user.verified || false
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

runScript();
