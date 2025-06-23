'use client';

import React, { createContext, useContext } from 'react';

interface SecurityContextType {
  isProtectionEnabled: boolean;
  enableProtection: () => void;
  disableProtection: () => void;
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

export function SecurityProvider({ children }: SecurityProviderProps) {
  const enableProtection = () => {
    // Screenshot protection feature removed
    console.log('Screenshot protection feature has been removed');
  };

  const disableProtection = () => {
    // Screenshot protection feature removed
    console.log('Screenshot protection feature has been removed');
  };

  const value: SecurityContextType = {
    isProtectionEnabled: false,
    enableProtection,
    disableProtection,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}
