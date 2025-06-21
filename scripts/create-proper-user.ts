import { database } from '../lib/database-service';
import bcrypt from 'bcryptjs';

async function createProperUserForEmail() {
  console.log('🔧 Creating proper user for contact.rayhansufi@gmail.com...\n');
  
  try {
    const email = 'contact.rayhansufi@gmail.com';
    
    // Check if user already exists by email
    const existingUser = await database.users.getByEmail(email);
    if (existingUser) {
      console.log('⚠️  User already exists with this email');
      console.log('User data:', {
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.fullName,
        verified: existingUser.verified
      });
      return;
    }
    
    // Create a complete user with proper data
    const hashedPassword = await bcrypt.hash('tempPassword123', 12);
    
    const userData = {
      fullName: "Mohammed Rayhan Sufi", // From the middleware logs
      email: email,
      phone: "+918008924543", // From the middleware logs
      password: hashedPassword,
      gender: "male", // Assumption based on name
      age: 30, // Default value
      country: "India", // Based on phone code
      city: "Mumbai", // Default
      location: "Mumbai, India",
      education: "Bachelor's Degree",
      sect: "Sunni",
      profession: "Professional",
      income: "50000-75000",
      religion: "Islam",
      height: "5'8\"",
      complexion: "Fair",
      maritalStatus: "Single",
      motherTongue: "Urdu",
      profileCompleted: false,
      emailVerified: false,
      phoneVerified: false,
      verified: false, // Will need to verify email
      role: "user",
      premium: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    console.log('Creating user with complete profile data...');
    const userId = await database.users.create(userData);
    
    console.log('✅ User created successfully');
    console.log('User details:');
    console.log(`- ID: ${userId}`);
    console.log(`- Email: ${email}`);
    console.log(`- Full Name: ${userData.fullName}`);
    console.log(`- Phone: ${userData.phone}`);
    console.log(`- Verified: ${userData.verified}`);
    console.log(`- Temporary Password: tempPassword123`);
    
    console.log('\n📧 User should now:');
    console.log('1. Login with email and temporary password');
    console.log('2. Complete email verification');
    console.log('3. Update their password and profile');
    
    return userId;
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return null;
  }
}

createProperUserForEmail().catch(console.error);
