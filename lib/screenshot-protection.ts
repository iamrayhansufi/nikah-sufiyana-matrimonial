/**
 * Advanced Screenshot Protection Service
 * Prevents screenshots, screen recording, and content copying
 */

export class ScreenshotProtection {
  private static instance: ScreenshotProtection;
  private observers: MutationObserver[] = [];
  private isActive = false;
  private suspiciousActivityCallbacks: ((reason: string) => void)[] = [];

  static getInstance(): ScreenshotProtection {
    if (!this.instance) {
      this.instance = new ScreenshotProtection();
    }
    return this.instance;
  }

  // Enable advanced screenshot protection
  enable() {
    if (this.isActive) return;
    this.isActive = true;

    // Method 1: Screen Capture API Detection
    this.detectScreenCapture();
    
    // Method 2: Page Visibility API
    this.detectPageVisibility();
    
    // Method 3: Keyboard shortcuts
    this.blockKeyboardShortcuts();
    
    // Method 4: Context menu blocking
    this.blockContextMenu();
    
    // Method 5: DevTools detection
    this.detectDevTools();
    
    // Method 6: Performance monitoring
    this.detectPerformanceAnomalies();
    
    console.log('🔒 Screenshot protection enabled');
  }

  private detectScreenCapture() {
    // Detect if screen sharing/recording is active
    if ('getDisplayMedia' in navigator.mediaDevices) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
      
      navigator.mediaDevices.getDisplayMedia = function(...args) {
        console.warn('🚨 Screen capture attempt detected!');
        ScreenshotProtection.getInstance().handleSuspiciousActivity('Screen capture API accessed');
        return originalGetDisplayMedia.apply(this, args);
      };
    }
  }

  private detectPageVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page hidden - potential screenshot
        this.handleSuspiciousActivity('Page visibility changed - potential screenshot');
      }
    });

    // Detect focus loss (another screenshot indicator)
    window.addEventListener('blur', () => {
      this.handleSuspiciousActivity('Window focus lost - potential screenshot');
    });
  }

  private blockKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Block common screenshot shortcuts
      const isScreenshotShortcut = (
        // Mac screenshots
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        // Windows screenshots
        (e.key === 'PrintScreen' || e.key === 'PrtScn') ||
        // Alt + PrintScreen (active window)
        (e.altKey && e.key === 'PrintScreen') ||
        // Snipping tool
        (e.ctrlKey && e.shiftKey && e.key === 'S') ||
        // Print
        (e.ctrlKey && e.key === 'p') ||
        // DevTools
        (e.key === 'F12') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') || // View source
        // Copy shortcuts
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'a') ||
        (e.ctrlKey && e.key === 's') // Save
      );

      if (isScreenshotShortcut) {
        e.preventDefault();
        e.stopPropagation();
        this.handleSuspiciousActivity(`Blocked shortcut: ${e.key} with modifiers`);
        return false;
      }
    }, true);
  }

  private blockContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleSuspiciousActivity('Right-click attempted');
      return false;
    });

    // Block drag and drop
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  }

  private detectDevTools() {
    const devtools = {
      open: false,
      orientation: null as string | null,
    };

    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleSuspiciousActivity('Developer tools opened');
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Detect console usage
    let devToolsOpened = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        devToolsOpened = true;
        ScreenshotProtection.getInstance().handleSuspiciousActivity('Console accessed');
        throw new Error('DevTools detected');
      }
    });

    setInterval(() => {
      if (!devToolsOpened) {
        console.log(element);
        console.clear();
      }
    }, 1000);
  }

  private detectPerformanceAnomalies() {
    // Monitor for suspicious timing that might indicate screenshot tools
    let lastTime = performance.now();
    
    setInterval(() => {
      const currentTime = performance.now();
      const timeDiff = currentTime - lastTime;
      
      // If there's an unusual delay, it might be a screenshot tool
      if (timeDiff > 200) {
        this.handleSuspiciousActivity('Performance anomaly detected');
      }
      
      lastTime = currentTime;
    }, 100);
  }

  private handleSuspiciousActivity(reason: string) {
    console.warn(`🚨 Suspicious activity: ${reason}`);
    
    // Apply blur effect immediately
    this.blurProtectedContent();
    
    // Show security overlay
    this.showSecurityOverlay(reason);
    
    // Notify callbacks
    this.suspiciousActivityCallbacks.forEach(callback => callback(reason));

    // Log security event
    this.logSecurityEvent(reason);
  }

  private blurProtectedContent() {
    document.querySelectorAll('.screenshot-protected').forEach(element => {
      (element as HTMLElement).classList.add('security-blur');
      setTimeout(() => {
        (element as HTMLElement).classList.remove('security-blur');
      }, 3000);
    });
  }

  private showSecurityOverlay(reason: string) {
    // Create temporary overlay
    const overlay = document.createElement('div');
    overlay.className = 'security-overlay';
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
        <h2>Content Protected</h2>
        <p>Screenshots and copying are not allowed</p>
        <small>Reason: ${reason}</small>
      </div>
    `;

    document.body.appendChild(overlay);

    // Remove after 2 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 2000);
  }

  private async logSecurityEvent(reason: string) {
    try {
      await fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'screenshot_attempt',
          reason,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Add callback for suspicious activity
  onSuspiciousActivity(callback: (reason: string) => void) {
    this.suspiciousActivityCallbacks.push(callback);
  }

  // Remove callback
  removeSuspiciousActivityCallback(callback: (reason: string) => void) {
    const index = this.suspiciousActivityCallbacks.indexOf(callback);
    if (index > -1) {
      this.suspiciousActivityCallbacks.splice(index, 1);
    }
  }

  disable() {
    this.isActive = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.suspiciousActivityCallbacks = [];
    console.log('🔓 Screenshot protection disabled');
  }

  isEnabled(): boolean {
    return this.isActive;
  }
}
