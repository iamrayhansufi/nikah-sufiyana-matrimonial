// This simulates the exact frontend API call
async function testFrontendAPICall() {
  console.log("🧪 Testing frontend API call simulation...");
  
  const photoToDelete = "/api/secure-image/test-photo-1750676659573";
  
  try {
    const response = await fetch('http://localhost:3000/api/profiles/delete-photo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photoUrl: photoToDelete
      })
    });
    
    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Response data:", data);
    } else {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
    }
    
  } catch (error) {
    console.error("❌ Fetch error:", error);
  }
}

testFrontendAPICall().catch(console.error);
