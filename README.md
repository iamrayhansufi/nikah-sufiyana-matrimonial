# Nikah Sufiyana Matrimonial

This repository contains the full source code and infrastructure for the Nikah Sufiyana Matrimonial website, now running at [https://www.nikahsufiyana.com](https://www.nikahsufiyana.com).

## Project Structure

The project is built using:
- Next.js 15 (React framework)
- Drizzle ORM with NeonDB (PostgreSQL)
- Authentication via NextAuth.js
- Email notifications via SMTP

## Key Directories & Files

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and helpers
- `/src/db` - Database schema and connection logic
- `/scripts` - Helper scripts for various tasks
- `/public` - Static assets

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in required values
4. Run the development server:
   ```bash
   npm run dev
   ```

## Database

The project uses a PostgreSQL database hosted on NeonDB. To work with the database:

- Generate Drizzle schema changes: `npm run db:generate`
- Run migrations: `npm run db:migrate`
- Push schema changes: `npm run db:push`
- Open Drizzle Studio: `npm run db:studio`

## Scripts

Several scripts are available for development and maintenance:

- `npm run dev` - Start the development server
- `npm run build` - Build the application
- `npm run deploy` - Deploy to Vercel
- `npm run deploy:verify` - Deploy with verification steps
- `npm run security:check` - Run security checks
- `npm run verify:deployment` - Verify a deployment
- `npm run db:check` - Check database connection
- `npm run generate:credentials` - Generate new secure credentials

## Migrating to Production

For detailed steps on the domain migration and production setup, refer to:
- `FINAL_MIGRATION_STEPS.md` - Final steps to complete the domain migration
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checks
- `POST_DEPLOY_VALIDATION.md` - Post-deployment validation steps

## Security

This project follows secure coding practices:
- No credentials in source code
- Environment variables for all sensitive information
- Regular security checks
- Secure authentication flows

## License

This project is proprietary software. All rights reserved.
