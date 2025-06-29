// Quick debug script to check current interest state
console.log('🔍 Quick Interest Debug Check');
console.log('============================\n');

// Check if we can access the interests API
fetch('http://localhost:3000/api/profiles/interests?type=received')
  .then(response => {
    console.log('API Response Status:', response.status);
    console.log('API Response Status Text:', response.statusText);
    
    if (response.ok) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    if (typeof data === 'string') {
      console.log('❌ Error Response:', data);
    } else if (Array.isArray(data)) {
      console.log('✅ Received Interests:', data.length);
      
      if (data.length > 0) {
        console.log('📋 Sample Interest:', {
          id: data[0].id,
          status: data[0].status,
          fromUser: data[0].fromUser?.fullName,
          createdAt: data[0].createdAt
        });
      }
      
      // Check status breakdown
      const statusBreakdown = data.reduce((acc, interest) => {
        acc[interest.status] = (acc[interest.status] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Status Breakdown:', statusBreakdown);
    } else {
      console.log('📄 Unexpected Response:', data);
    }
  })
  .catch(error => {
    console.error('❌ Fetch Error:', error);
  });

// Also check send interest functionality with a test
console.log('\n🧪 Testing Send Interest API...');

fetch('http://localhost:3000/api/profiles/send-interest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    profileId: 'test-profile-123',
    message: 'Debug test message'
  })
})
.then(response => {
  console.log('Send Interest Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Send Interest Response:', data);
})
.catch(error => {
  console.error('Send Interest Error:', error);
});
