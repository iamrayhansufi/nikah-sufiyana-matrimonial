const nodemailer = require("nodemailer");
require('dotenv').config();

// Create a test SMTP transporter
const testTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true // Enable debug output
});

// Test sending an email
async function testEmailSending() {
  console.log("Testing email configuration...");
  console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`SMTP User: ${process.env.SMTP_USER}`);
  // Don't log the full password, just a hint
  console.log(`SMTP Pass: ${process.env.SMTP_PASS ? '******' : 'Not provided'}`);
  
  try {
    // First verify the connection without sending
    console.log("Verifying SMTP connection...");
    const verification = await testTransporter.verify();
    console.log("SMTP Verification result:", verification);
    
    // Then try to send a test email
    console.log("Sending test email...");
    const testEmail = {
      from: process.env.FROM_EMAIL || "rishta@nikahsufiyana.com",
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: "SMTP Test Email",
      text: "This is a test email to verify SMTP configuration.",
      html: "<p>This is a test email to verify SMTP configuration.</p>",
    };
    
    const info = await testTransporter.sendMail(testEmail);
    console.log("Email sent successfully:", info);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error("Email test failed with error:", error);
    return false;
  }
}

// Run the test
testEmailSending()
  .then(result => {
    console.log("Test completed with result:", result);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error("Unhandled exception during test:", error);
    process.exit(1);
  });
