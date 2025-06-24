import nodemailer from "nodemailer"

// Email Header Image Specifications:
// Recommended size: 600px width x 200px height
// Format: PNG or JPG with transparent background support
// Should include Nikah Sufiyana logo, Islamic geometric patterns, and elegant typography
// Final image should be uploaded to: /public/images/email-header.png
// Current enhanced placeholder with better Islamic design elements

// Brand Colors - Enhanced palette
const BRAND_COLORS = {
  primary: '#C7203E',        // Deep Crimson
  primaryDark: '#A11B35',    // Darker Crimson
  primaryLight: '#E53E5D',   // Lighter Crimson
  secondary: '#D4AF37',      // Islamic Gold
  secondaryLight: '#F7DC6F', // Light Gold
  background: '#FCF9F2',     // Warm Ivory
  backgroundLight: '#FEFCF8', // Pure Ivory
  text: '#2D3748',          // Dark Gray
  textLight: '#718096',     // Medium Gray
  textMuted: '#A0AEC0',     // Light Gray
  success: '#10B981',       // Islamic Green
  successLight: '#D1FAE5',  // Light Green
  accent: '#8B5A2B'         // Warm Brown
};

// Enhanced Typography - Islamic & Modern fonts
const TYPOGRAPHY = {
  // Primary font stack - elegant and readable
  primary: `'Playfair Display', 'Times New Roman', 'Amiri', serif`,
  // Secondary font for body text
  body: `'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
  // Arabic/Urdu text
  arabic: `'Amiri', 'Traditional Arabic', 'Times New Roman', serif`,
  // Monospace for codes
  mono: `'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace`
};

// Enhanced email styles with better typography and visual design
const EMAIL_STYLES = {
  container: `
    font-family: ${TYPOGRAPHY.body};
    max-width: 600px;
    margin: 0 auto;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    border: 1px solid rgba(199, 32, 62, 0.1);
  `,
  header: `
    background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 50%, ${BRAND_COLORS.accent} 100%);
    text-align: center;
    padding: 0;
    position: relative;
    overflow: hidden;
  `,
  headerImage: `
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  `,
  headerPattern: `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.3) 0%, transparent 25%),
      radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.2) 0%, transparent 25%),
      linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
    opacity: 0.6;
  `,
  headerOverlay: `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(199, 32, 62, 0.85), rgba(161, 27, 53, 0.9));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `,
  headerTitle: `
    color: white;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-shadow: 0 3px 6px rgba(0,0,0,0.4);
    font-family: ${TYPOGRAPHY.primary};
    letter-spacing: 1px;
  `,
  headerSubtitle: `
    color: rgba(255,255,255,0.95);
    font-size: 16px;
    margin: 0;
    font-weight: 400;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    opacity: 0.95;
  `,
  content: `
    padding: 40px 30px;
    background: linear-gradient(135deg, ${BRAND_COLORS.background} 0%, ${BRAND_COLORS.backgroundLight} 100%);
    line-height: 1.7;
  `,
  greeting: `
    font-size: 24px;
    color: ${BRAND_COLORS.text};
    margin-bottom: 24px;
    font-weight: 600;
    font-family: ${TYPOGRAPHY.primary};
    text-align: center;
  `,
  arabicGreeting: `
    font-family: ${TYPOGRAPHY.arabic};
    font-size: 20px;
    color: ${BRAND_COLORS.secondary};
    font-weight: 600;
    display: inline-block;
    margin-right: 8px;
    text-shadow: 0 1px 2px rgba(212, 175, 55, 0.3);
  `,
  paragraph: `
    color: ${BRAND_COLORS.text};
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 1.7;
    font-family: ${TYPOGRAPHY.body};
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.primaryLight});
    color: white;
    padding: 16px 40px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    box-shadow: 0 6px 20px rgba(199, 32, 62, 0.4);
    transition: all 0.3s ease;
    border: none;
    font-family: ${TYPOGRAPHY.body};
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
  `,
  buttonSecondary: `
    display: inline-block;
    background: transparent;
    color: ${BRAND_COLORS.primary};
    padding: 14px 30px;
    text-decoration: none;
    border: 2px solid ${BRAND_COLORS.primary};
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    font-family: ${TYPOGRAPHY.body};
    transition: all 0.3s ease;
  `,
  highlightBox: `
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(240, 253, 244, 0.6));
    border-left: 5px solid ${BRAND_COLORS.secondary};
    padding: 25px;
    margin: 25px 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    position: relative;
  `,
  warningBox: `
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(254, 226, 226, 0.6));
    border-left: 5px solid #EF4444;
    padding: 25px;
    margin: 25px 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  `,
  successBox: `
    background: linear-gradient(135deg, ${BRAND_COLORS.success}, #059669);
    color: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    margin: 30px 0;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    position: relative;
    overflow: hidden;
  `,  otpContainer: `
    background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.primaryDark});
    padding: 30px 20px;
    border-radius: 15px;
    text-align: center;
    margin: 30px 0;
    box-shadow: 0 12px 35px rgba(199, 32, 62, 0.25);
    position: relative;
    overflow: hidden;
  `,
  otpCode: `
    background: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  `,
  otpDigits: `
    color: white;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 8px;
    font-family: ${TYPOGRAPHY.mono};
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: block;
    word-spacing: 4px;
    line-height: 1.2;
  `,  otpDigitBox: `
    display: inline-block;
    background: rgba(255,255,255,0.3);
    margin: 0 2px;
    padding: 8px 6px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 700;
    min-width: 28px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    font-family: ${TYPOGRAPHY.mono};
    
    @media (max-width: 480px) {
      font-size: 18px;
      padding: 6px 4px;
      min-width: 24px;
      margin: 0 1px;
    }
  `,
  infoCard: `
    background: white;
    padding: 25px;
    border-radius: 12px;
    margin: 25px 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid rgba(199, 32, 62, 0.1);
  `,
  quranVerse: `
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08));
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    margin: 30px 0;
    border: 1px solid rgba(212, 175, 55, 0.2);
    position: relative;
  `,
  footer: `
    background: linear-gradient(135deg, ${BRAND_COLORS.text} 0%, #4A5568 100%);
    color: white;
    padding: 30px;
    text-align: center;
    font-size: 14px;
  `,
  islamicPattern: `
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><g fill="none" fill-rule="evenodd"><g fill="%23D4AF37" fill-opacity="0.1"><polygon points="30 0 60 30 30 60 0 30"/></g></g></svg>');
    background-repeat: repeat;
  `
};

