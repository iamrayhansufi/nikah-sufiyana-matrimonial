/**
 * This script tests the updated API routes to verify they are working with Redis
 */

import { config } from 'dotenv';
// Load environment variables
config({ path: '.env' });

import { redis, testRedisConnection } from '../lib/redis-client';
import { database } from '../lib/database-service';
import { verifyOTP, createVerificationOTP } from '../lib/verification-redis';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    console.log('🔍 Verifying Redis connection...');
    const redisConnected = await testRedisConnection();
    
    if (!redisConnected) {
      console.error('❌ Redis connection failed. Please check your Redis configuration.');
      process.exit(1);
    }
    
    console.log('✅ Redis connection successful!');
    
    // Test user creation and retrieval
    console.log('\n🔍 Testing user operations...');
    const testUserId = `user:${Date.now()}-test`;
    const testPassword = 'P@ssw0rd123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const testUser = {
      id: testUserId,
      email: `test-${Date.now()}@example.com`,
      fullName: 'Test User',
      password: hashedPassword,
      verified: false,
      createdAt: new Date().toISOString(),
      role: 'user'
    };
    
    await database.users.create(testUser);
    console.log(`✅ Created test user: ${testUser.fullName} (${testUser.id})`);
    
    const retrievedUser = await database.users.getById(testUserId);
    console.log(`✅ Retrieved test user: ${retrievedUser.fullName}`);
    
    // Test user retrieval by email
    const userByEmail = await database.users.getByEmail(testUser.email);
    console.log(`✅ Retrieved user by email: ${userByEmail.fullName}`);
    
    // Test user update
    await database.users.update(testUserId, { verified: true });
    const updatedUser = await database.users.getById(testUserId);
    console.log(`✅ Updated user verified status: ${updatedUser.verified}`);
    
    // Test interests
    console.log('\n🔍 Testing interest operations...');
    const interestId = await database.interests.create({
      id: `interest:${Date.now()}`,
      fromUserId: testUserId,
      toUserId: `user:${Date.now()}-target`,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Created interest: ${interestId}`);
    
    // Test interest update
    await database.interests.update(interestId, { status: 'accepted' });
    console.log(`✅ Updated interest status`);
    
    // Test OTP generation and verification
    console.log('\n🔍 Testing OTP operations...');
    const { success, otp } = await createVerificationOTP(testUser.email);
    console.log(`✅ Created OTP for ${testUser.email}: ${otp}`);
    
    const isValid = await verifyOTP(testUser.email, otp as string);
    console.log(`✅ OTP verification result: ${isValid}`);
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await redis.del(`user:${testUserId}`);
    await redis.srem('users', testUserId);
    await redis.del(`interest:${interestId}`);
    console.log('✅ Cleanup complete');
    
    console.log('\n🎉 All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during API route verification:', error);
    process.exit(1);
  }
}

main();
