// Debug script to add test interests and check Redis data
import { redis } from '../lib/redis-client.js';

const addTestInterests = async () => {
  try {
    console.log('Adding test interests to Redis...');
    
    // First, let's check if we have any users
    const userKeys = await redis.keys('user:*');
    console.log('Found user keys:', userKeys);
    
    if (userKeys.length < 2) {
      console.log('Not enough users found. Creating test users...');
      
      // Create test users
      await redis.hset('user:1', {
        id: '1',
        email: 'test1@example.com',
        fullName: 'Ahmed Khan',
        age: '28',
        location: 'Karachi, Pakistan',
        profession: 'Software Engineer',
        profilePhoto: '/placeholder.svg?height=60&width=60'
      });
      
      await redis.hset('user:2', {
        id: '2',
        email: 'test2@example.com',
        fullName: 'Sara Ahmed',
        age: '25',
        location: 'Lahore, Pakistan',
        profession: 'Teacher',
        profilePhoto: '/placeholder.svg?height=60&width=60'
      });
      
      await redis.hset('user:3', {
        id: '3',
        email: 'test3@example.com',
        fullName: 'Ali Hassan',
        age: '30',
        location: 'Islamabad, Pakistan',
        profession: 'Doctor',
        profilePhoto: '/placeholder.svg?height=60&width=60'
      });
      
      console.log('Test users created.');
    }
    
    // Create test interests for user 1 (assuming this is the current user)
    const currentTime = new Date().toISOString();
    
    // Interest from user 2 to user 1 (received interest)
    await redis.hset('interest:1', {
      id: '1',
      senderId: '2',
      receiverId: '1',
      status: 'pending',
      message: 'Assalamu Alaikum, I would like to connect with you.',
      createdAt: currentTime,
      updatedAt: currentTime
    });
    
    // Interest from user 3 to user 1 (received interest)
    await redis.hset('interest:2', {
      id: '2',
      senderId: '3',
      receiverId: '1',
      status: 'pending',
      message: 'I am interested in getting to know you better.',
      createdAt: currentTime,
      updatedAt: currentTime
    });
    
    // Interest from user 1 to user 2 (sent interest)
    await redis.hset('interest:3', {
      id: '3',
      senderId: '1',
      receiverId: '2',
      status: 'accepted',
      message: 'Hello, I would like to connect.',
      createdAt: currentTime,
      updatedAt: currentTime
    });
    
    console.log('Test interests created successfully!');
    
    // Verify the data
    const interests = await redis.keys('interest:*');
    console.log('Interest keys created:', interests);
    
    for (const key of interests) {
      const interest = await redis.hgetall(key);
      console.log(`${key}:`, interest);
    }
    
  } catch (error) {
    console.error('Error adding test interests:', error);
  }
};

addTestInterests();
