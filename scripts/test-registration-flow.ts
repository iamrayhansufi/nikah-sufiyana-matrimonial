import { database } from '../lib/database-service';

async function testRegistrationFlow() {
  console.log('🧪 Testing Registration Flow...\n');
  
  try {
    // Create a user as the registration API would
    const testUser = {
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1987654321",
      password: "$2a$12$hashedpasswordhere", // Hashed password
      gender: "female",
      age: 25,
      country: "Canada",
      city: "Toronto",
      location: "Toronto, Canada",
      education: "Master's Degree",
      sect: "Sunni",
      profession: "Doctor",
      income: "75000-100000",
      religion: "Islam",
      height: "5'6\"",
      complexion: "Fair",
      maritalStatus: "Single",
      motherTongue: "Urdu",
      profileCompleted: false,
      emailVerified: false,
      phoneVerified: false,
      verified: true, // For testing purposes
      role: "user",
      premium: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    console.log('1. Creating user through registration flow...');
    const userId = await database.users.create(testUser);
    console.log('✅ User created with ID:', userId);
    
    console.log('\n2. Verifying user can be retrieved...');
    const retrievedUser = await database.users.getById(userId);
    if (retrievedUser) {
      console.log('✅ User successfully retrieved');
      console.log('User data sample:');
      console.log(`- Full Name: ${retrievedUser.fullName}`);
      console.log(`- Email: ${retrievedUser.email}`);
      console.log(`- Age: ${retrievedUser.age}`);
      console.log(`- Gender: ${retrievedUser.gender}`);
    } else {
      console.log('❌ Failed to retrieve user');
      return;
    }
    
    console.log('\n3. Testing profile format for dashboard...');
    // Simulate what the profile API would return
    const profileData = {
      id: retrievedUser.id,
      name: retrievedUser.fullName || retrievedUser.name || 'Unknown',
      fullName: retrievedUser.fullName || retrievedUser.name || 'Unknown',
      age: retrievedUser.age,
      gender: retrievedUser.gender,
      location: retrievedUser.location,
      education: retrievedUser.education,
      profession: retrievedUser.profession,
      maritalStatus: retrievedUser.maritalStatus,
      sect: retrievedUser.sect,
      verified: retrievedUser.verified,
      profileCompleted: retrievedUser.profileCompleted,
      // ... other fields
    };
    
    console.log('✅ Profile format ready for dashboard:');
    console.log('Sample profile data:', {
      name: profileData.name,
      age: profileData.age,
      location: profileData.location,
      verified: profileData.verified
    });
    
    console.log('\n🎉 Registration flow test completed successfully!');
    console.log(`Test user ID for manual testing: ${userId}`);
    
    return userId;
    
  } catch (error) {
    console.error('❌ Error testing registration flow:', error);
    return null;
  }
}

testRegistrationFlow().catch(console.error);
