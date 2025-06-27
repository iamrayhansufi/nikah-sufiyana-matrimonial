/**
 * Manual Testing Checklist for Nikah Sufiyana
 * Run this in browser console to perform basic functionality checks
 */

// Test Results Object
const testResults = {
  registration: { status: 'PENDING', notes: [], issues: [] },
  profileCreation: { status: 'PENDING', notes: [], issues: [] },
  matchmaking: { status: 'PENDING', notes: [], issues: [] },
  messaging: { status: 'PENDING', notes: [], issues: [] },
  privacy: { status: 'PENDING', notes: [], issues: [] },
  loading: { status: 'PENDING', notes: [], issues: [] },
  support: { status: 'PENDING', notes: [], issues: [] },
  responsive: { status: 'PENDING', notes: [], issues: [] },
  premium: { status: 'PENDING', notes: [], issues: [] },
  performance: { status: 'PENDING', notes: [], issues: [] }
};

// Utility functions
function logTest(category, message, isError = false) {
  const timestamp = new Date().toLocaleTimeString();
  const status = isError ? '❌' : '✅';
  console.log(`[${timestamp}] ${status} ${category.toUpperCase()}: ${message}`);
  
  if (isError) {
    testResults[category].issues.push(message);
  } else {
    testResults[category].notes.push(message);
  }
}

function checkElement(selector, description, category) {
  const element = document.querySelector(selector);
  if (element) {
    logTest(category, `${description}: Found`);
    return element;
  } else {
    logTest(category, `${description}: Not found`, true);
    return null;
  }
}

function checkMultipleElements(selector, description, category, minCount = 1) {
  const elements = document.querySelectorAll(selector);
  if (elements.length >= minCount) {
    logTest(category, `${description}: Found ${elements.length} elements`);
    return elements;
  } else {
    logTest(category, `${description}: Expected at least ${minCount}, found ${elements.length}`, true);
    return elements;
  }
}

// Test 1: Registration Form Tests
function testRegistrationForm() {
  console.log('\n🔍 Testing Registration Form...');
  
  // Check if we're on registration page
  if (!window.location.pathname.includes('/register')) {
    logTest('registration', 'Not on registration page - navigate to /register first', true);
    return;
  }
  
  // Check form existence
  const form = checkElement('form', 'Registration form', 'registration');
  if (!form) {
    testResults.registration.status = 'FAIL';
    return;
  }
  
  // Check essential input fields
  const essentialFields = [
    { selector: 'input[name="fullName"], input[id="fullName"]', name: 'Full Name' },
    { selector: 'input[name="email"], input[id="email"]', name: 'Email' },
    { selector: 'input[name="phone"], input[id="phone"]', name: 'Phone' },
    { selector: 'input[name="password"], input[id="password"]', name: 'Password' },
    { selector: 'select[name="gender"], [id="gender"]', name: 'Gender' }
  ];
  
  let foundFields = 0;
  essentialFields.forEach(field => {
    if (checkElement(field.selector, field.name + ' field', 'registration')) {
      foundFields++;
    }
  });
  
  // Check submit button
  const submitBtn = checkElement('button[type="submit"], input[type="submit"]', 'Submit button', 'registration');
  
  // Check terms and conditions
  const termsCheckbox = checkElement('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="Terms"]', 'Terms checkbox', 'registration');
  
  if (foundFields >= 4 && submitBtn) {
    testResults.registration.status = 'PASS';
    logTest('registration', 'All essential form elements found');
  } else {
    testResults.registration.status = 'PARTIAL';
  }
}

