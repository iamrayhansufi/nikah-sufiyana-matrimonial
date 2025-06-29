// Admin Dashboard Test Script
const testEndpoints = [
  { name: 'Stats', url: '/api/admin/stats' },
  { name: 'Users', url: '/api/admin/users' },
  { name: 'Users (Pending)', url: '/api/admin/users?status=pending' },
  { name: 'Dashboard Data', url: '/api/admin/dashboard' }
];

async function testAdminEndpoints() {
  console.log('🔍 Testing Admin Dashboard Functions...\n');
  
  // First get a fresh token
  console.log('Getting admin token...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nikahsufiyana.com',
        password: 'BANikah@321#'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) throw new Error(loginData.error);
    
    const token = loginData.token;
    console.log('✅ Admin token obtained\n');
    
    // Test each endpoint
    for (const endpoint of testEndpoints) {
      console.log(`Testing ${endpoint.name}...`);
      try {
        const response = await fetch(`http://localhost:3000${endpoint.url}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ ${endpoint.name}: SUCCESS`);
          
          // Show sample data based on endpoint
          if (endpoint.name === 'Stats') {
            console.log(`   - Total Users: ${data.totalRegistrations}`);
            console.log(`   - Active Subscriptions: ${data.activeSubscriptions}`);
            console.log(`   - Pending Approvals: ${data.pendingApprovals}`);
            console.log(`   - Recent Registrations: ${data.recentRegistrations?.length} entries`);
          } else if (endpoint.name.includes('Users')) {
            console.log(`   - Users returned: ${data.users?.length || 0}`);
            console.log(`   - Total: ${data.pagination?.total || 'N/A'}`);
          }
          
        } else {
          console.log(`❌ ${endpoint.name}: FAILED - ${data.error}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ERROR - ${error.message}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Failed to get admin token:', error.message);
  }
}

// Use dynamic import for fetch in Node.js
if (typeof fetch === 'undefined') {
  import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
    testAdminEndpoints();
  });
} else {
  testAdminEndpoints();
}
