import { database } from '../lib/database-service';

async function createTestUser() {
  console.log('🔧 Creating test user with complete profile data...\n');
  
  try {
    const testUser = {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      password: "hashed_password_here",
      gender: "male",
      age: 28,
      country: "USA",
      city: "New York",
      location: "New York, USA",
      education: "Bachelor's Degree",
      sect: "Sunni",
      profession: "Software Engineer",
      income: "50000-75000",
      religion: "Islam",
      height: "5'10\"",
      complexion: "Fair",
      maritalStatus: "Single",
      motherTongue: "English",
      profileCompleted: true,
      emailVerified: true,
      phoneVerified: false,
      verified: true,
      role: "user",
      premium: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    const userId = await database.users.create(testUser);
    console.log('✅ Test user created with ID:', userId);
    
    // Verify the user was created correctly
    const retrievedUser = await database.users.getById(userId);
    console.log('\n📋 Retrieved user data:');
    console.log('Fields:', Object.keys(retrievedUser || {}));
    console.log('Sample data:');
    console.log(`- Full Name: ${retrievedUser?.fullName}`);
    console.log(`- Email: ${retrievedUser?.email}`);
    console.log(`- Age: ${retrievedUser?.age}`);
    console.log(`- Gender: ${retrievedUser?.gender}`);
    console.log(`- Location: ${retrievedUser?.location}`);
    console.log(`- Verified: ${retrievedUser?.verified}`);
    
    return userId;
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return null;
  }
}

async function testProfileWithUser(userId: string) {
  console.log(`\n🧪 Testing profile API with user: ${userId}`);
  
  try {
    const user = await database.users.getById(userId);
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found with', Object.keys(user).length, 'fields');
    
    // Check required fields for profile
    const requiredFields = ['fullName', 'email', 'age', 'gender', 'location'];
    const missingFields = requiredFields.filter(field => !user[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ All required profile fields are present');
      console.log('This user should work with the profile API');
    } else {
      console.log('⚠️  Missing required fields:', missingFields);
    }
    
  } catch (error) {
    console.error('❌ Error testing profile:', error);
  }
}

async function main() {
  const userId = await createTestUser();
  if (userId) {
    await testProfileWithUser(userId);
  }
}

main().catch(console.error);
