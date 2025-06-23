'use client';

import { useEffect } from 'react';
import { ScreenshotProtection } from '@/lib/screenshot-protection';

interface UseScreenshotProtectionOptions {
  enabled?: boolean;
  onSuspiciousActivity?: (reason: string) => void;
}

export function useScreenshotProtection(options: UseScreenshotProtectionOptions = {}) {
  const { enabled = true, onSuspiciousActivity } = options;

  useEffect(() => {
    if (!enabled) return;

    const protection = ScreenshotProtection.getInstance();
    protection.enable();

    if (onSuspiciousActivity) {
      protection.onSuspiciousActivity(onSuspiciousActivity);
    }

    return () => {
      if (onSuspiciousActivity) {
        protection.removeSuspiciousActivityCallback(onSuspiciousActivity);
      }
    };
  }, [enabled, onSuspiciousActivity]);

  return {
    enable: () => ScreenshotProtection.getInstance().enable(),
    disable: () => ScreenshotProtection.getInstance().disable(),
    isEnabled: () => ScreenshotProtection.getInstance().isEnabled()
  };
}
