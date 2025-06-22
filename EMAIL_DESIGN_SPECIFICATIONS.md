# Enhanced Email Template Design Specifications

## Email Header Image Requirements

### Dimensions & Format
- **Recommended Size**: 600px width × 200px height
- **Format**: PNG or JPG with transparency support (PNG preferred)
- **File Size**: Under 500KB for optimal loading speed
- **Aspect Ratio**: 3:1 (width to height)
- **Resolution**: 72 DPI (web standard)

### Enhanced Design Guidelines

#### Visual Elements to Include:
1. **Nikah Sufiyana Branding**: 
   - Primary brand logo prominently displayed
   - Arabic text: "نکاح صوفیانہ" (Nikah Sufiyana in Arabic/Urdu)
   - Tagline: "Where Hearts Meet with Islamic Values"

2. **Islamic Design Elements**: 
   - **Geometric Patterns**: Traditional Islamic art motifs
   - **Color Gradients**: Deep crimson to gold transitions
   - **Crescent & Star**: Subtle Islamic symbols
   - **Calligraphy Accents**: Elegant Arabic script elements

3. **Enhanced Color Palette**:
   - **Primary Crimson**: #C7203E (Deep Red)
   - **Primary Dark**: #A11B35 (Darker Crimson)
   - **Islamic Gold**: #D4AF37 (Secondary accent)
   - **Light Gold**: #F7DC6F (Highlighting)
   - **Warm Brown**: #8B5A2B (Accent color)

#### Typography Specifications:
- **Primary Font**: Playfair Display (elegant serif)
- **Arabic Font**: Amiri or Traditional Arabic
- **Body Text**: Inter or Helvetica Neue
- **Header Text**: White with gold accents
- **Text Shadow**: 0 3px 6px rgba(0,0,0,0.4)

### Technical Implementation
```css
Header Image Specifications:
- Width: 600px
- Height: 200px
- Background: linear-gradient(135deg, #C7203E 0%, #A11B35 50%, #8B5A2B 100%)
- Overlay Pattern: Islamic geometric patterns with opacity 0.3
- Text Color: White with gold (#D4AF37) accents
- Border Radius: 12px (top corners only)
```

### Current Enhanced Placeholder
We're currently using a sophisticated placeholder with Islamic wedding imagery:
```
https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=200&fit=crop&crop=center&bg=C7203E
```

### Brand Font Integration
The email templates now use an enhanced typography stack:

1. **Primary Font Stack**: 
   ```
   'Playfair Display', 'Times New Roman', 'Amiri', serif
   ```

2. **Body Text Font Stack**: 
   ```
   'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
   ```

3. **Arabic Text Font Stack**: 
   ```
   'Amiri', 'Traditional Arabic', 'Times New Roman', serif
   ```

4. **Monospace (for OTP codes)**: 
   ```
   'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace
   ```

### Visual Enhancements Implemented

#### Enhanced OTP Code Display:
- Individual digit separation with styling
- Glassy background effect with backdrop blur
- Enhanced security messaging
- Improved visual hierarchy

#### Interactive Elements:
- **Primary Buttons**: Gradient backgrounds with enhanced shadows
- **Secondary Buttons**: Outlined style with hover effects
- **Islamic Quotes**: Decorative quotation marks with positioning
- **Info Cards**: Modern card design with subtle shadows

#### Brand Consistency:
- **Arabic Greetings**: Properly styled Arabic text
- **Islamic Motifs**: Decorative elements (✦, ❋) for visual interest
- **Color Psychology**: Strategic use of Islamic colors (green for success, gold for premium)
- **Responsive Design**: Optimized for mobile and desktop viewing

### Implementation
Once you have the final header image:

1. **Upload Location**: Place in `/public/images/email-header.png`
2. **Update Reference**: Replace the placeholder URL in `lib/email-service.ts`:
   ```typescript
   // Change this line:
   <img src="https://via.placeholder.com/600x200/C7203E/FFFFFF?text=Nikah+Sufiyana" 
   
   // To this:
   <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email-header.png"
   ```

### Design Inspiration
- Islamic geometric patterns from traditional art
- Modern matrimonial website aesthetics
- Professional email headers from major brands
- Balance between traditional Islamic elements and contemporary design

### Alternative Sizes (if needed)
- **Mobile Version**: 600px × 150px (shorter height for mobile)
- **High DPI**: 1200px × 400px (for retina displays, then scaled down)

## Email Template Features

### Enhanced Design Elements
- **Brand-consistent colors** throughout all templates
- **Islamic typography** with Arabic greetings
- **Quranic verses** for inspiration and blessing
- **Professional layout** with proper spacing and hierarchy
- **Call-to-action buttons** with hover effects
- **Responsive design** that works on all devices

### Template Types Enhanced
1. **Welcome Email** - New user onboarding
2. **Email Verification** - OTP codes with security tips
3. **Profile Approval** - Account activation notification
4. **Interest Received** - New interest notifications
5. **Interest Response** - Accept/decline responses with photo access info
6. **Password Reset** - Secure password reset with OTP

### Brand Fonts Used
- **Primary**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headers**: 'Times New Roman', serif (for traditional feel)
- **Code/OTP**: 'Courier New', monospace (for clarity)

All templates include consistent Islamic branding and values while maintaining modern, professional appearance.
