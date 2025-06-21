import { NextRequest } from "next/server";

// Import the GET handler from the profile API route
const profileRoute = require('../app/api/profiles/[id]/route.ts');

async function testProfileAPIRoute() {
  console.log('🧪 Testing Profile API Route Directly...\n');
  
  try {
    const testUserId = '1750488515367-yfuq392lg8p';
    const userIdWithPrefix = `user:${testUserId}`;
    
    console.log(`Testing with user ID: ${testUserId}`);
    console.log(`Full user ID: ${userIdWithPrefix}`);
    
    // Create a mock request
    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams('public=true') }
    } as NextRequest;
    
    // Create mock params
    const mockParams = Promise.resolve({ id: testUserId });
    
    console.log('\n🔍 Calling profile API route...');
    
    // Call the GET handler
    const response = await profileRoute.GET(mockRequest, { params: mockParams });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile API response successful');
      console.log('Response status:', response.status);
      console.log('Profile data keys:', Object.keys(data));
      console.log('\nProfile sample:');
      console.log(`- ID: ${data.id}`);
      console.log(`- Name: ${data.name}`);
      console.log(`- Full Name: ${data.fullName}`);
      console.log(`- Age: ${data.age}`);
      console.log(`- Gender: ${data.gender}`);
      console.log(`- Location: ${data.location}`);
      console.log(`- Verified: ${data.verified}`);
    } else {
      console.log('❌ Profile API failed');
      console.log('Response status:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing profile API route:', error);
  }
}

testProfileAPIRoute().catch(console.error);
