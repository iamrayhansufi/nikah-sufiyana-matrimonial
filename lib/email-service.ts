import nodemailer from "nodemailer"

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
    subject: "Welcome to Nikah Sufiyana - Your Journey Begins",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C7203E, #A11B35); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Nikah Sufiyana</h1>
        </div>
        <div style="padding: 20px; background: #FCF9F2;">
          <h2>Assalamu Alaikum ${userName},</h2>
          <p>Welcome to Nikah Sufiyana, where meaningful connections are made with Islamic values at heart.</p>
          <p>Your profile has been submitted for review. Our team will verify your information and approve your profile within 24-48 hours.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Next Steps:</h3>
            <ul>
              <li>Complete your profile with detailed information</li>
              <li>Upload a clear profile photo</li>
              <li>Verify your phone number</li>
              <li>Browse compatible profiles</li>
            </ul>
          </div>
          <p>May Allah bless your search for a righteous partner.</p>
          <p>Best regards,<br>The Nikah Sufiyana Team</p>
        </div>
      </div>
    `,
  }

  return await sendEmail(mailOptions);
}

export async function sendProfileApprovalEmail(userEmail: string, userName: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "Profile Approved - Start Your Journey",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C7203E, #A11B35); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Profile Approved!</h1>
        </div>
        <div style="padding: 20px; background: #FCF9F2;">
          <h2>Congratulations ${userName}!</h2>
          <p>Your profile has been approved and is now live on Nikah Sufiyana.</p>
          <p>You can now browse profiles, send interests, and connect with potential matches.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" 
               style="background: #C7203E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Browsing Profiles
            </a>
          </div>
          <p>May Allah guide you to your perfect match.</p>
        </div>
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

export async function sendOTPVerificationEmail(userEmail: string, otp: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com", // Changed from hardcoded email
    to: userEmail,
    subject: "Verify Your Email - Nikah Sufiyana",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C7203E, #A11B35); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="padding: 20px; background: #FCF9F2;">
          <h2>Assalamu Alaikum,</h2>
          <p>Thank you for registering with Nikah Sufiyana. To complete your registration, please verify your email address.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2>Your Verification Code</h2>
            <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #C7203E; padding: 10px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This code is valid for 10 minutes</p>
          </div>
          <p>If you did not request this verification, please ignore this email or contact our support team.</p>
          <p>May Allah bless your search for a righteous partner.</p>
          <p>Best regards,<br>The Nikah Sufiyana Team</p>
        </div>
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
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: isAccepted 
      ? "Great News! Your Interest Has Been Accepted"
      : "Interest Response Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${isAccepted ? '#10B981, #059669' : '#EF4444, #DC2626'}); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">${isAccepted ? 'Interest Accepted! 🎉' : 'Interest Response'}</h1>
        </div>
        <div style="padding: 20px; background: #FCF9F2;">
          <h2>Assalamu Alaikum, ${userName}</h2>
          ${isAccepted ? `
            <p>Congratulations! ${responderName} has <strong>accepted</strong> your interest.</p>
            ${photoAccessDuration ? `
              <div style="background: #E6FFFA; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #047857;">Photo Access Granted</h3>
                <p style="margin: 0;">You now have access to view ${responderName}'s photos for <strong>${accessDurationText}</strong>.</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #065F46;">After this period, photo access will be automatically revoked.</p>
              </div>
            ` : ''}
            <p>You can now:</p>
            <ul>
              <li>View their complete profile</li>
              <li>Send messages (if available)</li>
              <li>Continue building your connection</li>
            </ul>
          ` : `
            <p>Thank you for your interest. ${responderName} has <strong>declined</strong> your interest at this time.</p>
            <p>Don't worry - there are many other potential matches waiting for you on Nikah Sufiyana.</p>
          `}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #C7203E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Visit Your Dashboard
            </a>
          </div>
          <p>May Allah guide you to your perfect match.</p>
          <p>Best regards,<br>The Nikah Sufiyana Team</p>
        </div>
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
    subject: "New Interest Received on Nikah Sufiyana",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C7203E, #A11B35); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Interest Received! 💕</h1>
        </div>
        <div style="padding: 20px; background: #FCF9F2;">
          <h2>Assalamu Alaikum, ${userName}</h2>
          <p><strong>${senderName}</strong> has shown interest in your profile on Nikah Sufiyana!</p>
          
          <div style="background: white; border: 2px solid #C7203E; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #C7203E; margin: 0 0 15px 0;">What would you like to do?</h3>
            <p style="margin: 0 0 20px 0;">Review their profile and decide whether to accept or decline their interest.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #C7203E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Interest
            </a>
          </div>
          
          <p><strong>Remember:</strong> When you accept an interest, you can choose how long they can view your photos.</p>
          <p>Take your time to review their profile and make the best decision for yourself.</p>
          
          <p>May Allah guide you to your perfect match.</p>
          <p>Best regards,<br>The Nikah Sufiyana Team</p>
        </div>
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
