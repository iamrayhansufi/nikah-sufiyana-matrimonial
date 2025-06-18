/**
 * SQL commands for fixing the user account directly in the database
 * 
 * Instructions:
 * 1. Open a PostgreSQL client connected to your database
 * 2. Run the following queries to diagnose and fix the account
 */

-- 1. First check if the user exists and view their current status
SELECT id, email, full_name, verified, role, length(password) as password_length 
FROM users 
WHERE email = 'contact.rayhansufi@gmail.com';

-- 2. If needed, reset their password to "newpassword123"
-- (The hash below is for "newpassword123")
UPDATE users 
SET password = '$2a$12$QRCvpn1pAN1VyWW7sSzoD.AT6js1.sRTc.8OpSzeXGc1k8zQ2P9L6' 
WHERE email = 'contact.rayhansufi@gmail.com';

-- 3. Make sure the user is marked as verified
UPDATE users 
SET verified = true 
WHERE email = 'contact.rayhansufi@gmail.com';

-- 4. Verify the changes were applied
SELECT id, email, full_name, verified, role, length(password) as password_length 
FROM users 
WHERE email = 'contact.rayhansufi@gmail.com';

-- 5. If needed, add the user role if missing
UPDATE users
SET role = 'user'
WHERE email = 'contact.rayhansufi@gmail.com' AND (role IS NULL OR role = '');
