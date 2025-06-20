// Initialize Redis database with required tables/collections
import { redis, testRedisConnection, redisTables } from '../lib/redis-client';

async function initializeRedisDatabase() {
  console.log('Starting Redis database initialization...');
  
  // Test connection
  const isConnected = await testRedisConnection();
  if (!isConnected) {
    console.error('Failed to connect to Redis database. Check your connection settings.');
    process.exit(1);
  }
  
  console.log('Connected to Redis successfully.');
  
  // Check if we already have data
  const hasUsers = await redis.exists('users');
  if (hasUsers) {
    console.log('Redis database already has data. Skipping initialization.');
    return;
  }
  
  console.log('Creating sample data for testing...');
  
  // Create admin user
  const adminId = await redisTables.users.create({
    fullName: 'Admin User',
    email: 'admin@nikahsufiyana.com',
    phone: '+919876543210',
    password: '$2a$10$IiAEeQUAQGDJZyx6Hg8Cpe8f2BtpFyjA.t43UDd5OUt8SrC0H3MlS', // hashed password 'admin123'
    gender: 'Male',
    age: 35,
    country: 'India',
    city: 'Mumbai',
    location: 'Mumbai, India',
    education: 'Masters',
    profession: 'Administrator',
    income: '10-15 LPA',
    sect: 'Sunni',
    motherTongue: 'Urdu',
    height: '5.9',
    complexion: 'Fair',
    maritalStatus: 'Single',
    profileStatus: 'active',
    subscription: 'premium',
    subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    verified: true,
    role: 'admin',
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Create a few sample users
  const user1Id = await redisTables.users.create({
    fullName: 'Ahmed Khan',
    email: 'ahmed@example.com',
    phone: '+919876543211',
    password: '$2a$10$IiAEeQUAQGDJZyx6Hg8Cpe8f2BtpFyjA.t43UDd5OUt8SrC0H3MlS', // hashed password 'password123'
    gender: 'Male',
    age: 28,
    country: 'India',
    city: 'Delhi',
    location: 'Delhi, India',
    education: 'Bachelor',
    profession: 'Software Engineer',
    income: '8-10 LPA',
    sect: 'Sunni',
    motherTongue: 'Urdu',
    height: '5.8',
    complexion: 'Wheatish',
    maritalStatus: 'Single',
    profileStatus: 'active',
    subscription: 'basic',
    verified: true,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  const user2Id = await redisTables.users.create({
    fullName: 'Fatima Ali',
    email: 'fatima@example.com',
    phone: '+919876543212',
    password: '$2a$10$IiAEeQUAQGDJZyx6Hg8Cpe8f2BtpFyjA.t43UDd5OUt8SrC0H3MlS', // hashed password 'password123'
    gender: 'Female',
    age: 26,
    country: 'India',
    city: 'Hyderabad',
    location: 'Hyderabad, India',
    education: 'Masters',
    profession: 'Doctor',
    income: '12-15 LPA',
    sect: 'Sunni',
    motherTongue: 'Urdu',
    height: '5.4',
    complexion: 'Fair',
    maritalStatus: 'Single',
    profileStatus: 'active',
    subscription: 'basic',
    verified: true,
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Create some interests between users
  await redisTables.interests.create({
    fromUserId: user1Id,
    toUserId: user2Id,
    status: 'pending',
    message: 'I am interested in your profile.',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Create some notifications
  await redisTables.notifications.create({
    userId: user2Id,
    type: 'interest_received',
    message: 'Ahmed Khan has shown interest in your profile.',
    relatedUserId: user1Id,
    read: false,
    createdAt: new Date()
  });
  
  console.log('Redis database initialization completed successfully!');
  console.log(`Created admin user with ID: ${adminId}`);
  console.log(`Created sample users with IDs: ${user1Id}, ${user2Id}`);
}

// Run the initialization function
initializeRedisDatabase()
  .catch(error => {
    console.error('Error initializing Redis database:', error);
    process.exit(1);
  });
