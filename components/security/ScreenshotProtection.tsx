'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface ScreenshotProtectionProps {
  children: React.ReactNode;
  level?: 'basic' | 'advanced' | 'maximum';
  watermark?: string;
  blurOnSuspicious?: boolean;
  className?: string;
}

export default function ScreenshotProtection({ 
  children, 
  level = 'advanced',
  watermark = 'NIKAH SUFIYANA - PRIVATE',
  blurOnSuspicious = true,
  className = ''
}: ScreenshotProtectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isProtected, setIsProtected] = useState(true);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [lastActivity, setLastActivity] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect screenshot attempts
    const detectScreenshot = () => {
      // Method 1: Detect visibility change (common during screenshots)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setSuspiciousActivity(true);
          setLastActivity('Page hidden - potential screenshot');
          setTimeout(() => setSuspiciousActivity(false), 3000);
        }
      };

      // Method 2: Detect focus changes
      const handleFocusChange = () => {
        setSuspiciousActivity(true);
        setLastActivity('Window focus lost');
        setTimeout(() => setSuspiciousActivity(false), 2000);
      };

      // Method 3: Detect right-click and common screenshot shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent common screenshot shortcuts
        const isScreenshotKey = (
          (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac screenshots
          (e.key === 'PrintScreen') || // Windows screenshot
          (e.ctrlKey && e.shiftKey && e.key === 'S') || // Snipping tool
          (e.ctrlKey && e.key === 'p') || // Print
          (e.key === 'F12') || // DevTools
          (e.ctrlKey && e.key === 'c') || // Copy
          (e.ctrlKey && e.key === 'a') || // Select all
          (e.ctrlKey && e.key === 's') // Save
        );

        if (isScreenshotKey) {
          e.preventDefault();
          e.stopPropagation();
          setSuspiciousActivity(true);
          setLastActivity(`Blocked shortcut: ${e.key}`);
          setTimeout(() => setSuspiciousActivity(false), 3000);
          return false;
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        setSuspiciousActivity(true);
        setLastActivity('Right-click blocked');
        setTimeout(() => setSuspiciousActivity(false), 1500);
        return false;
      };

      // Method 4: Detect DevTools opening
      const detectDevTools = () => {
        const threshold = 160;
        const interval = setInterval(() => {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            setSuspiciousActivity(true);
            setLastActivity('Developer tools detected');
            setTimeout(() => setSuspiciousActivity(false), 5000);
          }
        }, 1000);

        return () => clearInterval(interval);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleFocusChange);
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('dragstart', (e) => e.preventDefault());
      
      let cleanupDevTools: (() => void) | undefined;
      if (level === 'maximum') {
        cleanupDevTools = detectDevTools();
      }

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleFocusChange);
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('contextmenu', handleContextMenu);
        if (cleanupDevTools) cleanupDevTools();
      };
    };

    const cleanup = detectScreenshot();
    return cleanup;
  }, [level]);

  // Canvas-based watermark overlay
  useEffect(() => {
    if (!containerRef.current || level === 'basic') return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createWatermark = () => {
      canvas.width = 300;
      canvas.height = 60;
      ctx.globalAlpha = 0.05;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000000';
      ctx.rotate(-Math.PI / 12);
      ctx.fillText(watermark, 10, 30);
      ctx.fillText(new Date().toISOString(), 10, 50);
      
      return canvas.toDataURL();
    };

    const watermarkUrl = createWatermark();
    
    if (containerRef.current) {
      containerRef.current.style.backgroundImage = `url(${watermarkUrl})`;
      containerRef.current.style.backgroundRepeat = 'repeat';
      containerRef.current.style.backgroundPosition = '0 0, 150px 30px';
    }
  }, [watermark, level]);
  const protectionStyles: React.CSSProperties = {
    position: 'relative',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    filter: suspiciousActivity && blurOnSuspicious ? 'blur(15px) brightness(0.3)' : 'none',
    transition: 'filter 0.3s ease',
    ...(level === 'maximum' && {
      background: 'linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.02) 50%, transparent 60%)',
      backgroundSize: '20px 20px',
    })
  } as React.CSSProperties;

  return (
    <div 
      ref={containerRef} 
      style={protectionStyles} 
      className={`screenshot-protected ${className}`}
    >
      {/* Overlay for suspicious activity */}
      {suspiciousActivity && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 text-white rounded-lg">
          <div className="text-center p-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-2xl font-bold mb-2">🔒 Content Protected</h3>
            <p className="text-lg mb-2">Screenshots and copying are not allowed</p>
            <p className="text-sm text-gray-300">Reason: {lastActivity}</p>
            <div className="mt-4 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">This activity has been logged</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Protected content */}
      <div className={suspiciousActivity ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
      
      {/* Invisible overlay to prevent selection */}
      {level !== 'basic' && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ 
            background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.005) 2px, rgba(255,255,255,0.005) 4px)',
          }}
        />
      )}

      {/* Protection indicator */}
      {level === 'maximum' && (
        <div className="absolute top-2 right-2 z-20">
          <div className="flex items-center bg-black bg-opacity-20 rounded-full px-2 py-1">
            <Shield className="w-3 h-3 text-green-400 mr-1" />
            <span className="text-xs text-gray-600">Protected</span>
          </div>
        </div>
      )}
    </div>
  );
}
