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
  `,
  otpContainer: `
    background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.primaryDark});
    padding: 35px;
    border-radius: 15px;
    text-align: center;
    margin: 35px 0;
    box-shadow: 0 12px 35px rgba(199, 32, 62, 0.25);
    position: relative;
    overflow: hidden;
  `,
  otpCode: `
    background: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    padding: 25px;
    margin: 20px 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  `,
  otpDigits: `
    color: white;
    font-size: 40px;
    font-weight: 700;
    letter-spacing: 12px;
    font-family: ${TYPOGRAPHY.mono};
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: block;
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
      <!-- Enhanced header image with Islamic geometric patterns -->
      <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=200&fit=crop&crop=center&bg=C7203E" 
           alt="Nikah Sufiyana - Islamic Wedding Header" 
           style="${EMAIL_STYLES.headerImage}" />
      
      <!-- Islamic geometric pattern overlay -->
      <div style="${EMAIL_STYLES.headerPattern}"></div>
      
      <!-- Content overlay with enhanced typography -->
      <div style="${EMAIL_STYLES.headerOverlay}">
        <div style="z-index: 2; position: relative;">
          <!-- Arabic/Urdu branding -->
          <div style="font-family: ${TYPOGRAPHY.arabic}; font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 5px; letter-spacing: 2px;">
            نکاح صوفیانہ
          </div>
          
          <!-- Main title with enhanced styling -->
          <h1 style="${EMAIL_STYLES.headerTitle}">${title}</h1>
          
          ${subtitle ? `
            <p style="${EMAIL_STYLES.headerSubtitle}">
              ${subtitle}
            </p>
          ` : ''}
          
          <!-- Decorative Islamic motif -->
          <div style="margin-top: 12px; opacity: 0.7;">
            <span style="color: ${BRAND_COLORS.secondary}; font-size: 18px;">✦</span>
            <span style="color: rgba(255,255,255,0.6); margin: 0 8px; font-size: 14px;">❋</span>
            <span style="color: ${BRAND_COLORS.secondary}; font-size: 18px;">✦</span>
          </div>
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
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "🌙 Welcome to Nikah Sufiyana - Your Sacred Journey Begins",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('Welcome to Nikah Sufiyana', 'Your Sacred Journey to Finding True Love Begins')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            <span style="${EMAIL_STYLES.arabicGreeting}">السلام علیکم ورحمة الله وبركاته</span><br>
            <span style="color: ${BRAND_COLORS.primary}; font-family: ${TYPOGRAPHY.primary};">${userName}</span>
          </h2>
          
          <p style="${EMAIL_STYLES.paragraph}">
            Welcome to <strong style="color: ${BRAND_COLORS.primary};">Nikah Sufiyana</strong>, where meaningful connections are made with Islamic values at the heart of every relationship. 
            We are honored to be part of your journey in finding a righteous and compatible life partner.
          </p>
          
          <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08)); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid rgba(212, 175, 55, 0.3);">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 20px; font-family: ${TYPOGRAPHY.primary};">
              🕌 May Allah Bless Your Journey
            </h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-style: italic; line-height: 1.7;">
              "We pray that Allah guides you to your perfect match and blesses your union with love, understanding, and righteousness."
            </p>
          </div>
          
          <!-- Profile Status Card -->
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              <span style="background: ${BRAND_COLORS.secondary}; color: white; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">⏳</span>
              Profile Under Review
            </h3>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text}; line-height: 1.7;">
              Your profile has been submitted for verification by our dedicated team. We review each profile carefully to ensure the highest quality matches for all our members.
            </p>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong style="color: ${BRAND_COLORS.primary};">⌛ Expected Review Time:</strong>
              <span style="color: ${BRAND_COLORS.text}; margin-left: 5px;">24-48 hours</span>
            </div>
          </div>
          
          <!-- Profile Completion Guide -->
          <div style="${EMAIL_STYLES.infoCard}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
              <span style="background: ${BRAND_COLORS.primary}; color: white; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">📋</span>
              Complete Your Profile for Better Matches
            </h3>
            
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: flex-start; padding: 12px; background: ${BRAND_COLORS.background}; border-radius: 8px;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 12px; font-size: 18px; flex-shrink: 0;">📸</span>
                <div>
                  <strong style="color: ${BRAND_COLORS.text};">Upload Profile Photos</strong>
                  <p style="margin: 5px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; line-height: 1.5;">
                    Add clear, recent photos that represent you authentically while maintaining Islamic modesty
                  </p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px; background: ${BRAND_COLORS.background}; border-radius: 8px;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 12px; font-size: 18px; flex-shrink: 0;">📱</span>
                <div>
                  <strong style="color: ${BRAND_COLORS.text};">Verify Phone Number</strong>
                  <p style="margin: 5px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; line-height: 1.5;">
                    Secure your account and increase trust with other members
                  </p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px; background: ${BRAND_COLORS.background}; border-radius: 8px;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 12px; font-size: 18px; flex-shrink: 0;">📝</span>
                <div>
                  <strong style="color: ${BRAND_COLORS.text};">Add Detailed Information</strong>
                  <p style="margin: 5px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; line-height: 1.5;">
                    Share your values, interests, and what you're looking for in a life partner
                  </p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px; background: ${BRAND_COLORS.background}; border-radius: 8px;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 12px; font-size: 18px; flex-shrink: 0;">⏰</span>
                <div>
                  <strong style="color: ${BRAND_COLORS.text};">Set Marriage Timeline</strong>
                  <p style="margin: 5px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; line-height: 1.5;">
                    Let potential matches know your preferred timeline for marriage
                  </p>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, ${BRAND_COLORS.primaryLight}, ${BRAND_COLORS.primary}); color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
              <strong>💡 Pro Tip:</strong> Complete profiles receive <strong>3x more interest</strong> than incomplete ones!
            </div>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/edit-profile" style="${EMAIL_STYLES.button}">
              🚀 Complete My Profile
            </a>
            <div style="margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.buttonSecondary}">
                📊 View Dashboard
              </a>
            </div>
          </div>
          
          <!-- Islamic Quote -->
          <div style="${EMAIL_STYLES.quranVerse}">
            <div style="position: absolute; top: 15px; left: 25px; color: ${BRAND_COLORS.secondary}; font-size: 30px; opacity: 0.3; font-family: ${TYPOGRAPHY.arabic};">"</div>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text}; font-style: italic; font-size: 17px; font-family: ${TYPOGRAPHY.primary}; line-height: 1.6;">
              <strong>"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts."</strong>
            </p>
            <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-family: ${TYPOGRAPHY.arabic};">
              - القرآن الكريم ٣٠:٢١ (Quran 30:21)
            </p>
            <div style="position: absolute; bottom: 15px; right: 25px; color: ${BRAND_COLORS.secondary}; font-size: 30px; opacity: 0.3; transform: rotate(180deg); font-family: ${TYPOGRAPHY.arabic};">"</div>
          </div>
          
          <!-- What's Next Section -->
          <div style="background: white; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid ${BRAND_COLORS.secondary};">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              🌟 What Happens Next?
            </h3>
            <div style="color: ${BRAND_COLORS.text}; line-height: 1.7;">
              <p style="margin: 0 0 10px 0;"><strong>1.</strong> We'll review and approve your profile within 24-48 hours</p>
              <p style="margin: 0 0 10px 0;"><strong>2.</strong> You'll receive an email confirmation once approved</p>
              <p style="margin: 0 0 10px 0;"><strong>3.</strong> Start browsing compatible profiles in your area</p>
              <p style="margin: 0;"><strong>4.</strong> Begin connecting with potential matches through our secure platform</p>
            </div>
          </div>
          
          <p style="${EMAIL_STYLES.paragraph}; text-align: center; font-size: 17px;">
            <strong style="color: ${BRAND_COLORS.primary};">May Allah guide you to your perfect match and bless your union with love, understanding, and righteousness.</strong>
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(199, 32, 62, 0.2);">
            <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin: 0;">
              <span style="font-family: ${TYPOGRAPHY.arabic}; color: ${BRAND_COLORS.secondary};">بارك الله فيكم</span><br>
              <strong style="color: ${BRAND_COLORS.primary};">The Nikah Sufiyana Team</strong>
            </p>
          </div>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendProfileApprovalEmail(userEmail: string, userName: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "🎉 Profile Approved - Begin Your Sacred Journey",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('Profile Approved!', 'Your journey to find the perfect match begins')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            Congratulations <span style="color: ${BRAND_COLORS.primary};">${userName}</span>! 🎉
          </h2>
          
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              ✅ Your Profile is Now Live
            </h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text};">
              Your profile has been approved and is now visible to other members on Nikah Sufiyana. 
              You can start browsing profiles, sending interests, and connecting with potential matches.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              🚀 What You Can Do Now
            </h3>
            <ul style="color: ${BRAND_COLORS.text}; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Browse Profiles:</strong> Discover compatible matches in your area</li>
              <li style="margin-bottom: 8px;"><strong>Send Interests:</strong> Express interest in profiles you find suitable</li>
              <li style="margin-bottom: 8px;"><strong>Manage Privacy:</strong> Control who can view your photos</li>
              <li style="margin-bottom: 8px;"><strong>Receive Matches:</strong> Get notified when someone shows interest</li>
              <li><strong>Connect Safely:</strong> Build meaningful relationships with Islamic values</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" style="${EMAIL_STYLES.button}">
              Start Browsing Profiles
            </a>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(199, 32, 62, 0.05), rgba(161, 27, 53, 0.05)); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border-left: 4px solid ${BRAND_COLORS.primary};">
            <h4 style="color: ${BRAND_COLORS.primary}; margin: 0 0 10px 0;">💡 Pro Tip</h4>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 15px;">
              Complete your profile with detailed information and recent photos to get better matches. 
              Members with complete profiles receive <strong>3x more interest</strong> than incomplete ones.
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05)); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-style: italic; font-size: 16px;">
              <strong>"And Allah has made for you from yourselves mates and has made for you from your mates children and grandchildren."</strong>
            </p>
            <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
              - Quran 16:72
            </p>
          </div>
          
          <p style="${EMAIL_STYLES.paragraph}">
            <strong>May Allah guide you to your perfect match and bless your search with success.</strong>
          </p>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>The Nikah Sufiyana Team</strong>
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
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "Profile Review - Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #C7203E; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Profile Review Required</h1>
        </div>
        <div style="padding: 20px; background: #FCF9F2;">
          <h2>Dear ${userName},</h2>
          <p>We've reviewed your profile and found some issues that need to be addressed:</p>
          <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <strong>Reason:</strong> ${reason}
          </div>
          <p>Please update your profile and resubmit for review.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/edit" 
               style="background: #C7203E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Update Profile
            </a>
          </div>
        </div>
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendOTPVerificationEmail(userEmail: string, otp: string, userName: string = 'User', purpose: 'email_verification' | 'password_reset' = 'email_verification'): Promise<boolean> {
  const isPasswordReset = purpose === 'password_reset';
  const title = isPasswordReset ? '🔒 Password Reset Request' : '🌙 Verify Your Email Address';
  const subtitle = isPasswordReset ? 'Secure your account with this verification code' : 'Complete your sacred journey setup';
  
  // Generate individual OTP digits for better visual presentation
  const otpDigits = otp.split('');
  const otpDisplay = otpDigits.map(digit => 
    `<span style="display: inline-block; background: rgba(255,255,255,0.3); margin: 0 4px; padding: 8px 12px; border-radius: 8px; font-size: 28px; font-weight: 700; min-width: 20px; text-align: center;">${digit}</span>`
  ).join('');
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: `${title} - Nikah Sufiyana`,
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader(title, subtitle)}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            <span style="${EMAIL_STYLES.arabicGreeting}">السلام علیکم</span> ${userName}
          </h2>
          
          <p style="${EMAIL_STYLES.paragraph}">
            ${isPasswordReset 
              ? 'We received a request to reset your password for your Nikah Sufiyana account. For your security, please use the verification code below to proceed with resetting your password.'
              : 'Thank you for joining <strong>Nikah Sufiyana</strong>! To complete your account setup and ensure the security of your profile, please verify your email address using the verification code below.'
            }
          </p>
          
          <!-- Enhanced OTP Display -->
          <div style="${EMAIL_STYLES.otpContainer}">
            <!-- Decorative pattern for OTP section -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot;><g fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;><g fill=&quot;%23FFFFFF&quot; fill-opacity=&quot;0.1&quot;><polygon points=&quot;20 0 40 20 20 40 0 20&quot;/></g></g></svg>'); opacity: 0.3;"></div>
            
            <div style="position: relative; z-index: 2;">
              <h3 style="color: white; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                🔐 Your Verification Code
              </h3>
              
              <div style="${EMAIL_STYLES.otpCode}">
                <div style="margin-bottom: 15px; color: rgba(255,255,255,0.9); font-size: 14px;">
                  Enter this code to ${isPasswordReset ? 'reset your password' : 'verify your email'}:
                </div>
                <div style="${EMAIL_STYLES.otpDigits}">
                  ${otpDisplay}
                </div>
              </div>
              
              <div style="margin-top: 20px;">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 15px;">
                  ⏱️ This code expires in <strong>10 minutes</strong>
                </p>
                <p style="color: rgba(255, 255, 255, 0.7); margin: 5px 0 0 0; font-size: 13px;">
                  For your security, never share this code with anyone
                </p>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Security Information -->
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              🛡️ <span style="margin-left: 8px;">Security Guidelines</span>
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: flex-start;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="color: ${BRAND_COLORS.text};">This code is valid for <strong>10 minutes only</strong></span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="color: ${BRAND_COLORS.text};">Keep this code private and secure</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="color: ${BRAND_COLORS.success}; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="color: ${BRAND_COLORS.text};">Contact support if you didn't request this ${isPasswordReset ? 'password reset' : 'verification'}</span>
              </div>
            </div>
          </div>
          
          <!-- Call to Action Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}${isPasswordReset ? '/reset-password' : '/verify-email'}?email=${encodeURIComponent(userEmail)}" 
               style="${EMAIL_STYLES.button}">
              ${isPasswordReset ? '🔑 Reset My Password' : '✅ Verify Email Address'}
            </a>
          </div>
          
          <!-- Help and Support Section -->
          <div style="${EMAIL_STYLES.infoCard}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              💡 Need Assistance?
            </h3>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text}; line-height: 1.6;">
              If you're experiencing any issues with ${isPasswordReset ? 'password reset' : 'email verification'}, our support team is here to help you every step of the way.
            </p>
            <div style="background: ${BRAND_COLORS.background}; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>📧 Email:</strong> 
              <a href="mailto:support@nikahsufiyana.com" style="color: ${BRAND_COLORS.primary}; text-decoration: none; margin-left: 5px;">
                support@nikahsufiyana.com
              </a>
            </div>
          </div>
          
          <!-- Islamic Quote -->
          <div style="${EMAIL_STYLES.quranVerse}">
            <div style="position: absolute; top: 10px; left: 20px; color: ${BRAND_COLORS.secondary}; font-size: 24px; opacity: 0.3;">"</div>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text}; font-style: italic; font-size: 16px; font-family: ${TYPOGRAPHY.primary};">
              <strong>"And Allah is the protector of those who have faith."</strong>
            </p>
            <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
              - Quran 2:257
            </p>
            <div style="position: absolute; bottom: 10px; right: 20px; color: ${BRAND_COLORS.secondary}; font-size: 24px; opacity: 0.3; transform: rotate(180deg);">"</div>
          </div>
          
          <p style="${EMAIL_STYLES.paragraph}">
            <strong>May Allah keep you safe and guide you through this process.</strong>
          </p>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px; text-align: center;">
            Barakallahu feeki,<br>
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
  userEmail: string, 
  userName: string, 
  responderName: string, 
  action: 'accept' | 'decline',
  photoAccessDuration?: string
): Promise<boolean> {
  const isAccepted = action === 'accept';
  const accessDurationText = photoAccessDuration ? getDurationText(photoAccessDuration) : '';
  const title = isAccepted ? 'Interest Accepted!' : 'Interest Response';
  const subtitle = isAccepted ? 'Great news about your interest request' : 'Update on your interest request';
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: `${isAccepted ? '🎉' : '📩'} ${title} - Nikah Sufiyana`,
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader(title, subtitle)}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            <span style="color: ${BRAND_COLORS.secondary};">السلام علیکم</span> ${userName}
          </h2>
          
          ${isAccepted ? `
            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);">
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
                <p style="margin: 0 0 10px 0; color: ${BRAND_COLORS.text};">
                  You now have access to view <strong>${responderName}'s photos</strong> for <strong>${accessDurationText}</strong>.
                </p>
                <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
                  After this period, photo access will be automatically revoked for privacy protection.
                </p>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
                🚀 What You Can Do Now
              </h3>
              <ul style="color: ${BRAND_COLORS.text}; padding-left: 20px; margin: 0; line-height: 1.8;">
                <li><strong>View Complete Profile:</strong> Access their full profile information</li>
                <li><strong>Send Messages:</strong> Start a meaningful conversation</li>
                <li><strong>Connect Safely:</strong> Build your relationship with Islamic values</li>
                <li><strong>Plan Next Steps:</strong> Consider meeting with family involvement</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/${responderName.toLowerCase().replace(/\s+/g, '-')}" style="${EMAIL_STYLES.button}">
                View Their Profile
              </a>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05)); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; color: ${BRAND_COLORS.text}; font-style: italic; font-size: 16px;">
                <strong>"And among His signs is that He created for you mates from among yourselves, 
                that you may dwell in tranquility with them."</strong>
              </p>
              <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
                - Quran 30:21
              </p>
            </div>
          ` : `
            <div style="background: linear-gradient(135deg, #FEE2E2, #FECACA); padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0; border-left: 4px solid #EF4444;">
              <h3 style="color: #DC2626; margin: 0 0 10px 0; font-size: 18px;">Interest Response</h3>
              <p style="margin: 0; color: #991B1B;">
                <strong>${responderName}</strong> has respectfully declined your interest request at this time.
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
                🌟 Keep Your Hope Alive
              </h3>
              <ul style="color: ${BRAND_COLORS.text}; padding-left: 20px; margin: 0; line-height: 1.8;">
                <li>This is part of Allah's plan - the right person is waiting for you</li>
                <li>Continue browsing and connecting with other compatible profiles</li>
                <li>Keep your profile updated and engaging</li>
                <li>Stay positive and trust in Allah's timing</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" style="${EMAIL_STYLES.button}">
                Continue Browsing
              </a>
            </div>
          `}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: transparent; color: ${BRAND_COLORS.primary}; padding: 12px 30px; text-decoration: none; border: 2px solid ${BRAND_COLORS.primary}; border-radius: 6px; font-weight: bold;">
              Visit Your Dashboard
            </a>
          </div>
          
          <p style="${EMAIL_STYLES.paragraph}">
            <strong>May Allah guide you to your perfect match and bless your journey with success.</strong>
          </p>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>The Nikah Sufiyana Team</strong>
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
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "💕 New Interest Received - Nikah Sufiyana",
    html: `
      <div style="${EMAIL_STYLES.container}">
        ${getEmailHeader('New Interest Received!', 'Someone has shown interest in your profile')}
        
        <div style="${EMAIL_STYLES.content}">
          <h2 style="${EMAIL_STYLES.greeting}">
            <span style="color: ${BRAND_COLORS.secondary};">السلام علیکم</span> ${userName}
          </h2>
          
          <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; border-left: 4px solid ${BRAND_COLORS.primary};">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 20px;">💝 Great News!</h3>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 18px;">
              <strong>${senderName}</strong> has shown interest in your profile on Nikah Sufiyana!
            </p>
          </div>
          
          <div style="${EMAIL_STYLES.highlightBox}">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              🤔 What would you like to do?
            </h3>
            <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.text};">
              Review their profile carefully and decide whether to accept or decline their interest. 
              Take your time to make the best decision for yourself.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${EMAIL_STYLES.button}">
                Review Interest Request
              </a>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="color: ${BRAND_COLORS.primary}; margin: 0 0 15px 0; font-size: 18px;">
              🔐 Your Privacy is Protected
            </h3>
            <ul style="color: ${BRAND_COLORS.text}; padding-left: 20px; margin: 0; line-height: 1.8;">
              <li><strong>Photo Access Control:</strong> When you accept, choose how long they can view your photos</li>
              <li><strong>Time Options:</strong> 1 day, 2 days, 1 week, 1 month, or permanent access</li>
              <li><strong>Revoke Anytime:</strong> You can revoke photo access whenever you want</li>
              <li><strong>Islamic Values:</strong> All interactions respect Islamic principles of modesty</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05)); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-style: italic; font-size: 16px;">
              <strong>"And consult them in affairs. Then when you have decided, trust in Allah."</strong>
            </p>
            <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
              - Quran 3:159
            </p>
          </div>
          
          <p style="${EMAIL_STYLES.paragraph}">
            <strong>Take your time to make an informed decision. May Allah guide you to what is best for your future.</strong>
          </p>
          
          <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>The Nikah Sufiyana Team</strong>
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
