# Final Migration Steps for Nikah Sufiyana

This document provides the final steps needed to complete the migration to the new domain and update all credentials.

## 1. Update External Service Credentials

### Database Credentials (NeonDB)

1. Log in to the [NeonDB Dashboard](https://console.neon.tech/)
2. Navigate to your project containing the "neondb" database
3. Update the password for user "neondb_owner" to:
   ```
   FBZt22aBZuqmE
   ```
4. After updating, run this command locally to verify the connection:
   ```powershell
   npx tsx scripts/check-db.ts
   ```

### Email/SMTP Credentials (Hostinger)

1. Log in to the Hostinger email management console
2. Navigate to the email account: `rishta@nikahsufiyana.com`
3. Update the email password to:
   ```
   28qAN4x6mFVxeaew
   ```
4. After updating, verify email functionality through the application

## 2. Vercel Environment Variables

1. Log in to the [Vercel Dashboard](https://vercel.com)
2. Navigate to the "nikah-sufiyana-matrimonial" project
3. Go to "Settings" > "Environment Variables"
4. Ensure the following variables match your local `.env` file:

   ```
   JWT_SECRET=7fd9ee85c62492c3176f40e673b5a7f62346aa1ff54ff3d9f79d80d70e3e6118
   NEXTAUTH_SECRET=9e75e99e82f19098e2ba7b06b843de0d210a0523bc8021c8e92f52888c4909aa
   NEXTAUTH_URL=https://www.nikahsufiyana.com
   NEXTAUTH_URL_INTERNAL=https://www.nikahsufiyana.com
   VERCEL_URL=${NEXTAUTH_URL}
   NEXTAUTH_PREVIEW_URLS=https://nikah-sufiyana-matrimonial-git-main-iamrayhansufis-projects.vercel.app
   NEXTAUTH_COOKIE_DOMAIN=.nikahsufiyana.com
   
   DATABASE_URL=postgres://neondb_owner:FBZt22aBZuqmE@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   DATABASE_URL_UNPOOLED=postgresql://neondb_owner:FBZt22aBZuqmE@ep-nameless-feather-a4nvzzdp.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   PGHOST=ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech
   PGHOST_UNPOOLED=ep-nameless-feather-a4nvzzdp.us-east-1.aws.neon.tech
   PGUSER=neondb_owner
   PGPASSWORD=FBZt22aBZuqmE
   
   POSTGRES_URL=postgresql://neondb_owner:FBZt22aBZuqmE@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   POSTGRES_USER=neondb_owner
   POSTGRES_HOST=ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech
   POSTGRES_PASSWORD=FBZt22aBZuqmE
   POSTGRES_DATABASE=neondb
   POSTGRES_URL_NO_SSL=postgres://neondb_owner:FBZt22aBZuqmE@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb
   POSTGRES_PRISMA_URL=postgres://neondb_owner:FBZt22aBZuqmE@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
   
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=rishta@nikahsufiyana.com
   SMTP_PASS=28qAN4x6mFVxeaew
   FROM_EMAIL=rishta@nikahsufiyana.com
   
   NEXT_PUBLIC_APP_URL=https://www.nikahsufiyana.com
   ```

5. Remove any old preview URLs from environment variables if they exist

## 3. Final Deployment

1. After updating all credentials in NeonDB and Hostinger, commit any remaining changes to your repository
2. Deploy to Vercel using:

   ```powershell
   vercel --prod
   ```

3. Monitor the build process and ensure it succeeds

## 4. Verify Deployment

1. Run the deployment verification script:

   ```powershell
   node scripts/verify-deployment.js
   ```

2. Manually test these critical user flows:
   - Registration
   - Login/authentication
   - Email verification
   - Profile creation/editing
   - Premium features
   - Admin functionality

3. Run a final security check:

   ```powershell
   npm run security:check
   ```

## Contact

If you encounter any issues during this process, refer to the troubleshooting steps in `DEPLOYMENT_CHECKLIST.md` or contact technical support.
