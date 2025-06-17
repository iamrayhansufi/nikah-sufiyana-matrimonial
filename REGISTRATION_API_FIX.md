# Registration API Troubleshooting Guide

## Recent Fixes Applied

We've addressed the 400 (Bad Request) error that occurred when trying to register on www.nikahsufiyana.com after the domain migration. The following fixes were applied:

1. **Registration Form Data Handling**:
   - Fixed age field type inconsistency
   - Added better client-side validation
   - Improved error handling and logging

2. **API Validation**:
   - Updated Zod schema to accept both string and number types for age
   - Enhanced error details in API responses
   - Added more comprehensive error logging

3. **Database Operations**:
   - Added proper type handling for the age field
   - Improved error handling for database operations

## Potential Issues and Solutions

### 1. Email Verification Issues

If users aren't receiving verification emails:

- Check that SMTP settings are correctly configured in environment variables
- Verify SMTP credentials are valid
- Check spam folders
- Ensure the email service isn't being rate-limited

Environment variables needed:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@nikahsufiyana.com
```

### 2. Database Connection Issues

If registration fails with database errors:

- Verify that your database credentials are correct
- Check database connection string in environment variables
- Ensure the database server is accessible from your deployment environment
- Check for any database constraints that might be failing

### 3. Registration Field Validation

Common validation issues:

- Phone number format: Ensure the phone number includes the country code
- Email format: Must be a valid email address
- Password: Must be at least 8 characters
- Required fields: Ensure all required fields are being submitted

### 4. Cross-Origin Issues

If you're experiencing CORS issues:

- Ensure the API routes are correctly configured to handle requests from your domain
- Check for any browser restrictions on cookie handling
- Verify that the middleware is properly handling domain validation

## Testing Registration

To test the registration process:

1. Open developer tools (F12) in your browser
2. Go to the Network tab
3. Fill in the registration form and submit
4. Look for the POST request to `/api/register` 
5. Examine the request payload and response for any errors

## Next Steps

If you encounter any issues even after these fixes:

1. Check the server logs for detailed error messages
2. Verify all environment variables are correctly set in Vercel
3. Test in an incognito browser window to rule out cookie/cache issues
4. Try different user information to rule out specific data validation issues
