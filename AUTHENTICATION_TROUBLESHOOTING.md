## 🔧 Authentication Troubleshooting Checklist

### Before Testing:
- [ ] Deployment completed successfully
- [ ] Environment variables set in Vercel Dashboard
- [ ] Clear browser cache and cookies

### Testing Steps:

#### 1. Debug Endpoint Test
```
URL: https://nikah-sufiyana-matrimonial.vercel.app/api/auth/debug
Expected: JSON response with session/cookie info
```

#### 2. Login Flow Test
```
URL: https://nikah-sufiyana-matrimonial.vercel.app/login
Steps:
1. Enter credentials
2. Click Sign In
3. Should redirect to dashboard (not back to login)
```

#### 3. Session Persistence Test
```
Steps:
1. Login successfully
2. Refresh the page
3. Navigate to /dashboard directly
4. Should remain logged in
```

### Common Fixes:

#### Fix 1: Environment Variables Missing
```
Go to Vercel Dashboard → Settings → Environment Variables
Add for Production:
- DATABASE_URL
- NEXTAUTH_SECRET  
- NEXTAUTH_URL
- JWT_SECRET
```

#### Fix 2: Cookie Domain Issues
```
Check if NEXTAUTH_COOKIE_DOMAIN is set to .vercel.app
This should be automatic with our new configuration
```

#### Fix 3: NEXTAUTH_URL Mismatch
```
Ensure NEXTAUTH_URL exactly matches your deployed URL:
https://nikah-sufiyana-matrimonial.vercel.app
```

### If All Else Fails:
1. Check Vercel function logs for errors
2. Test with incognito browser window
3. Try different browser entirely
4. Contact for further debugging
