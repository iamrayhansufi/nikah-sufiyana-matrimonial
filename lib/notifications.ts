// Email and SMS notification services

export async function sendVerificationEmail(email: string, otp: string) {
  // Send verification email using service like SendGrid, AWS SES, etc.
  console.log(`Sending verification email to ${email} with OTP: ${otp}`)

  const emailContent = `
    <h2>Welcome to Nikah Sufiyana!</h2>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>Please enter this code to verify your email address.</p>
  `

  // Implementation with email service
}

export async function sendVerificationSMS(phone: string, otp: string) {
  // Send verification SMS using service like Twilio, AWS SNS, etc.
  console.log(`Sending verification SMS to ${phone} with OTP: ${otp}`)

  const message = `Your Nikah Sufiyana verification code is: ${otp}`

  // Implementation with SMS service
}

export async function sendWelcomeEmail(email: string, name: string) {
  console.log(`Sending welcome email to ${email}`)

  const emailContent = `
    <h2>Assalamu Alaikum ${name}!</h2>
    <p>Welcome to Nikah Sufiyana - India's most trusted Islamic matrimonial platform.</p>
    <p>Your profile is now under review and will be approved within 24 hours.</p>
    <p>Start browsing profiles and find your perfect match!</p>
  `
}

export async function sendProfileApprovalEmail(email: string, name: string, approved: boolean) {
  console.log(`Sending profile ${approved ? "approval" : "rejection"} email to ${email}`)

  const emailContent = approved
    ? `<h2>Congratulations ${name}!</h2><p>Your profile has been approved. You can now start connecting with other members.</p>`
    : `<h2>Profile Update Required</h2><p>Your profile needs some updates before approval. Please check your dashboard for details.</p>`
}

export async function sendPaymentConfirmation(email: string, planType: string, amount: number) {
  console.log(`Sending payment confirmation to ${email}`)

  const emailContent = `
    <h2>Payment Successful!</h2>
    <p>Thank you for upgrading to ${planType} plan.</p>
    <p>Amount: ₹${amount}</p>
    <p>Your premium features are now active!</p>
  `
}

export async function sendUserNotification(userId: string, message: string) {
  // Get user from Redis database
  const user = await database.users.getById(userId);

  console.log(`Sending notification to user ${userId}: ${message}`);

  if (user?.email) {
    const emailContent = `
      <h2>Nikah Sufiyana Update</h2>
      <p>Dear ${user.fullName},</p>
      <p>${message}</p>
      <p>If you have any questions, please contact our support team.</p>
    `;

    // Implementation with email service
    // You should implement the actual email sending logic here
  }
}

// In-app notification functions
import { redis } from "@/lib/redis-client";
import { database } from "@/lib/database-service";

interface NotificationData {
  userId: string;
  type: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  read?: boolean;
}

interface RedisNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  metadata: string;
  read: string;
  createdAt: string;
}

interface ParsedNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  metadata: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export async function createNotification(data: NotificationData) {
  const { userId, type, message, link, metadata = {}, read = false } = data;
  
  try {
    const notificationId = await redis.incr("notification:id");
    const timestamp = new Date().toISOString();

    console.log(`Creating notification for user ${userId}:`, {
      type,
      message,
      link,
      metadata,
      read,
      timestamp
    });
    
    // Save to Redis
    await redis.hset(`notification:${notificationId}`, {
      id: notificationId.toString(),
      userId,
      type,
      message,
      link: link || "",
      metadata: JSON.stringify(metadata),
      read: read.toString(),
      createdAt: timestamp
    });

    // Add to user's notifications list
    await redis.rpush(`user:${userId}:notifications`, notificationId.toString());
    
    // Optionally trigger real-time notification via WebSockets if implemented
    
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    // Update the notification read status in Redis
    console.log(`Marking notification ${notificationId} as read`);
    
    await redis.hset(`notification:${notificationId}`, {
      read: "true"
    });
    
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

export async function getUserNotifications(userId: string) {
  try {
    // Get the user's notifications from Redis
    console.log(`Getting notifications for user ${userId}`);
    
    // Get notification IDs from user's list
    const notificationIds = await redis.lrange(`user:${userId}:notifications`, 0, -1);
    
    // Get all notifications in parallel
    const notifications = await Promise.all(
      notificationIds.map(async (id) => {
        const notificationData = await redis.hgetall(`notification:${id}`);
        if (!notificationData) return null;
        
        const notification = notificationData as unknown as RedisNotification;

        // Parse metadata if it exists
        let metadata: Record<string, any> = {};
        try {
          if (notification.metadata) {
            metadata = JSON.parse(notification.metadata);
          }
        } catch (error) {
          console.error(`Error parsing metadata for notification ${id}:`, error);
        }

        return {
          ...notification,
          metadata,
          read: notification.read === "true"
        } as ParsedNotification;
      })
    );

    // Filter out any null values and sort by createdAt descending
    return notifications
      .filter((n): n is ParsedNotification => n !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return [];
  }
}
