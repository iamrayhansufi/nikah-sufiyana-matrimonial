
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

// Replace with actual user credentials and profile IDs from your test data
const USER_A_EMAIL = 'testuserA@example.com';
const USER_A_PASSWORD = 'TestPassword123!';
const USER_B_EMAIL = 'testuserB@example.com';
const USER_B_PASSWORD = 'TestPassword123!';

let USER_A_ID = '';
let USER_B_ID = '';
let USER_A_TOKEN = '';
let USER_B_TOKEN = '';


async function registerAndLogin(email, password, fullName) {
  // Register user
  await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      fullName,
      age: 30,
      gender: 'male',
      country: 'USA'
    }),
  });

  // Login and return token and id
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginResponse.json();
  return { token: loginData.token, id: loginData.user.id };
}

async function sendInterest(senderToken, receiverProfileId) {
  const response = await fetch(`${API_BASE_URL}/profiles/send-interest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${senderToken}`,
    },
    body: JSON.stringify({ profileId: receiverProfileId }),
  });
  return response.json();
}

async function getInterests(userToken, type) {
  const response = await fetch(`${API_BASE_URL}/profiles/interests?type=${type}`, {
    headers: {
      'Authorization': `Bearer ${userToken}`,
    },
  });
  return response.json();
}

async function runTest() {
  try {
    // 1. Register and Login User A and User B
    const userA = await registerAndLogin(USER_A_EMAIL, USER_A_PASSWORD, 'Test User A');
    USER_A_TOKEN = userA.token;
    USER_A_ID = userA.id;
    console.log('User A logged in:', USER_A_ID);

    const userB = await registerAndLogin(USER_B_EMAIL, USER_B_PASSWORD, 'Test User B');
    USER_B_TOKEN = userB.token;
    USER_B_ID = userB.id;
    console.log('User B logged in:', USER_B_ID);


    // 2. User A sends interest to User B
    console.log('\nUser A sends interest to User B...');
    const interest1Result = await sendInterest(USER_A_TOKEN, USER_B_ID);
    console.log('Response:', interest1Result);

    // 3. User B sends interest to User A
    console.log('\nUser B sends interest to User A...');
    const interest2Result = await sendInterest(USER_B_TOKEN, USER_A_ID);
    console.log('Response:', interest2Result);
    if (interest2Result.isMutual) {
      console.log('✅ Mutual interest detected!');
    } else {
      console.error('❌ Mutual interest not detected!');
    }

    // 4. Verify interests for User A
    console.log('\nVerifying interests for User A...');
    const interestsA = await getInterests(USER_A_TOKEN, 'sent');
    const acceptedByA = interestsA.filter(i => i.status === 'accepted');
    if (acceptedByA.length === 1) {
      console.log('✅ User A has 1 accepted interest.');
    } else {
      console.error('❌ User A should have 1 accepted interest, but has', acceptedByA.length);
    }


    // 5. Verify interests for User B
    console.log('\nVerifying interests for User B...');
    const interestsB = await getInterests(USER_B_TOKEN, 'received');
     const acceptedByB = interestsB.filter(i => i.status === 'accepted');
    if (acceptedByB.length === 1) {
      console.log('✅ User B has 1 accepted interest.');
    } else {
      console.error('❌ User B should have 1 accepted interest, but has', acceptedByB.length);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

runTest();
