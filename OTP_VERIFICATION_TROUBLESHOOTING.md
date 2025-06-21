# OTP Verification Issue Troubleshooting Guide

## Issue Summary
The user is experiencing 400 Bad Request errors when trying to verify OTP codes. The error logs show requests are being made to `https://www.nikahsufiyana.com/api/verify/verify-otp` instead of the local development server.

## Root Cause Analysis

### ✅ **What's Working**
1. **Local Development Server**: Running correctly on `http://localhost:3000`
2. **API Endpoint**: `/api/verify/verify-otp` is functioning properly
3. **Validation**: Input validation is working correctly
4. **Notification System**: Fixed and working properly
5. **Build Process**: Compiles successfully without errors

### ❌ **Issue Identified**
The user appears to be testing on the **production website** (`https://www.nikahsufiyana.com`) rather than the local development server (`http://localhost:3000`).

## Solutions

### Option 1: Use Local Development Server (Recommended)
1. **Access the local development server**: `http://localhost:3000`
2. **Test registration flow**: Complete registration with a valid email
3. **Verify OTP**: Use the verification code sent to your email

### Option 2: Update Production Server
If you need to test on production, ensure the production server has:
1. **Latest code deployed** with the Redis migration changes
2. **Environment variables** properly configured for production
3. **Redis database** set up and accessible

## Testing Steps

### 1. Verify Local Development Environment
```bash
# Make sure the development server is running
npm run dev

# Should show:
# ✓ Ready in X.Xs
# - Local:        http://localhost:3000
```

### 2. Test API Endpoints Manually
```bash
# Test OTP verification endpoint
curl -X POST http://localhost:3000/api/verify/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "purpose": "registration"
  }'

# Expected response: 400 with "Invalid or expired verification code"
```

### 3. Test Complete Registration Flow
1. Navigate to `http://localhost:3000/register`
2. Fill out the registration form with a **valid email address**
3. Submit the form
4. Check your email for the verification code
5. Navigate to `http://localhost:3000/verify-email`
6. Enter the 6-digit code from your email
7. Click "Verify Email"

## Debug Information

### Current Status
- ✅ **Build**: Successful
- ✅ **API**: `/api/verify/verify-otp` working correctly
- ✅ **Validation**: Input validation functioning
- ✅ **Notifications**: Response format fixed
- ✅ **Server**: Running on `http://localhost:3000`

### API Response Format
The API correctly returns:
```json
{
  "success": true/false,
  "message": "Success/error message",
  "user": { ... } // Only on successful verification
}
```

### Error Handling
- **400**: Validation errors or invalid/expired codes
- **404**: User not found
- **500**: Server errors

## Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution**: Clear Next.js cache and restart
```bash
# Windows
Remove-Item ".next" -Recurse -Force
npm run dev

# Linux/Mac
rm -rf .next
npm run dev
```

### Issue: Port conflicts
**Solution**: Next.js will automatically use the next available port
- Default: `http://localhost:3000`
- If 3000 is busy: `http://localhost:3001`

### Issue: API requests going to production
**Solution**: Ensure you're accessing the local development server URL, not the production site

## Next Steps

1. **For Development**: Use `http://localhost:3000`
2. **For Production**: Deploy the latest changes to your production server
3. **For Testing**: Use a real email address to receive OTP codes

The local development environment is fully functional and ready for testing the complete registration and verification flow.
