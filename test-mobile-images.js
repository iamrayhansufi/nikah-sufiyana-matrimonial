#!/usr/bin/env node

/**
 * Mobile Image Testing Script
 * Tests mobile image loading and responsiveness
 */

console.log('🔍 Testing Mobile Image Loading...\n');

// Test 1: Check if placeholder image exists
const fs = require('fs');
const path = require('path');

const placeholderPath = path.join(__dirname, 'public', 'placeholder-user.jpg');
if (fs.existsSync(placeholderPath)) {
  console.log('✅ Placeholder image exists');
} else {
  console.log('❌ Placeholder image missing');
}

// Test 2: Check Next.js config for image optimization
const configPath = path.join(__dirname, 'next.config.mjs');
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf8');
  if (config.includes('unoptimized: false')) {
    console.log('✅ Image optimization enabled');
  } else {
    console.log('❌ Image optimization disabled');
  }
  
  if (config.includes('deviceSizes')) {
    console.log('✅ Mobile device sizes configured');
  } else {
    console.log('❌ Mobile device sizes not configured');
  }
} else {
  console.log('❌ Next.js config not found');
}

// Test 3: Check for mobile CSS optimizations
const globalCssPath = path.join(__dirname, 'app', 'globals.css');
if (fs.existsSync(globalCssPath)) {
  const css = fs.readFileSync(globalCssPath, 'utf8');
  if (css.includes('@media (max-width: 768px)')) {
    console.log('✅ Mobile CSS optimizations found');
  } else {
    console.log('❌ Mobile CSS optimizations missing');
  }
} else {
  console.log('❌ Global CSS not found');
}

// Test 4: Check browse page for Next.js Image components
const browsePage = path.join(__dirname, 'app', 'browse', 'page.tsx');
if (fs.existsSync(browsePage)) {
  const pageContent = fs.readFileSync(browsePage, 'utf8');
  if (pageContent.includes('import Image from "next/image"')) {
    console.log('✅ Next.js Image import found');
  } else {
    console.log('❌ Next.js Image import missing');
  }
  
  if (pageContent.includes('<Image')) {
    console.log('✅ Image components used in browse page');
  } else {
    console.log('❌ Regular img tags used (should be Image components)');
  }
  
  if (pageContent.includes('sizes="(max-width: 768px)')) {
    console.log('✅ Responsive image sizes configured');
  } else {
    console.log('❌ Responsive image sizes missing');
  }
} else {
  console.log('❌ Browse page not found');
}

console.log('\n🔧 Recommendations for mobile image issues:');
console.log('1. Test on actual mobile device or browser dev tools mobile view');
console.log('2. Check network tab for failed image requests');
console.log('3. Verify Cloudinary URLs are accessible');
console.log('4. Check console for image loading errors');
console.log('5. Ensure proper internet connection on mobile device');
console.log('\n📱 To test mobile images:');
console.log('1. Open Chrome DevTools');
console.log('2. Click device toolbar (mobile icon)');
console.log('3. Select a mobile device');
console.log('4. Navigate to /browse page');
console.log('5. Check if profile images load correctly');