// Test 2: Profile Elements
function testProfileElements() {
  console.log('\n🔍 Testing Profile Elements...');
  
  // Check for profile cards (on browse page)
  const profileCards = checkMultipleElements(
    '.profile-card, [data-testid="profile"], .card, .user-card',
    'Profile cards',
    'profileCreation'
  );
  
  if (profileCards.length > 0) {
    // Check profile card contents
    const firstCard = profileCards[0];
    const hasName = firstCard.querySelector('.name, [data-testid="name"], h2, h3');
    const hasAge = firstCard.querySelector('.age, [data-testid="age"]');
    const hasLocation = firstCard.querySelector('.location, [data-testid="location"]');
    const hasPhoto = firstCard.querySelector('img, [data-testid="photo"]');
    
    if (hasName) logTest('profileCreation', 'Profile cards contain names');
    if (hasAge) logTest('profileCreation', 'Profile cards contain age');
    if (hasLocation) logTest('profileCreation', 'Profile cards contain location');
    if (hasPhoto) logTest('profileCreation', 'Profile cards contain photos');
    
    testResults.profileCreation.status = 'PASS';
  } else {
    testResults.profileCreation.status = 'FAIL';
  }
}

// Test 3: Navigation and Links
function testNavigation() {
  console.log('\n🔍 Testing Navigation...');
  
  // Check header navigation
  const nav = checkElement('nav, .navigation, .navbar, header nav', 'Main navigation', 'support');
  
  if (nav) {
    const navLinks = nav.querySelectorAll('a, button');
    logTest('support', `Found ${navLinks.length} navigation links`);
    
    // Check for essential links
    const essentialLinks = ['Home', 'Browse', 'About', 'Contact', 'Login', 'Register'];
    const foundLinks = [];
    
    navLinks.forEach(link => {
      const text = link.textContent.trim();
      if (essentialLinks.some(essential => text.toLowerCase().includes(essential.toLowerCase()))) {
        foundLinks.push(text);
      }
    });
    
    logTest('support', `Found essential links: ${foundLinks.join(', ')}`);
    testResults.support.status = foundLinks.length >= 3 ? 'PASS' : 'PARTIAL';
  }
}

