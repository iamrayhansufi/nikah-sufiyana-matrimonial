// Test script to check interests API
const testInterestsAPI = async () => {
  try {
    console.log('Testing interests API...');
    
    // Test the received interests endpoint
    const response = await fetch('http://localhost:3001/api/profiles/interests?type=received', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Interests data:', data);
      console.log('Number of interests:', data.length);
      console.log('Pending interests:', data.filter(i => i.status === 'pending').length);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

// Test the API
testInterestsAPI();
