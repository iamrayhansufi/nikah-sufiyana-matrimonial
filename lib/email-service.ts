import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "Welcome to Nikah Sufiyana - Your Journey Begins",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #f59e0b); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Nikah Sufiyana</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
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

  await transporter.sendMail(mailOptions)
}

export async function sendProfileApprovalEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "Profile Approved - Start Your Journey",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #f59e0b); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Profile Approved!</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Congratulations ${userName}!</h2>
          <p>Your profile has been approved and is now live on Nikah Sufiyana.</p>
          <p>You can now browse profiles, send interests, and connect with potential matches.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Browsing Profiles
            </a>
          </div>
          <p>May Allah guide you to your perfect match.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendProfileRejectionEmail(userEmail: string, userName: string, reason: string) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to: userEmail,
    subject: "Profile Review - Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Profile Review Required</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Dear ${userName},</h2>
          <p>We've reviewed your profile and found some issues that need to be addressed:</p>
          <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <strong>Reason:</strong> ${reason}
          </div>
          <p>Please update your profile and resubmit for review.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/edit" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Update Profile
            </a>
          </div>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
