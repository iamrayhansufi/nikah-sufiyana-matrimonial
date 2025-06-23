import { NextRequest } from "next/server";
import { DELETE } from "@/app/api/profiles/delete-photo/route";

async function testAPIDeletion() {
  console.log("🧪 Testing API deletion directly...");
  
  // Create a mock request
  const photoToDelete = "/api/secure-image/gallery-1750495215968-bkyhp1mtzhi-0-1750676149175";
  
  const mockRequest = {
    json: async () => ({ photoUrl: photoToDelete }),
    headers: new Map([
      ['cookie', 'next-auth.session-token=your-session-token'],
      ['content-type', 'application/json']
    ])
  } as unknown as NextRequest;

  try {
    console.log("📞 Calling DELETE API directly...");
    const response = await DELETE(mockRequest);
    
    const result = await response.json();
    console.log("📊 API Response:", result);
    console.log("📊 Response Status:", response.status);
    
  } catch (error) {
    console.error("❌ API Test Error:", error);
  }
}

testAPIDeletion().catch(console.error);
