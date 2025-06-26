// Test component to verify profile update functionality
// Add this to your edit-profile page temporarily for debugging

"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

const ProfileUpdateTest = () => {
  const { data: session } = useSession();
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testUpdate = async () => {
    setIsLoading(true);
    setTestResult('Testing...');

    try {
      // Check session first
      if (!session?.user?.id) {
        setTestResult('❌ No valid session found');
        return;
      }

      console.log('🔍 Testing with user ID:', session.user.id);

      // Test basic profile update
      const testData = {
        fullName: 'Test Update ' + Date.now()
      };

      console.log('📤 Sending test data:', testData);

      const response = await fetch(`/api/profiles/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(testData)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        setTestResult(`❌ Update failed: ${response.status} - ${errorText}`);
        return;
      }

      const result = await response.json();
      console.log('✅ Update successful:', result);
      setTestResult('✅ Update successful! Check console for details.');

    } catch (error) {
      console.error('❌ Test error:', error);
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50 mb-4">
      <h3 className="font-bold mb-2">🔧 Profile Update Test</h3>
      <Button 
        onClick={testUpdate} 
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading ? 'Testing...' : 'Test Profile Update'}
      </Button>
      {testResult && (
        <div className="mt-2 p-2 rounded bg-white border text-sm">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default ProfileUpdateTest;

// Add this component to your edit-profile page right after the header
// <ProfileUpdateTest />
