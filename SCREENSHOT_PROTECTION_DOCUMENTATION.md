# 🔒 Screenshot Protection System

## Overview

This comprehensive screenshot protection system prevents users from taking screenshots, copying content, or using developer tools to capture sensitive matrimonial profile information. When a screenshot attempt is detected, the content appears black or blurred in the captured image.

## 🛡️ Protection Features

### **Level 1: Basic Protection**
- ✅ CSS-based user selection blocking
- ✅ Right-click context menu prevention
- ✅ Basic keyboard shortcut blocking
- ✅ Drag and drop prevention

### **Level 2: Advanced Protection**
- ✅ Screenshot API detection
- ✅ Page visibility monitoring
- ✅ Window focus tracking
- ✅ Dynamic content blurring
- ✅ Watermarking
- ✅ Security event logging

### **Level 3: Maximum Protection**
- ✅ Developer tools detection
- ✅ Performance anomaly monitoring
- ✅ Screen recording detection
- ✅ Real-time content protection
- ✅ Suspicious IP tracking
- ✅ Advanced security overlays

## 🚀 How to Use

### 1. **Component-Level Protection**

```tsx
import ScreenshotProtection from '@/components/security/ScreenshotProtection';

function MyComponent() {
  return (
    <ScreenshotProtection 
      level="maximum" 
      watermark="PRIVATE CONTENT" 
      blurOnSuspicious={true}
    >
      <div>Your sensitive content here</div>
    </ScreenshotProtection>
  );
}
```

### 2. **Global Protection (Auto-enabled)**

The system is automatically enabled site-wide through the `SecurityProvider` in the main layout. No additional setup required.

### 3. **Hook-Based Protection**

```tsx
import { useScreenshotProtection } from '@/hooks/use-screenshot-protection';

function MyComponent() {
  const { enable, disable, isEnabled } = useScreenshotProtection({
    enabled: true,
    onSuspiciousActivity: (reason) => {
      console.log('Suspicious activity detected:', reason);
    }
  });

  return <div>Protected content</div>;
}
```

## 🎯 Detection Methods

### **Screenshot Detection**
- **Print Screen key**: Blocked and logged
- **Snipping Tool**: Detected via keyboard shortcuts
- **Mac screenshots**: Cmd+Shift+3/4/5 blocked
- **Screen recording**: API monitoring
- **Browser extensions**: Performance monitoring

### **Developer Tools Detection**
- **F12 key**: Blocked
- **Right-click inspect**: Blocked
- **Window size changes**: Monitored
- **Console access**: Detected and logged

### **Copy Prevention**
- **Ctrl+C/Cmd+C**: Blocked
- **Ctrl+A/Cmd+A**: Blocked (select all)
- **Ctrl+S/Cmd+S**: Blocked (save page)
- **Text selection**: CSS disabled

## 📊 Security Logging

All suspicious activities are logged to Redis with the following information:

```json
{
  "userId": "user:123",
  "event": "screenshot_attempt",
  "reason": "Print Screen key pressed",
  "timestamp": "2025-06-23T10:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.100",
  "url": "/edit-profile"
}
```

### **Access Security Logs**

```bash
# View recent security events (Admin only)
GET /api/security/log
```

## 🔧 Configuration

### **Protection Levels**

| Level | Features | Use Case |
|-------|----------|----------|
| `basic` | CSS protection, right-click blocking | General content |
| `advanced` | + API monitoring, blurring | Sensitive content |
| `maximum` | + DevTools detection, watermarking | Private photos |

### **Customization Options**

```tsx
<ScreenshotProtection 
  level="maximum"                    // Protection intensity
  watermark="CUSTOM WATERMARK"       // Custom watermark text
  blurOnSuspicious={true}            // Auto-blur on detection
  className="custom-class"           // Additional CSS classes
>
  {children}
</ScreenshotProtection>
```

## 🌐 Browser Compatibility

| Browser | Basic | Advanced | Maximum |
|---------|-------|----------|---------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ |
| Safari | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Mobile | ✅ | ⚠️ | ⚠️ |

## 🛠️ Implementation Details

### **Files Created**

1. **CSS Protection**: `styles/screenshot-protection.css`
2. **Core Service**: `lib/screenshot-protection.ts`
3. **React Component**: `components/security/ScreenshotProtection.tsx`
4. **Provider**: `components/security/SecurityProvider.tsx`
5. **Hook**: `hooks/use-screenshot-protection.ts`
6. **API**: `app/api/security/log/route.ts`

### **Integration Points**

- **Global Layout**: Auto-enabled protection
- **Edit Profile**: Maximum protection on photo gallery
- **Profile Views**: Advanced protection on sensitive data
- **Admin Panel**: Security event monitoring

## ⚠️ Important Notes

### **What This Protects Against**
- ✅ Standard screenshot tools (Print Screen, Snipping Tool)
- ✅ Browser developer tools
- ✅ Right-click and copy operations
- ✅ Screen recording software (detection)
- ✅ Most browser extensions

### **Limitations**
- ❌ Physical cameras pointed at screen
- ❌ External screen capture devices
- ❌ Advanced bypass techniques by determined users
- ❌ Some mobile screenshot methods

### **Legal Considerations**
- Screenshots may still be possible with advanced techniques
- This provides **deterrent** and **detection**, not absolute prevention
- Always include terms of service prohibiting unauthorized capture
- Consider watermarking important content

## 🚨 Security Events

The system logs and responds to these events:

- **Screenshot attempts** (keyboard shortcuts)
- **Developer tools opening**
- **Right-click attempts**
- **Page visibility changes**
- **Copy/paste attempts**
- **Suspicious performance patterns**

## 📱 Mobile Considerations

Mobile browsers have limited screenshot prevention capabilities:
- iOS: Basic protection only
- Android: Varies by browser and OS version
- Focus on terms of service and user education

## 🔄 Updates and Maintenance

- Monitor security logs regularly
- Update detection methods as new tools emerge
- Test protection across different browsers
- Adjust sensitivity based on false positives

---

**🔐 Remember**: This system provides strong deterrence and detection but cannot guarantee 100% prevention. Combine with legal terms, user education, and content watermarking for comprehensive protection.
