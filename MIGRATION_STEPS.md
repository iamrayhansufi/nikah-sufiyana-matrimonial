# Nikah Sufiyana Migration Steps

This document outlines the remaining steps to complete the migration of Nikah Sufiyana from the Vercel preview domain to the primary domain (https://nikahsufiyana.com).

## 1. Update External Services with New Credentials

### NeonDB Database

1. Log in to the NeonDB dashboard
2. Navigate to the project containing the "neondb" database
3. Update the user "neondb_owner" password to match the newly generated one:
   ```
   L0nowcjg3woxiq3b -> [New Password from generate-credentials.js]
   ```
4. Test the connection with the new password

### SMTP / Email Provider

1. Log in to Hostinger email management
2. Navigate to the email account: `rishta@nikahsufiyana.com`
3. Update the email password to match the newly generated one:
   ```
   Qs64DRKwc7Vz3zw6 -> [New Password from generate-credentials.js]
   ```
4. Test sending an email with the new credentials

## 2. Update Vercel Environment Variables

1. Log in to the Vercel dashboard
2. Navigate to the "nikah-sufiyana-matrimonial" project
3. Go to "Settings" > "Environment Variables"
4. Update the following variables with the new credentials:
   - `DATABASE_URL` (and all related DB URLs/credentials)
   - `SMTP_PASS`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
5. Remove any old or unused preview URLs from `NEXTAUTH_PREVIEW_URLS`
6. Ensure all URLs are using `nikahsufiyana.com` domain
7. Save the changes

## 3. Clean Up Any Remaining Hardcoded References

1. Run the security check script again to find any remaining hardcoded credentials or domain references:
   ```
   npm run security:check
   ```
2. Review any flagged files and update them
3. Pay special attention to:
   - Build output files (outside of `.next` folder)
   - Test fixtures
   - Example/documentation files

## 4. Final Deployment and Verification

1. Commit and push all changes to GitHub
2. Trigger a new Vercel deployment:
   ```
   vercel --prod
   ```
3. Run the deployment verification script:
   ```
   npm run verify:deployment
   ```
4. Manually check the critical user flows:
   - Registration
   - Login/authentication
   - Email verification
   - Profile creation/editing
   - Premium features

## 5. Additional Security Measures (Optional)

1. Set up alerts for credential exposure (using GitHub secret scanning or similar tools)
2. Implement regular credential rotation schedule
3. Document security best practices for the team

## Important URLs and Resources

- Production site: https://nikahsufiyana.com
- GitHub repository: [REPO_URL]
- Vercel dashboard: [VERCEL_URL]
- NeonDB dashboard: [NEON_DB_URL]
- Hostinger email admin: [HOSTINGER_URL]
