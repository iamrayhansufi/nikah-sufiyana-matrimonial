# Registration API Troubleshooting Guide

## Latest Fixes (June 17, 2025) - Database Error Fix

We've fixed the 500 (Internal Server Error) related to database queries when checking for existing users. The following updates were made:

1. **Improved Database Query Handling**:
   - Replaced problematic query.users.findFirst approach with explicit select queries
   - Added robust error handling around all database operations
   - Added type checking and validation for database insertions

2. **Enhanced Error Handling**:
   - Added specific error detection for common database issues
   - Improved error messages with more actionable information
   - Implemented better logging throughout the registration process
   - Added stack trace information in development environment

## Previous Fix (June 17, 2025) - Location Field Fix

We fixed the specific 400 (Bad Request) error related to the `location` field validation. The following updates were made:

1. **Modified Location Validation**:
   - Made the `location` field optional in the validation schema
   - Added support for `preferredLocation` as an alternative field
   - Implemented fallback logic: If `location` is missing, use `preferredLocation` or `city`

2. **Enhanced Request Logging**:
   - Added more detailed logging for form field submission
   - Included mapping of fields present in the request

## Previous Fixes Applied

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

#### Specific Database Issues Fixed:

1. **Query Method Change**:
   - Changed from using `db.query.users.findFirst()` to `db.select().from(users).where().limit(1).execute()`
   - This provides better error handling and compatibility with Neon database in serverless environments

2. **Connection Pooling**:
   - Added better handling of database connections for serverless environments
   - Improved error detection for database connection issues

3. **Type Safety**:
   - Added explicit type checking for database operations
   - Ensures all inserted values match the database schema requirements

### 3. Registration Field Validation

Common validation issues:

- Phone number format: Ensure the phone number includes the country code
- Email format: Must be a valid email address
- Password: Must be at least 8 characters
- Required fields: Ensure all required fields are being submitted

#### Field Dependencies and Fallbacks

The following fields have special handling:

- **Location**: 
  - Uses a fallback chain: `location` → `preferredLocation` → `city`
  - At least one of these fields must be provided
  - The API now maps these fields automatically for compatibility

- **Age**:
  - Accepts both string and number formats
  - Will be converted to number for database storage

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

## Testing with Sample Data

To test the registration with valid data, use this sample JSON structure:

```json
{
  "fullName": "Test User",
  "gender": "male",
  "email": "test@example.com",
  "phone": "+919876543210",
  "countryCode": "+91",
  "age": "25",
  "education": "Graduate",
  "profession": "it-software",
  "country": "india",
  "city": "hyderabad",
  "preferredLocation": "hyderabad", 
  "sect": "sunni",
  "password": "Test@12345"
}
```

Notice that even without an explicit `location` field, the registration should now work correctly by using the `preferredLocation` value.
