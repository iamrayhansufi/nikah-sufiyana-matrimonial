import { database } from '../lib/database-service';

async function checkSpecificUser() {
  console.log('🔍 Checking specific user from middleware logs...\n');
  
  try {
    const userId = 'user:1750487572658-s0l035761sn';
    const email = 'contact.rayhansufi@gmail.com';
    
    console.log(`Checking user: ${userId}`);
    console.log(`Email: ${email}`);
    
    // Get user from database
    const userData = await database.users.getById(userId);
    
    if (userData) {
      console.log('\n📋 User data from Redis:');
      console.log(`- ID: ${userData.id}`);
      console.log(`- Email: ${userData.email}`);
      console.log(`- Full Name: ${userData.fullName}`);
      console.log(`- Verified: ${userData.verified} (type: ${typeof userData.verified})`);
      console.log(`- Email Verified: ${userData.emailVerified} (type: ${typeof userData.emailVerified})`);
      console.log(`- Active: ${userData.active}`);
      console.log(`- Role: ${userData.role}`);
      console.log(`- Created: ${userData.createdAt}`);
      console.log(`- Last Active: ${userData.lastActive}`);
      
      const isVerified = userData.verified === true || userData.verified === 'true';
      console.log(`\n✅ Is Actually Verified: ${isVerified}`);
      
      if (!isVerified) {
        console.log('\n⚠️  User is NOT verified in database - verification needed');
        console.log('This user needs to complete email verification');
      } else {
        console.log('\n🔧 User IS verified in database but session token shows false');
        console.log('This indicates a session sync issue - the fix should resolve this');
      }
      
      // Check all fields to see if this is a complete user
      const requiredFields = ['fullName', 'email', 'age', 'gender'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        console.log(`\n⚠️  Missing required fields: ${missingFields.join(', ')}`);
        console.log('This might be an incomplete user from earlier tests');
      } else {
        console.log('\n✅ User has all required profile fields');
      }
      
    } else {
      console.log('❌ User not found in database');
      console.log('This could indicate a data inconsistency issue');
    }
    
    // Also check if we can find user by email
    console.log('\n🔍 Checking user by email...');
    const userByEmail = await database.users.getByEmail(email);
    
    if (userByEmail) {
      console.log('✅ User found by email');
      if (userByEmail.id !== userId) {
        console.log(`⚠️  ID mismatch: token has ${userId}, database has ${userByEmail.id}`);
      }
    } else {
      console.log('❌ User not found by email either');
    }
    
  } catch (error) {
    console.error('❌ Error checking user:', error);
  }
}

checkSpecificUser().catch(console.error);
