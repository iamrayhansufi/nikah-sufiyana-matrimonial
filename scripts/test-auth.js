#!/usr/bin/env node

/**
 * Quick debugging script for authentication issues
 * Run this to check common problems
 */

const https = require('https');

const SITE_URL = 'https://nikahsufiyana.com';

console.log('🔍 Testing Nikah Sufiyana Authentication...\n');

// Test 1: Check if site is accessible
console.log('1. Testing site accessibility...');
https.get(SITE_URL, (res) => {
  console.log(`   ✅ Site accessible: ${res.statusCode}`);
  
  // Test 2: Check auth debug endpoint
  console.log('2. Testing auth debug endpoint...');
  https.get(`${SITE_URL}/api/auth/debug`, (debugRes) => {
    let data = '';
    debugRes.on('data', chunk => data += chunk);
    debugRes.on('end', () => {
      try {
        const debugInfo = JSON.parse(data);
        console.log(`   ✅ Debug endpoint accessible: ${debugRes.statusCode}`);
        console.log(`   📊 Session status: ${debugInfo.hasSession ? '✅ Active' : '❌ No session'}`);
        console.log(`   🍪 Cookies: ${Object.keys(debugInfo.cookies || {}).length} found`);
        console.log(`   🌍 Environment: ${debugInfo.environment?.nodeEnv || 'unknown'}`);
      } catch (e) {
        console.log(`   ❌ Debug endpoint error: ${e.message}`);
      }
    });
  }).on('error', (e) => {
    console.log(`   ❌ Debug endpoint failed: ${e.message}`);
  });
  
}).on('error', (e) => {
  console.log(`   ❌ Site inaccessible: ${e.message}`);
});

// Test 3: Check login page
console.log('3. Testing login page...');
https.get(`${SITE_URL}/login`, (loginRes) => {
  console.log(`   ✅ Login page accessible: ${loginRes.statusCode}`);
}).on('error', (e) => {
  console.log(`   ❌ Login page failed: ${e.message}`);
});

console.log('\n📝 Manual test steps:');
console.log('   1. Visit the debug URL and check session status');
console.log('   2. Try logging in with your credentials');
console.log('   3. Check if redirected to dashboard');
console.log('   4. Verify that session persists on page refresh');
