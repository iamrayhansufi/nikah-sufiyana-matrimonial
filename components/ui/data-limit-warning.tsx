import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * A warning banner that appears when the database has reached its data transfer limit
 */
export function DataLimitWarning() {
  const [showWarning, setShowWarning] = useState(false);
  
  useEffect(() => {
    // Check for rate limit error in sessionStorage
    const hasRateLimit = sessionStorage.getItem('db_rate_limited') === 'true';
    setShowWarning(hasRateLimit);
    
    // Also listen for new rate limit errors
    const handleRateLimit = (event: Event) => {
      if ((event as CustomEvent).detail?.type === 'rate_limit') {
        setShowWarning(true);
        sessionStorage.setItem('db_rate_limited', 'true');
      }
    };
    
    window.addEventListener('app:data_limit', handleRateLimit);
    return () => window.removeEventListener('app:data_limit', handleRateLimit);
  }, []);
  
  if (!showWarning) return null;
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700">
            Our database has reached its data transfer limit. Some features may be limited or using cached data.
            This is a temporary issue and will be resolved soon.
          </p>
        </div>
      </div>
    </div>
  );
}
