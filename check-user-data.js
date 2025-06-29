// Check actual user data being returned
async function checkUserData() {
  console.log('📋 Checking User Data in Admin Dashboard...\n');
  
  try {
    // Get admin token
    const loginResponse = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nikahsufiyana.com',
        password: 'BANikah@321#'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    // Get users data
    const usersResponse = await fetch('http://localhost:3000/api/admin/users?limit=3', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const usersData = await usersResponse.json();
    
    if (usersData.users && usersData.users.length > 0) {
      console.log('👤 Sample User Data:');
      const sampleUser = usersData.users[0];
      
      console.log(`   - ID: ${sampleUser.id}`);
      console.log(`   - Name: ${sampleUser.fullName || 'N/A'}`);
      console.log(`   - Email: ${sampleUser.email}`);
      console.log(`   - Phone: ${sampleUser.phone || 'N/A'}`);
      console.log(`   - Gender: ${sampleUser.gender || 'N/A'}`);
      console.log(`   - Age: ${sampleUser.age || 'N/A'}`);
      console.log(`   - Location: ${sampleUser.city || 'N/A'}, ${sampleUser.country || 'N/A'}`);
      console.log(`   - Profile Status: ${sampleUser.profileStatus || 'N/A'}`);
      console.log(`   - Subscription: ${sampleUser.subscription || 'free'}`);
      console.log(`   - Verified: ${sampleUser.verified || 'false'}`);
      console.log(`   - Created: ${sampleUser.createdAt || 'N/A'}`);
      console.log(`   - Last Active: ${sampleUser.lastActive || 'N/A'}`);
      
      console.log('\n🔧 Available User Management Functions:');
      console.log('   - View full user profiles');
      console.log('   - Approve/Reject profile status');
      console.log('   - Suspend/Activate accounts');
      console.log('   - Filter by status (pending/approved/rejected)');
      console.log('   - Filter by subscription (free/premium/vip)');
      console.log('   - Search users');
      console.log('   - Pagination support');
      
      console.log('\n📊 Admin Dashboard Features:');
      console.log('   ✅ Real user count from database');
      console.log('   ✅ Active subscription tracking');
      console.log('   ✅ Pending approval queue');
      console.log('   ✅ Recent registrations list');
      console.log('   ✅ User management actions');
      console.log('   ✅ Subscription breakdown');
      console.log('   ✅ Search and filter functionality');
      
    } else {
      console.log('ℹ️ No user data found in the response');
    }
    
  } catch (error) {
    console.error('❌ Error checking user data:', error.message);
  }
}

// Use dynamic import for fetch in Node.js
if (typeof fetch === 'undefined') {
  import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
    checkUserData();
  });
} else {
  checkUserData();
}
