// Script to initialize Redis with some sample data for testing
import { redis, redisTables } from '../lib/redis-client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

async function initializeRedisWithSampleData() {
  try {
    console.log('Starting Redis initialization with sample data...');

    // Test connection
    console.log('Testing Redis connection...');
    const connectionTest = await redis.set('test', 'Sample data initialization');
    console.log('Redis connection test:', connectionTest);

    // Sample data for users
    const sampleUsers = [
      {
        id: 'user:1',
        fullName: 'Test User 1',
        email: 'test1@example.com',
        phone: '+91987654321',
        password: 'hashed_password',
        gender: 'Male',
        age: 30,
        country: 'India',
        city: 'Mumbai',
        location: 'Mumbai, India',
        education: 'Graduate',
        profession: 'Software Engineer',
        income: '5-10 LPA',
        sect: 'Sunni',
        motherTongue: 'Urdu',
        height: '5\'9"',
        complexion: 'Fair',
        maritalStatus: 'Never Married',
        profileStatus: 'active',
        subscription: 'free',
        verified: true,
        role: 'user',
        lastActive: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user:2',
        fullName: 'Test User 2',
        email: 'test2@example.com',
        phone: '+91987654322',
        password: 'hashed_password',
        gender: 'Female',
        age: 27,
        country: 'India',
        city: 'Delhi',
        location: 'Delhi, India',
        education: 'Post Graduate',
        profession: 'Doctor',
        income: '10-15 LPA',
        sect: 'Sunni',
        motherTongue: 'Urdu',
        height: '5\'4"',
        complexion: 'Fair',
        maritalStatus: 'Never Married',
        profileStatus: 'active',
        subscription: 'free',
        verified: true,
        role: 'user',
        lastActive: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Add sample users
    console.log('Adding sample users...');
    for (const user of sampleUsers) {
      await redisTables.users.create(user);
      console.log(`Added sample user: ${user.fullName} (${user.email})`);
    }

    // Sample interests
    const sampleInterests = [
      {
        id: 'interest:1',
        fromUserId: 'user:1',
        toUserId: 'user:2',
        status: 'pending',
        message: 'I am interested in your profile.',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Add sample interests
    console.log('Adding sample interests...');
    for (const interest of sampleInterests) {
      await redisTables.interests.create(interest);
      console.log(`Added sample interest from ${interest.fromUserId} to ${interest.toUserId}`);
    }

    // Add sample shortlists
    console.log('Adding sample shortlists...');
    await redisTables.shortlists.add('user:1', 'user:2');
    console.log('Added sample shortlist: user:1 -> user:2');

    // Sample notifications
    const sampleNotifications = [
      {
        id: 'notification:1',
        userId: 'user:2',
        type: 'interest',
        message: 'Someone has shown interest in your profile.',
        relatedUserId: 'user:1',
        read: false,
        createdAt: new Date(),
      }
    ];

    // Add sample notifications
    console.log('Adding sample notifications...');
    for (const notification of sampleNotifications) {
      await redisTables.notifications.create(notification);
      console.log(`Added sample notification for user ${notification.userId}`);
    }

    console.log('Redis initialization with sample data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during Redis initialization:', error);
    process.exit(1);
  }
}

// Run the initialization function
initializeRedisWithSampleData();
