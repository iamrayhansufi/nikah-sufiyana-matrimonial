import { database } from '../lib/database-service';

async function checkUserVerificationStatus() {
  console.log('🔍 Checking User Verification Status...\n');
  
  try {
    // Get all user IDs
    const allUserIds = await database.users.getAllUserIds();
    console.log(`Found ${allUserIds.length} users in Redis`);
    
    // Check each user's verification status
    for (const userId of allUserIds) {
      const userIdStr = String(userId);
      const userData = await database.users.getById(userIdStr);
      
      if (userData && userData.email) {
        console.log(`\n📧 User: ${userData.email}`);
        console.log(`- ID: ${userIdStr}`);
        console.log(`- Full Name: ${userData.fullName}`);
        console.log(`- Verified: ${userData.verified} (type: ${typeof userData.verified})`);
        console.log(`- Email Verified: ${userData.emailVerified} (type: ${typeof userData.emailVerified})`);
        console.log(`- Active: ${userData.active}`);
        console.log(`- Created: ${userData.createdAt}`);
        console.log(`- Last Active: ${userData.lastActive}`);
        
        // Check if verified field is properly set
        const isVerified = userData.verified === true || userData.verified === 'true';
        console.log(`- Is Actually Verified: ${isVerified}`);
        
        if (!isVerified) {
          console.log(`⚠️  User ${userData.email} is NOT verified - this will cause login redirect issues`);
        } else {
          console.log(`✅ User ${userData.email} is verified`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking user verification status:', error);
  }
}

checkUserVerificationStatus().catch(console.error);
