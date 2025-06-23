'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ScreenshotProtection } from '@/lib/screenshot-protection';

interface SecurityContextType {
  isProtectionEnabled: boolean;
  enableProtection: () => void;
  disableProtection: () => void;
  suspiciousActivity: boolean;
  lastActivity: string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function useSecurityProtection() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityProtection must be used within a SecurityProvider');
  }
  return context;
}

interface SecurityProviderProps {
  children: React.ReactNode;
  autoEnable?: boolean;
}

export function SecurityProvider({ children, autoEnable = true }: SecurityProviderProps) {
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [lastActivity, setLastActivity] = useState('');

  useEffect(() => {
    const protection = ScreenshotProtection.getInstance();

    // Handle suspicious activity
    const handleSuspiciousActivity = (reason: string) => {
      setSuspiciousActivity(true);
      setLastActivity(reason);
      
      // Clear suspicious activity flag after 3 seconds
      setTimeout(() => {
        setSuspiciousActivity(false);
      }, 3000);
    };

    protection.onSuspiciousActivity(handleSuspiciousActivity);

    // Auto-enable protection if requested
    if (autoEnable) {
      protection.enable();
      setIsProtectionEnabled(true);
    }

    // Cleanup on unmount
    return () => {
      protection.removeSuspiciousActivityCallback(handleSuspiciousActivity);
    };
  }, [autoEnable]);

  const enableProtection = () => {
    const protection = ScreenshotProtection.getInstance();
    protection.enable();
    setIsProtectionEnabled(true);
  };

  const disableProtection = () => {
    const protection = ScreenshotProtection.getInstance();
    protection.disable();
    setIsProtectionEnabled(false);
  };

  const value = {
    isProtectionEnabled,
    enableProtection,
    disableProtection,
    suspiciousActivity,
    lastActivity
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
      
      {/* Global security overlay for maximum protection */}
      {suspiciousActivity && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[9999] pointer-events-none"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold mb-2">Content Protected</h2>
            <p className="text-xl mb-4">Screenshot attempt detected and blocked</p>
            <p className="text-sm text-gray-300">Activity: {lastActivity}</p>
            <div className="mt-6 animate-pulse">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span className="text-sm">This action has been logged for security</span>
            </div>
          </div>
        </div>
      )}
    </SecurityContext.Provider>
  );
}
