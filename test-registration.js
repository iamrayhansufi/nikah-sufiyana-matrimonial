// Test script for direct user registration
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

async function testUserRegistration() {
  console.log('Starting direct user registration test...');
  
  // Use direct unpooled connection for reliability
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  
  if (!url) {
    console.error('No database URL found in environment variables');
    return;
  }
  
  console.log(`Using connection URL: ${url.substring(0, 25)}...`);
  
  try {
    // Connect to database
    const sql = neon(url);
    
    // Check connection
    console.log('Testing database connection...');
    const connTest = await sql`SELECT current_database() as db`;
    console.log(`Connected to database: ${connTest[0].db}`);
    
    // Create test user data
    const testUser = {
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: `1234567${Date.now().toString().substring(8, 13)}`,
      password: await bcrypt.hash('Test12345', 10),
      gender: 'male',
      age: 30,
      country: 'India',
      city: 'Mumbai',
      location: 'Mumbai',
      education: 'Bachelors',
      sect: 'Test',
      profileStatus: 'pending_verification'
    };
    
    console.log('Inserting test user:', {
      email: testUser.email,
      phone: testUser.phone
    });
    
    // Try to insert user
    const insertResult = await sql`
      INSERT INTO users (
        full_name, email, phone, password, gender, age, country, city,
        location, education, sect, profile_status
      ) VALUES (
        ${testUser.fullName},
        ${testUser.email},
        ${testUser.phone},
        ${testUser.password},
        ${testUser.gender},
        ${testUser.age},
        ${testUser.country},
        ${testUser.city},
        ${testUser.location},
        ${testUser.education},
        ${testUser.sect},
        ${testUser.profileStatus}
      ) RETURNING id, email
    `;
    
    console.log('User inserted successfully:', insertResult);
    
  } catch (error) {
    console.error('Error in test registration:', error);
    
    if (error.message.includes('password authentication')) {
      console.error('Authentication error! Check database credentials.');
    } else if (error.message.includes('duplicate key')) {
      console.error('User already exists. Try with a different email/phone.');
    } else if (error.message.includes('relation "users" does not exist')) {
      console.error('Table "users" does not exist. Check migrations.');
    } else {
      console.error('Unknown error:', error.message);
    }
  }
}

testUserRegistration();
