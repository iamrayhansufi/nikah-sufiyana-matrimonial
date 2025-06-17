# Post-Deployment Manual Validation Checklist

This document provides step-by-step instructions for manually validating critical features after deployment to ensure everything is working correctly with the new domain and updated credentials.

## Pre-Validation Setup

1. Open the website at https://www.nikahsufiyana.com in an incognito/private browser window
2. Clear browser cache and cookies if needed

## 1. Public Access

- [ ] Verify homepage loads correctly
- [ ] Check all public pages load without errors:
  - About page
  - Contact page
  - Events page
  - Privacy policy
  - Terms of service

## 2. User Registration and Authentication

- [ ] Register a new test account
  - Verify you receive a welcome email
  - Verify email verification link works
- [ ] Log in with the new account
  - Verify you can access authenticated areas
- [ ] Log out
  - Verify you're redirected appropriately
  - Verify protected areas are no longer accessible
- [ ] Test "Forgot Password" functionality
  - Verify you receive a password reset email
  - Verify the password reset link works

## 3. User Profile Features

- [ ] Create or edit profile
  - Upload a profile picture
  - Fill in biographical information
  - Add preferences
- [ ] Browse other profiles
  - Filter and search functionality
  - View profile details
- [ ] Test shortlist/interest functionality
  - Add profiles to shortlist
  - Show interest in other profiles

## 4. Messaging and Notifications

- [ ] Send a test message
- [ ] Receive and view messages
- [ ] Check notification system
  - Verify notifications appear correctly
  - Verify email notifications are working (if applicable)

## 5. Premium Features

- [ ] Test upgrade to premium account flow
  - Verify payment processing
  - Verify premium features are unlocked after payment
- [ ] Test all premium-only features

## 6. Admin Functionality

- [ ] Log in with admin credentials
- [ ] Verify admin dashboard loads
- [ ] Test user management functions
  - View user list
  - Edit/deactivate users
- [ ] View site statistics/reports

## 7. Error Cases and Edge Cases

- [ ] Test form validation with invalid inputs
- [ ] Test system behavior with very large inputs
- [ ] Test URL manipulation (try accessing unauthorized resources)
- [ ] Test concurrent actions (multiple tabs/sessions)

## Final Verification

- [ ] Verify all emails are sent from rishta@nikahsufiyana.com
- [ ] Check that no references to preview domains exist in emails or site content
- [ ] Verify all URLs in the site are using https://www.nikahsufiyana.com

## Problems Encountered

Document any issues found during validation here:

1. 
2. 
3. 

## Notes and Observations

Add any additional notes or observations here:
