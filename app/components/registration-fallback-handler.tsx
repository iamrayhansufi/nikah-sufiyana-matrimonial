'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

/**
 * Fallback registration handler that shows when the main registration
 * API suggests using the fallback method
 */
interface RegistrationFallbackHandlerProps {
  onTryFallback: () => Promise<void>;
  fallbackDetails?: string;
  isVisible?: boolean;
}

export default function RegistrationFallbackHandler({ 
  onTryFallback,
  fallbackDetails,
  isVisible = false
}: RegistrationFallbackHandlerProps) {
  const [isTrying, setIsTrying] = useState(false);
  
  if (!isVisible) return null;
  
  const handleTryFallback = async () => {
    setIsTrying(true);
    
    try {
      await onTryFallback();
    } finally {
      setIsTrying(false);
    }
  };
  
  return (
    <Alert className="bg-red-50 border-red-200 text-red-800 my-4">
      <AlertTitle className="text-red-800 font-semibold">
        Registration Issue Detected
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          We're experiencing some technical difficulties with our database connection.
          {fallbackDetails ? ` ${fallbackDetails}` : ''}
        </p>
        <p className="mb-4">
          Your data can be stored temporarily until our systems are back to normal.
          You'll still be able to log in and use the site.
        </p>
        <Button 
          variant="outline" 
          className="bg-red-100 border-red-300 hover:bg-red-200 text-red-900"
          onClick={handleTryFallback}
          disabled={isTrying}
        >
          {isTrying ? 'Processing...' : 'Use Temporary Registration'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