// Generate enhanced email header with better visual design
function getEmailHeader(title: string, subtitle?: string): string {
  return `
    <div style="${EMAIL_STYLES.header}">
      <!-- Custom header image -->
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email-header.png" 
           alt="Nikah Sufiyana Header" 
           style="${EMAIL_STYLES.headerImage}" />
      
      <!-- Content overlay with enhanced typography -->
      <div style="${EMAIL_STYLES.headerOverlay}">
        <div style="z-index: 2; position: relative;">
          <!-- Main title with enhanced styling -->
          <h1 style="${EMAIL_STYLES.headerTitle}">${title}</h1>
          
          ${subtitle ? `
            <p style="${EMAIL_STYLES.headerSubtitle}">
              ${subtitle}
            </p>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Generate enhanced email footer with better branding
function getEmailFooter(): string {
  return `
    <div style="${EMAIL_STYLES.footer}">
      <!-- Brand section with Islamic elements -->
      <div style="margin-bottom: 20px;">
        <div style="font-family: ${TYPOGRAPHY.primary}; font-size: 24px; font-weight: 700; margin-bottom: 8px; color: white;">
          Nikah Sufiyana
        </div>
        <div style="font-family: ${TYPOGRAPHY.arabic}; font-size: 16px; color: ${BRAND_COLORS.secondary}; margin-bottom: 5px;">
          نکاح صوفیانہ
        </div>
        <div style="opacity: 0.85; font-size: 15px; font-style: italic;">
          Where Hearts Meet with Islamic Values
        </div>
      </div>
      
      <!-- Decorative separator -->
      <div style="margin: 20px 0; opacity: 0.3;">
        <span style="color: ${BRAND_COLORS.secondary}; font-size: 14px; margin: 0 5px;">✦</span>
        <span style="color: white; font-size: 12px; margin: 0 10px;">❋</span>
        <span style="color: ${BRAND_COLORS.secondary}; font-size: 14px; margin: 0 5px;">✦</span>
      </div>
      
      <!-- Contact and support information -->
      <div style="margin-bottom: 20px; opacity: 0.9;">
        <div style="margin-bottom: 8px;">
          <strong>Need Help?</strong> Contact us at 
          <a href="mailto:support@nikahsufiyana.com" style="color: ${BRAND_COLORS.secondary}; text-decoration: none;">
            support@nikahsufiyana.com
          </a>
        </div>
        <div style="font-size: 13px; opacity: 0.7;">
          🕌 Serving the Muslim community with trust and dignity
        </div>
      </div>
      
      <!-- Legal footer -->
      <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; font-size: 12px; opacity: 0.7;">
        <p style="margin: 0 0 8px 0;">
          This email was sent to you as a valued member of Nikah Sufiyana
        </p>
        <p style="margin: 0;">
          © ${new Date().getFullYear()} Nikah Sufiyana. All rights reserved. | 
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: ${BRAND_COLORS.secondary}; text-decoration: none;">Privacy Policy</a> | 
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: ${BRAND_COLORS.secondary}; text-decoration: none;">Terms of Service</a>
        </p>
      </div>
    </div>
  `;
}

// Email configuration
function createTransporter() {
  // Verify required environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("Missing SMTP configuration. Emails will not be sent.");
    return null;
  }
    // Create transporter with environment variables only, never hardcode credentials
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true, // use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Create the transporter lazily
const transporter = createTransporter();

// Helper function to safely send emails
async function sendEmail(mailOptions: nodemailer.SendMailOptions): Promise<boolean> {
  if (!transporter) {
    console.warn("Email not sent: SMTP configuration missing");
    return false;
  }
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
    to: userEmail,
    subject: "Welcome to Nikah Sufiyana",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('Welcome to Nikah Sufiyana', 'Start your journey to find the perfect match')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Hello ${userName}!
          </h2>
          
          <p style="${EMAIL_STYLES.paragraph}">
            Welcome to <strong style="color: ${BRAND_COLORS.primary};">Nikah Sufiyana</strong>. 
            We're here to help you find a compatible life partner who shares your values.
          </p>
          
          <!-- Profile Status -->
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              ⏳ Profile Under Review
            </h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text};">
              Your profile is being reviewed by our team. You'll receive confirmation within 24-48 hours.
            </p>
          </div>
          
          <!-- Next Steps -->
          <div style="${EMAIL_STYLES.infoCard}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              📋 Complete Your Profile
            </h3>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text};">
              Complete profiles get 3x more matches. Add photos, verify your phone, and share your preferences.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/edit-profile" style="${EMAIL_STYLES.button}">
                Complete Profile
              </a>
            </div>
          </div>
          
          <!-- What's Next -->
          <div style="background: ${BRAND_COLORS.background}; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              What Happens Next?
            </h3>
            <div style="color: ${BRAND_COLORS.text}; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">1. Profile review (24-48 hours)</p>
              <p style="margin: 0 0 8px 0;">2. Browse compatible matches</p>
              <p style="margin: 0;">3. Start connecting securely</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.buttonSecondary}">
              View Dashboard
            </a>
          </div>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
          </p>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendProfileApprovalEmail(userEmail: string, userName: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
    to: userEmail,
    subject: "Profile Approved - Nikah Sufiyana",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('Profile Approved!', 'Your journey to find the perfect match begins')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Congratulations ${userName}! 🎉
          </h2>
          
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              ✅ Your Profile is Now Live
            </h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text};">
              Your profile has been approved and is now visible to other members. 
              You can start browsing profiles and connecting with potential matches.
            </p>
          </div>
          
          <div style="${EMAIL_STYLES.infoCard}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              🚀 What You Can Do Now
            </h3>
            <p style="color: ${BRAND_COLORS.text}; margin: 0; line-height: 1.6;">
              Browse compatible profiles, send interests, manage your privacy settings, and start building meaningful connections.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" style="${EMAIL_STYLES.button}">
              Start Browsing Profiles
            </a>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.buttonSecondary}">
              View Dashboard
            </a>
          </div>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
          </p>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendProfileRejectionEmail(userEmail: string, userName: string, reason: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
    to: userEmail,
    subject: "Profile Review - Action Required",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('Profile Review Required', 'Please update your profile information')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Hello ${userName}!
          </h2>
          
          <p style="${EMAIL_STYLES.paragraph}">
            We've reviewed your profile and found some areas that need attention to ensure compliance with our community standards.
          </p>
          
          <div style="${EMAIL_STYLES.warningBox}">
            <h3 style="color: #DC2626; margin: 0 0 15px 0; font-size: 18px;">
              📋 Required Updates
            </h3>
            <p style="margin: 0; color: #991B1B; font-weight: 600;">
              ${reason}
            </p>
          </div>
          
          <p style="${EMAIL_STYLES.paragraph}">
            Please update your profile with the necessary information and resubmit for review.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/edit-profile" style="${EMAIL_STYLES.button}">
              Update My Profile
            </a>
          </div>
          
          <div style="${EMAIL_STYLES.infoCard}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              💡 Need Help?
            </h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; line-height: 1.6;">
              If you have questions, please contact our support team at 
              <a href="mailto:support@nikahsufiyana.com" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">
                support@nikahsufiyana.com
              </a>
            </p>
          </div>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
          </p>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendOTPVerificationEmail(userEmail: string, otp: string, userName: string = 'User', purpose: 'email_verification' | 'password_reset' = 'email_verification'): Promise<boolean> {
  const isPasswordReset = purpose === 'password_reset';
  const title = isPasswordReset ? 'Reset Your Password' : 'Verify Your Email';
  const subtitle = isPasswordReset ? 'Enter the code to reset your password' : 'Enter the code to verify your account';
  
  // Generate individual OTP digits for mobile-friendly display
  const otpDigits = otp.split('');
  const otpDisplay = otpDigits.map(digit => 
    `<span style="${EMAIL_STYLES.otpDigitBox}">${digit}</span>`  ).join('');
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
    to: userEmail,
    subject: `${title} - Nikah Sufiyana`,
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader(title, subtitle)}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Hello ${userName}!
          </h2>
          
          <p style="${EMAIL_STYLES.paragraph}">
            ${isPasswordReset 
              ? 'Use the verification code below to reset your password.'
              : 'Welcome to Nikah Sufiyana! Please enter this code to verify your email address.'
            }
          </p>
            <!-- Simplified OTP Display -->
          <div style="${EMAIL_STYLES.otpContainer}">
            <div style="position: relative; z-index: 2;">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                Your Verification Code
              </h3>
              
              <div style="${EMAIL_STYLES.otpCode}">
                <!-- Mobile-friendly single row display -->
                <div style="text-align: center; line-height: 1.2; white-space: nowrap; overflow-x: auto; padding: 5px;">
                  ${otpDigits.map(digit => 
                    `<span style="${EMAIL_STYLES.otpDigitBox}">${digit}</span>`
                  ).join('')}
                </div>
                
                <!-- Fallback text display for very small screens -->
                <div style="color: white; font-size: 24px; font-weight: 700; font-family: ${TYPOGRAPHY.mono}; letter-spacing: 4px; text-align: center; margin-top: 10px; display: block;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: rgba(255, 255, 255, 0.9); margin: 15px 0 0 0; font-size: 14px;">
                This code expires in <strong>10 minutes</strong>
              </p>
            </div>
          </div>
          
          <!-- Call to Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}${isPasswordReset ? '/reset-password' : '/verify-email'}?email=${encodeURIComponent(userEmail)}" 
               style="${EMAIL_STYLES.button}">
              ${isPasswordReset ? 'Reset Password' : 'Verify Email'}
            </a>
          </div>
          
          <!-- Simple Help Section -->
          <div style="background: ${BRAND_COLORS.background}; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <p style="margin: 0; color: ${BRAND_COLORS.text};">
              Need help? Contact us at 
              <a href="mailto:support@nikahsufiyana.com" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">
                support@nikahsufiyana.com
              </a>
            </p>
          </div>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
          </p>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendInterestResponseEmail(
  userEmail: string, 
  userName: string, 
  responderName: string, 
  action: 'accept' | 'decline',
  photoAccessDuration?: string
): Promise<boolean> {
  const isAccepted = action === 'accept';
  const accessDurationText = photoAccessDuration ? getDurationText(photoAccessDuration) : '';
  const title = isAccepted ? 'Interest Accepted!' : 'Interest Response';  const subtitle = isAccepted ? 'Great news about your interest request' : 'Update on your interest request';
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
    to: userEmail,
    subject: `${title} - Nikah Sufiyana`,
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader(title, subtitle)}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Hello ${userName}!
          </h2>
          
          ${isAccepted ? `
            <div style="${EMAIL_STYLES.successBox}">
              <h3 style="margin: 0 0 10px 0; font-size: 24px;">🎉 Congratulations!</h3>
              <p style="margin: 0; font-size: 18px; opacity: 0.95;">
                <strong>${responderName}</strong> has accepted your interest request!
              </p>
            </div>
            
            ${photoAccessDuration ? `
              <div style="${EMAIL_STYLES.highlightBox}">
                <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
                  📸 Photo Access Granted
                </h3>
                <p style="margin: 0; color: ${BRAND_COLORS.text};">
                  You can now view <strong>${responderName}'s photos</strong> for <strong>${accessDurationText}</strong>.
                  Access will be automatically revoked after this period.
                </p>
              </div>
            ` : ''}
            
            <div style="${EMAIL_STYLES.infoCard}">
              <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
                🚀 What You Can Do Now
              </h3>
              <p style="color: ${BRAND_COLORS.text}; margin: 0; line-height: 1.6;">
                View their complete profile, start a conversation, and take the next steps in getting to know each other.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.button}">
                View Their Profile
              </a>
            </div>
          ` : `
            <div style="${EMAIL_STYLES.warningBox}">
              <h3 style="color: #DC2626; margin: 0 0 10px 0; font-size: 18px;">Interest Response</h3>
              <p style="margin: 0; color: #991B1B;">
                <strong>${responderName}</strong> has respectfully declined your interest request.
              </p>
            </div>
            
            <div style="${EMAIL_STYLES.infoCard}">
              <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
                🌟 Keep Your Hope Alive
              </h3>
              <p style="color: ${BRAND_COLORS.text}; margin: 0; line-height: 1.6;">
                This is part of finding the right person. Continue browsing other compatible profiles and keep your hopes up!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" style="${EMAIL_STYLES.button}">
                Continue Browsing
              </a>
            </div>
          `}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.buttonSecondary}">
              Visit Your Dashboard
            </a>
          </div>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
          </p>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendInterestReceivedEmail(
  userEmail: string, 
  userName: string, 
  senderName: string
): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
    to: userEmail,
    subject: "New Interest Received - Nikah Sufiyana",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('New Interest Received!', 'Someone has shown interest in your profile')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Hello ${userName}!
          </h2>
          
          <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; border-left: 4px solid ${BRAND_COLORS.primary};">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 20px;">💝 Great News!</h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 18px;">
              <strong>${senderName}</strong> has shown interest in your profile!
            </p>
          </div>
          
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              What would you like to do?
            </h3>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text};">
              Review their profile and decide whether to accept or decline their interest.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.button}">
                Review Interest Request
              </a>
            </div>
          </div>
          
          <div style="${EMAIL_STYLES.infoCard}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              🔐 Your Privacy is Protected
            </h3>
            <p style="color: ${BRAND_COLORS.text}; margin: 0; line-height: 1.6;">
              When you accept, you can choose how long they can view your photos (1 day to permanent). 
              You can revoke access anytime from your dashboard.
            </p>
          </div>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
            <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
          </p>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

// Helper function to convert duration codes to human-readable text
function getDurationText(duration: string): string {
  switch (duration) {
    case '1day': return '1 day';
    case '2days': return '2 days';
    case '1week': return '1 week';
    case '1month': return '1 month';
    case 'permanent': return 'permanently';
    default: return '1 week';
  }
}
