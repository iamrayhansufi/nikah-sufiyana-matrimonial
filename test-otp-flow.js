require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');

// Function to generate a random OTP
function generateOTP(length = 6) {
  const digits = "0123456789";
  let OTP = "";
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  
  return OTP;
}

// Function to send email
async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@nikahsufiyana.com",
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}

// Main function to test OTP generation and storage
async function testOTPFlow(email) {
  try {
    console.log(`Testing OTP flow for email: ${email}`);
    
    // Generate OTP
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Connect to database
    const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING;
    if (!dbUrl) {
      throw new Error("No database URL defined in environment variables");
    }
    
    console.log("Connecting to database...");
    const sql = neon(dbUrl);
    
    // Insert OTP into database
    console.log("Storing OTP in database...");
    await sql`
      INSERT INTO verification_codes (email, code, purpose, expires_at, is_used, created_at)
      VALUES (${email}, ${otp}, 'registration', ${expiresAt.toISOString()}, false, NOW())
    `;
    
    console.log("OTP stored in database successfully");
    
    // Send OTP email
    console.log("Sending OTP email...");
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #f59e0b); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Assalamu Alaikum,</h2>
          <p>Thank you for registering with Nikah Sufiyana. To complete your registration, please verify your email address.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2>Your Verification Code</h2>
            <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #10b981; padding: 10px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This code is valid for 10 minutes</p>
          </div>
          <p>If you did not request this verification, please ignore this email or contact our support team.</p>
          <p>May Allah bless your search for a righteous partner.</p>
          <p>Best regards,<br>The Nikah Sufiyana Team</p>
        </div>
      </div>
    `;
    
    const emailSent = await sendEmail(
      email, 
      "Verify Your Email - Nikah Sufiyana", 
      emailHtml
    );
    
    if (emailSent) {
      console.log("Test completed successfully - OTP stored and email sent!");
    } else {
      console.log("Test incomplete - OTP stored but email failed to send");
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run test with your email
const testEmail = process.argv[2] || "test@example.com";
testOTPFlow(testEmail);
