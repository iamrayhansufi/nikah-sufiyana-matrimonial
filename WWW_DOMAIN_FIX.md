# WWW Domain Redirect Loop Fix

## Problem
The website was experiencing a redirect loop when accessed via `www.nikahsufiyana.com`, showing the error "redirected you too many times".

## Root Cause
The middleware was configured to only accept the exact domain specified in NEXTAUTH_URL (likely `nikahsufiyana.com` without www), causing it to redirect away from the www subdomain. However, DNS or server settings were redirecting back to the www version, creating an infinite loop.

## Solution Applied

1. **Updated middleware.ts:**
   - Added detection for `www.${mainDomain}` as a valid domain
   - Prevented redirects when the hostname is the www version of the main domain

2. **Updated next.config.mjs:**
   - Added a comment to clarify that we're intentionally not redirecting between www and non-www
   - Let the middleware handle both domains as valid

## Future Considerations

There are two approaches for handling www vs non-www domains:

1. **Current approach:** Accept both www and non-www as valid domains
   - Pros: Users can access the site with either URL format
   - Cons: May affect SEO slightly by having duplicate content

2. **Alternative approach:** Pick one canonical version and redirect
   - This would require coordinating DNS settings with the middleware
   - Example: If DNS is set to prefer www, update NEXTAUTH_URL to use www version

## Environment Variable Requirements

Make sure your Vercel environment variables include:

- `NEXTAUTH_URL`: Set to your preferred canonical domain (with or without www)
- `NEXTAUTH_SECRET`: A secure random string for JWT encryption
- `DATABASE_URL`: Your database connection string

## Testing After Fix

1. Test both `https://nikahsufiyana.com` and `https://www.nikahsufiyana.com`
2. Verify both domains work without redirect loops
3. Test login/authentication on both domains
4. Ensure cookies are properly set and recognized

If issues persist, check the browser console and network tab for redirect chains.