// Test 4: Responsive Design Check
function testResponsive() {
  console.log('\n🔍 Testing Responsive Design...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  logTest('responsive', `Current viewport: ${viewport.width}x${viewport.height}`);
  
  // Check if mobile menu exists for smaller screens
  if (viewport.width < 768) {
    const mobileMenu = checkElement('.mobile-menu, .hamburger, .menu-toggle', 'Mobile menu', 'responsive');
    testResults.responsive.status = mobileMenu ? 'PASS' : 'PARTIAL';
  } else {
    // Check desktop layout
    const desktopNav = checkElement('nav:not(.mobile)', 'Desktop navigation', 'responsive');
    testResults.responsive.status = desktopNav ? 'PASS' : 'PARTIAL';
  }
}

// Test 5: Form Validation
function testFormValidation() {
  console.log('\n🔍 Testing Form Validation...');
  
  const forms = document.querySelectorAll('form');
  
  if (forms.length > 0) {
    logTest('registration', `Found ${forms.length} forms on page`);
    
    forms.forEach((form, index) => {
      const requiredFields = form.querySelectorAll('input[required], select[required]');
      const validationMessages = form.querySelectorAll('.error, .invalid, [role="alert"]');
      
      logTest('registration', `Form ${index + 1}: ${requiredFields.length} required fields, ${validationMessages.length} validation messages`);
    });
    
    testResults.registration.status = 'PASS';
  } else {
    logTest('registration', 'No forms found on current page');
  }
}

// Test 6: Loading Performance
function testLoadingPerformance() {
  console.log('\n🔍 Testing Loading Performance...');
  
  // Check page load time
  const perfData = performance.getEntriesByType('navigation')[0];
  if (perfData) {
    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
    
    logTest('loading', `Page load time: ${loadTime.toFixed(2)}ms`);
    logTest('loading', `DOM Content Loaded: ${domContentLoaded.toFixed(2)}ms`);
    
    if (loadTime < 3000) {
      logTest('loading', 'Page load time is acceptable (< 3s)');
      testResults.loading.status = 'PASS';
    } else {
      logTest('loading', 'Page load time is slow (> 3s)', true);
      testResults.loading.status = 'PARTIAL';
    }
  }
  
  // Check for broken images
  const images = document.querySelectorAll('img');
  let brokenImages = 0;
  
  images.forEach(img => {
    if (!img.complete || img.naturalHeight === 0) {
      brokenImages++;
    }
  });
  
  if (brokenImages === 0) {
    logTest('loading', `All ${images.length} images loaded successfully`);
  } else {
    logTest('loading', `${brokenImages} broken images found`, true);
  }
}

// Test 7: Premium Features
function testPremiumFeatures() {
  console.log('\n🔍 Testing Premium Features...');
  
  // Check for premium badges
  const premiumBadges = checkMultipleElements(
    '.premium, .premium-badge, [data-premium="true"], .badge',
    'Premium badges',
    'premium',
    0
  );
  
  // Check for premium plans
  const pricingSection = checkElement('.pricing, .plans, .subscription', 'Pricing section', 'premium');
  
  if (premiumBadges.length > 0 || pricingSection) {
    testResults.premium.status = 'PASS';
  } else {
    testResults.premium.status = 'PARTIAL';
  }
}

// Test 8: Security Features
function testSecurityFeatures() {
  console.log('\n🔍 Testing Security Features...');
  
  // Check HTTPS
  if (location.protocol === 'https:') {
    logTest('privacy', 'Site uses HTTPS');
  } else if (location.hostname === 'localhost') {
    logTest('privacy', 'Running on localhost (development)');
  } else {
    logTest('privacy', 'Site not using HTTPS', true);
  }
  
  // Check for privacy settings
  const privacySettings = checkMultipleElements(
    'input[type="checkbox"][name*="privacy"], .privacy-toggle, .security-setting',
    'Privacy settings',
    'privacy',
    0
  );
  
  // Check for block/report buttons
  const securityButtons = checkMultipleElements(
    'button[data-action="block"], button[data-action="report"], .block-btn, .report-btn',
    'Security buttons',
    'messaging',
    0
  );
  
  testResults.privacy.status = 'PARTIAL';
  testResults.messaging.status = 'PARTIAL';
}

// Test 9: Console Errors
function testConsoleErrors() {
  console.log('\n🔍 Testing Console Errors...');
  
  // Override console.error to capture errors
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  // Wait a bit and check
  setTimeout(() => {
    if (errorCount === 0) {
      logTest('performance', 'No console errors detected');
      testResults.performance.status = 'PASS';
    } else {
      logTest('performance', `${errorCount} console errors detected`, true);
      testResults.performance.status = 'PARTIAL';
    }
    
    // Restore original console.error
    console.error = originalError;
  }, 2000);
}

// Test Runner
function runManualTests() {
  console.log('🚀 Starting Manual Tests for Nikah Sufiyana...');
  console.log('===============================================');
  
  // Run all tests
  testRegistrationForm();
  testProfileElements();
  testNavigation();
  testResponsive();
  testFormValidation();
  testLoadingPerformance();
  testPremiumFeatures();
  testSecurityFeatures();
  testConsoleErrors();
  
  // Generate summary after a delay
  setTimeout(() => {
    console.log('\n📊 Test Summary:');
    console.log('=================');
    
    const summary = {
      total: Object.keys(testResults).length,
      passed: 0,
      failed: 0,
      partial: 0
    };
    
    Object.entries(testResults).forEach(([test, result]) => {
      const status = result.status;
      const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
      
      console.log(`${icon} ${test.toUpperCase()}: ${status}`);
      
      if (status === 'PASS') summary.passed++;
      else if (status === 'FAIL') summary.failed++;
      else if (status === 'PARTIAL') summary.partial++;
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`    ⚠️ ${issue}`));
      }
    });
    
    console.log('\n📈 Summary:');
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️ Partial: ${summary.partial}`);
    console.log(`📊 Total: ${summary.total}`);
    
    // Store results globally for export
    window.testResults = testResults;
    window.testSummary = summary;
    
    console.log('\n💾 Results stored in window.testResults and window.testSummary');
    console.log('You can copy these objects to export the results.');
    
  }, 3000);
}

// Auto-run if this script is executed
if (typeof window !== 'undefined') {
  runManualTests();
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runManualTests, testResults };
}
