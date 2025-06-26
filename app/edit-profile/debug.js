// Debug script for edit-profile issues
// Open browser console and run this script to diagnose issues

console.log('🔍 Starting Edit Profile Debug...');

// Check authentication
fetch('/api/auth/session')
  .then(res => res.json())
  .then(session => {
    console.log('📋 Session Data:', session);
    if (!session || !session.user) {
      console.error('❌ No valid session found. User must be logged in.');
      return;
    }
    
    console.log('✅ User is authenticated:', session.user.id);
    
    // Test profile API endpoint
    console.log('🔍 Testing profile API...');
    return fetch(`/api/profiles/${session.user.id}`);
  })
  .then(res => {
    if (!res.ok) {
      console.error('❌ Profile API failed:', res.status, res.statusText);
      return res.text().then(text => {
        console.error('Error response:', text);
      });
    }
    return res.json();
  })
  .then(profile => {
    if (profile) {
      console.log('✅ Profile data loaded successfully');
      console.log('📊 Profile fields:', Object.keys(profile));
      
      // Test update functionality
      console.log('🔍 Testing profile update...');
      const testData = {
        fullName: profile.fullName || 'Test Name'
      };
      
      return fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
    }
  })
  .then(res => {
    if (!res.ok) {
      console.error('❌ Profile update failed:', res.status, res.statusText);
      return res.text().then(text => {
        console.error('Update error response:', text);
      });
    }
    return res.json();
  })
  .then(result => {
    if (result) {
      console.log('✅ Profile update test successful');
      console.log('📊 Updated profile:', result);
    }
  })
  .catch(error => {
    console.error('❌ Debug script error:', error);
  });

// Check for JavaScript errors on the page
window.addEventListener('error', (event) => {
  console.error('❌ JavaScript Error:', event.error);
});

// Check form submission handlers
setTimeout(() => {
  const forms = document.querySelectorAll('form');
  console.log(`📋 Found ${forms.length} forms on the page`);
  
  forms.forEach((form, index) => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      console.log(`📋 Form ${index + 1} has submit button:`, submitButton.textContent);
      
      // Check if form has submit handler
      const hasOnSubmit = form.onsubmit !== null;
      console.log(`📋 Form ${index + 1} has onsubmit handler:`, hasOnSubmit);
    }
  });
}, 1000);

console.log('🔍 Debug script completed. Check the console for results.');
