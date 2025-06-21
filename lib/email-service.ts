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
