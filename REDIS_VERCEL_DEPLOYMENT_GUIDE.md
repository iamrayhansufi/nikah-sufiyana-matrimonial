# Vercel Deployment Guide for Redis Configuration

## Overview

This guide provides instructions for deploying the application to Vercel with Redis as the primary database. The application has been migrated from PostgreSQL to Upstash Redis for better scalability, performance, and cost-efficiency.

## Environment Variables

The following environment variables need to be configured in your Vercel project settings:

### Redis Configuration (Required)
- `KV_URL` - The Redis connection URL with SSL (starts with "rediss://")
- `KV_REST_API_URL` - The Upstash Redis REST API URL (e.g., "https://your-instance.upstash.io")
- `KV_REST_API_TOKEN` - The Upstash Redis REST API token for read/write access
- `KV_REST_API_READ_ONLY_TOKEN` - The Upstash Redis REST API token for read-only access
- `REDIS_URL` - Same as KV_URL, used by some libraries
- `DATABASE_TYPE` - Set to "redis" to use Redis as the primary database

### Authentication Configuration
- `NEXTAUTH_SECRET` - A secret string for NextAuth.js session encryption
- `NEXTAUTH_URL` - The public URL of your application (e.g., https://www.yourdomain.com)
- `NEXTAUTH_URL_INTERNAL` - The internal URL of your application (same as NEXTAUTH_URL)
- `NEXTAUTH_PREVIEW_URLS` - Comma-separated list of preview URLs
- `NEXTAUTH_COOKIE_DOMAIN` - The domain for cookies (e.g., yourdomain.com)

### Email Configuration
- `SMTP_HOST` - The SMTP server host
- `SMTP_PORT` - The SMTP server port (usually 465 for SSL or 587 for TLS)
- `SMTP_USER` - The SMTP server username
- `SMTP_PASS` - The SMTP server password
- `FROM_EMAIL` - The email address used as the sender

### Application Configuration
- `NEXT_PUBLIC_APP_URL` - The public URL of your application
- `VERCEL_URL` - Automatically set by Vercel, can be set to ${NEXTAUTH_URL}

## Deployment Steps

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)

2. Select your project or click "Import Project" to create a new one

3. Connect to your Git repository

4. Configure environment variables:
   - Go to "Settings" > "Environment Variables"
   - Add all required variables listed above
   - Make sure to mark "Production", "Preview", and "Development" for each variable as needed

5. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. Deploy the application:
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Post-Deployment Verification

After deployment, verify that your application is working correctly:

1. Check the application URL to ensure the website loads
2. Test the user registration and login flows
3. Verify that profiles, interests, and notifications are working
4. Test the search functionality
5. Check admin features if applicable

## Troubleshooting

If you encounter issues with the deployment:

1. **Redis Connection Issues**:
   - Verify that Redis environment variables are correct
   - Check that Upstash Redis service is running
   - Review Redis connection logs in the Vercel dashboard

2. **Authentication Issues**:
   - Verify NextAuth environment variables
   - Check that cookie domain matches your application URL
   - Review NextAuth logs in the Vercel dashboard

3. **Build Errors**:
   - Check for any reference to PostgreSQL in code
   - Ensure all dependencies are correctly installed
   - Review build logs in the Vercel dashboard

## Monitoring and Maintenance

1. Set up monitoring for your Redis instance in Upstash dashboard
2. Configure alerts for high memory usage or connection issues
3. Regularly back up your Redis data using Upstash backup features
4. Monitor application logs in Vercel dashboard for any errors

## Support

If you need assistance with your deployment:
- Contact Vercel support: https://vercel.com/support
- Contact Upstash support: https://upstash.com/support
- Refer to the project documentation for more information

---

© 2025 Nikah Sufiyana. All rights reserved.
