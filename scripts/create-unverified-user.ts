import { database } from '../lib/database-service';
import bcrypt from 'bcryptjs';

async function createUnverifiedUser() {
  console.log('🧪 Creating unverified test user...\n');
  
  try {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = {
      fullName: "Test User",
      email: "test.user@example.com",
      phone: "+1234567890",
      password: hashedPassword,
      gender: "male",
      age: 30,
      country: "USA",
      city: "Test City",
      location: "Test City, USA",
      education: "Bachelor's Degree",
      sect: "Sunni",
      profession: "Tester",
      income: "50000-75000",
      religion: "Islam",
      height: "5'10\"",
      complexion: "Fair",
      maritalStatus: "Single",
      motherTongue: "English",
      profileCompleted: false,
      emailVerified: false,
      phoneVerified: false,
      verified: false, // NOT verified initially
      role: "user",
      premium: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    const userId = await database.users.create(testUser);
    console.log('✅ Unverified test user created with ID:', userId);
    
    // Verify the user was created correctly
    const retrievedUser = await database.users.getById(userId);
    console.log('\n📋 User verification status:');
    console.log(`- Email: ${retrievedUser?.email}`);
    console.log(`- Verified: ${retrievedUser?.verified} (type: ${typeof retrievedUser?.verified})`);
    console.log(`- Email Verified: ${retrievedUser?.emailVerified}`);
    
    // Now simulate verification
    console.log('\n🔄 Simulating email verification...');
    await database.users.update(userId, { 
      verified: true,
      emailVerified: true 
    });
    
    // Check if verification was successful
    const verifiedUser = await database.users.getById(userId);
    console.log('\n✅ After verification:');
    console.log(`- Email: ${verifiedUser?.email}`);
    console.log(`- Verified: ${verifiedUser?.verified} (type: ${typeof verifiedUser?.verified})`);
    console.log(`- Email Verified: ${verifiedUser?.emailVerified}`);
    
    console.log('\n🎯 Test user for login testing:');
    console.log(`Email: ${verifiedUser?.email}`);
    console.log('Password: password123');
    console.log(`User ID: ${userId}`);
    
    return userId;
    
  } catch (error) {
    console.error('❌ Error creating unverified user:', error);
    return null;
  }
}

createUnverifiedUser().catch(console.error);
