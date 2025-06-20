# Vercel Deployment Guide (Redis)

This guide covers deploying the Nikah Sufiyana Matrimonial application to Vercel with Redis (Upstash) as the primary database.

## Prerequisites

1. Vercel account and CLI installed
2. Upstash Redis instance created
3. Domain configured in Vercel
4. Email service credentials

## Environment Variables

The following environment variables must be configured in your Vercel project:

```env
# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://www.nikahsufiyana.com
NEXTAUTH_URL_INTERNAL=https://www.nikahsufiyana.com
NEXTAUTH_COOKIE_DOMAIN=www.nikahsufiyana.com

# Redis Configuration
KV_URL=your-redis-url
KV_REST_API_URL=your-rest-api-url
KV_REST_API_TOKEN=your-api-token
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token
REDIS_URL=your-redis-url
DATABASE_TYPE=redis

# Email Configuration
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_USER=your-email
SMTP_PASS=your-password
FROM_EMAIL=your-email

# Application
NEXT_PUBLIC_APP_URL=https://www.nikahsufiyana.com
```

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Migration to Redis complete"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings:
     - Framework Preset: Next.js
     - Build Command: `next build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Configure Environment Variables**
   - In your Vercel project settings
   - Go to "Environment Variables"
   - Add all required variables from above

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete

5. **Verify Deployment**
   - Check the deployment logs for any errors
   - Test the deployed application
   - Run health checks:
     - User authentication
     - Profile creation and updates
     - Interest/shortlist functionality
     - Email notifications

6. **Monitor Performance**
   - Set up Vercel Analytics
   - Monitor Redis connection pool
   - Check error logs
   - Monitor API response times

## Post-Deployment Checks

- [ ] Verify all API routes are working
- [ ] Test authentication flow
- [ ] Check email notifications
- [ ] Verify file uploads
- [ ] Test search functionality
- [ ] Check mobile responsiveness
- [ ] Verify SSL/HTTPS
- [ ] Test custom domain
- [ ] Monitor error logs

## Troubleshooting

### Common Issues

1. **Redis Connection Errors**
   - Verify Redis credentials
   - Check connection string format
   - Ensure Upstash firewall allows Vercel IPs

2. **Next.js Build Errors**
   - Check build logs
   - Verify dependencies
   - Check TypeScript errors

3. **Auth Issues**
   - Verify NEXTAUTH variables
   - Check cookie domain settings
   - Test auth flow in production

### Monitoring

- Use Vercel Logs for real-time monitoring
- Set up error tracking (e.g., Sentry)
- Monitor Redis metrics in Upstash dashboard

## Scaling

The application is designed to scale horizontally with:

- Serverless functions on Vercel
- Redis connection pooling
- Edge caching when possible
- Optimized API routes

## Backup Strategy

1. **Redis Data Backup**
   - Schedule regular backups via Upstash console
   - Export data periodically using backup scripts
   - Store backups securely

2. **Environment Variables**
   - Keep secure backup of all credentials
   - Document any changes to configuration

## Security Considerations

1. **Redis Security**
   - Use secure Redis URLs only
   - Keep API tokens secure
   - Monitor access logs

2. **Application Security**
   - Enable rate limiting
   - Use secure headers
   - Monitor auth attempts

3. **Domain Security**
   - Maintain SSL certificates
   - Configure security headers
   - Monitor domain status

## Support and Maintenance

- Monitor application health
- Keep dependencies updated
- Review logs regularly
- Plan maintenance windows
- Document any issues and solutions

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
