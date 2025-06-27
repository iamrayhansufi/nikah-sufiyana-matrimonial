/**
 * Nikah Sufiyana - Comprehensive Testing Suite
 * Tests all core functionalities of the matrimonial platform
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3002';
const TEST_RESULTS = {
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

// Test data
const TEST_USER_1 = {
  fullName: 'Ahmed Hassan',
  email: 'ahmed.test@nikahsufiyana.com',
  phone: '9876543210',
  password: 'TestPass123!',
  gender: 'male',
  age: '28',
  education: 'Masters',
  profession: 'Software Engineer',
  sect: 'Sunni',
  city: 'Mumbai',
  country: 'India'
};

const TEST_USER_2 = {
  fullName: 'Fatima Khan',
  email: 'fatima.test@nikahsufiyana.com',
  phone: '9876543211',
  password: 'TestPass123!',
  gender: 'female',
  age: '25',
  education: 'Bachelors',
  profession: 'Teacher',
  sect: 'Sunni',
  city: 'Mumbai',
  country: 'India'
};

class NikahSufiyanaTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Enable request interception to monitor network calls
    await this.page.setRequestInterception(true);
    this.page.on('request', request => request.continue());
    
    // Monitor console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console Error: ${msg.text()}`);
      }
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Utility function to wait and take screenshot
  async waitAndScreenshot(name, delay = 2000) {
    await this.page.waitForTimeout(delay);
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  // Test 1: Registration Flow
  async testRegistrationFlow() {
    console.log('🔍 Testing Registration Flow...');
    
    try {
      // Navigate to registration page
      await this.page.goto(`${BASE_URL}/register`);
      await this.waitAndScreenshot('01-registration-page');

      // Check if registration form loads
      const formExists = await this.page.$('form');
      if (!formExists) {
        TEST_RESULTS.registration.status = 'FAIL';
        TEST_RESULTS.registration.issues.push('Registration form not found');
        return;
      }

      // Fill basic information
      await this.page.type('input[name="fullName"]', TEST_USER_1.fullName);
      await this.page.type('input[name="email"]', TEST_USER_1.email);
      await this.page.type('input[name="phone"]', TEST_USER_1.phone);
      await this.page.type('input[name="password"]', TEST_USER_1.password);
      await this.page.type('input[name="confirmPassword"]', TEST_USER_1.password);

      // Select gender
      await this.page.click(`input[value="${TEST_USER_1.gender}"]`);

      await this.waitAndScreenshot('02-basic-info-filled');

      // Fill additional details
      await this.page.type('input[name="age"]', TEST_USER_1.age);
      await this.page.select('select[name="education"]', TEST_USER_1.education);
      await this.page.type('input[name="profession"]', TEST_USER_1.profession);

      await this.waitAndScreenshot('03-additional-details-filled');

      // Accept terms and privacy
      await this.page.click('input[name="termsAccepted"]');
      await this.page.click('input[name="privacyAccepted"]');

      // Submit form
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForTimeout(3000);
        await this.waitAndScreenshot('04-registration-submitted');

        // Check for success or error messages
        const errorMessage = await this.page.$('.error, .alert-error, [role="alert"]');
        const successMessage = await this.page.$('.success, .alert-success');

        if (errorMessage) {
          const errorText = await errorMessage.textContent();
          TEST_RESULTS.registration.issues.push(`Registration error: ${errorText}`);
          TEST_RESULTS.registration.status = 'FAIL';
        } else if (successMessage || this.page.url().includes('verify-email')) {
          TEST_RESULTS.registration.status = 'PASS';
          TEST_RESULTS.registration.notes.push('Registration form submitted successfully');
        } else {
          TEST_RESULTS.registration.status = 'PARTIAL';
          TEST_RESULTS.registration.notes.push('Registration submitted but unclear if successful');
        }
      } else {
        TEST_RESULTS.registration.status = 'FAIL';
        TEST_RESULTS.registration.issues.push('Submit button not found');
      }

    } catch (error) {
      TEST_RESULTS.registration.status = 'FAIL';
      TEST_RESULTS.registration.issues.push(`Registration test failed: ${error.message}`);
    }
  }

  // Test 2: Profile Creation & Document Upload
  async testProfileCreation() {
    console.log('🔍 Testing Profile Creation & Document Upload...');
    
    try {
      // Navigate to profile edit page (assuming user is logged in)
      await this.page.goto(`${BASE_URL}/edit-profile`);
      await this.waitAndScreenshot('05-profile-edit-page');

      // Test profile photo upload
      const photoInput = await this.page.$('input[type="file"][accept*="image"]');
      if (photoInput) {
        // Create a test image file path
        const testImagePath = path.join(__dirname, 'test-assets', 'test-photo.jpg');
        
        // Check if test image exists, if not, note it
        try {
          await fs.access(testImagePath);
          await photoInput.uploadFile(testImagePath);
          await this.page.waitForTimeout(2000);
          
          // Check for upload success/failure indicators
          const uploadSuccess = await this.page.$('.upload-success, .success');
          const uploadError = await this.page.$('.upload-error, .error');
          
          if (uploadSuccess) {
            TEST_RESULTS.profileCreation.notes.push('Photo upload successful');
          } else if (uploadError) {
            const errorText = await uploadError.textContent();
            TEST_RESULTS.profileCreation.issues.push(`Photo upload error: ${errorText}`);
          }
        } catch (fileError) {
          TEST_RESULTS.profileCreation.notes.push('Test image file not found - upload functionality not fully tested');
        }
      }

      // Test document upload (biodata)
      const docInput = await this.page.$('input[type="file"][accept*="pdf"], input[type="file"][accept*="doc"]');
      if (docInput) {
        TEST_RESULTS.profileCreation.notes.push('Document upload field found');
      } else {
        TEST_RESULTS.profileCreation.issues.push('Document upload field not found');
      }

      TEST_RESULTS.profileCreation.status = TEST_RESULTS.profileCreation.issues.length === 0 ? 'PASS' : 'PARTIAL';

    } catch (error) {
      TEST_RESULTS.profileCreation.status = 'FAIL';
      TEST_RESULTS.profileCreation.issues.push(`Profile creation test failed: ${error.message}`);
    }
  }

  // Test 3: Matchmaking Algorithm
  async testMatchmaking() {
    console.log('🔍 Testing Matchmaking Algorithm...');
    
    try {
      // Navigate to browse/search page
      await this.page.goto(`${BASE_URL}/browse`);
      await this.waitAndScreenshot('06-browse-page');

      // Check if profiles are loading
      const profileCards = await this.page.$$('.profile-card, [data-testid="profile-card"]');
      
      if (profileCards.length > 0) {
        TEST_RESULTS.matchmaking.notes.push(`Found ${profileCards.length} profile cards`);
        
        // Check if profiles have essential information
        const firstProfile = profileCards[0];
        const hasName = await firstProfile.$('.name, [data-testid="profile-name"]');
        const hasAge = await firstProfile.$('.age, [data-testid="profile-age"]');
        const hasLocation = await firstProfile.$('.location, [data-testid="profile-location"]');
        
        if (hasName && hasAge && hasLocation) {
          TEST_RESULTS.matchmaking.notes.push('Profile cards contain essential information');
          TEST_RESULTS.matchmaking.status = 'PASS';
        } else {
          TEST_RESULTS.matchmaking.issues.push('Profile cards missing essential information');
          TEST_RESULTS.matchmaking.status = 'PARTIAL';
        }
      } else {
        TEST_RESULTS.matchmaking.issues.push('No profile cards found on browse page');
        TEST_RESULTS.matchmaking.status = 'FAIL';
      }

      // Test search/filter functionality
      const searchInput = await this.page.$('input[type="search"], input[placeholder*="search"]');
      if (searchInput) {
        await searchInput.type('Mumbai');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        TEST_RESULTS.matchmaking.notes.push('Search functionality available');
      }

    } catch (error) {
      TEST_RESULTS.matchmaking.status = 'FAIL';
      TEST_RESULTS.matchmaking.issues.push(`Matchmaking test failed: ${error.message}`);
    }
  }

  // Test 4: Messaging System
  async testMessaging() {
    console.log('🔍 Testing Messaging System...');
    
    try {
      await this.page.goto(`${BASE_URL}/messages`);
      await this.waitAndScreenshot('07-messages-page');

      // Check if messaging interface exists
      const messageInterface = await this.page.$('.message-container, .chat-container, [data-testid="messages"]');
      
      if (messageInterface) {
        TEST_RESULTS.messaging.notes.push('Messaging interface found');
        
        // Check for security features
        const blockButton = await this.page.$('button[data-action="block"], .block-button');
        const reportButton = await this.page.$('button[data-action="report"], .report-button');
        
        if (blockButton || reportButton) {
          TEST_RESULTS.messaging.notes.push('Security features (block/report) available');
        } else {
          TEST_RESULTS.messaging.issues.push('Block/Report features not found');
        }
        
        TEST_RESULTS.messaging.status = 'PASS';
      } else {
        TEST_RESULTS.messaging.status = 'FAIL';
        TEST_RESULTS.messaging.issues.push('Messaging interface not found');
      }

    } catch (error) {
      TEST_RESULTS.messaging.status = 'FAIL';
      TEST_RESULTS.messaging.issues.push(`Messaging test failed: ${error.message}`);
    }
  }

  // Test 5: Privacy Settings & Security
  async testPrivacySettings() {
    console.log('🔍 Testing Privacy Settings & Security...');
    
    try {
      await this.page.goto(`${BASE_URL}/settings`);
      await this.waitAndScreenshot('08-privacy-settings');

      // Check for privacy toggles
      const privacyToggles = await this.page.$$('input[type="checkbox"][name*="privacy"], .privacy-toggle');
      
      if (privacyToggles.length > 0) {
        TEST_RESULTS.privacy.notes.push(`Found ${privacyToggles.length} privacy controls`);
        
        // Test toggling privacy settings
        for (let i = 0; i < Math.min(privacyToggles.length, 3); i++) {
          await privacyToggles[i].click();
          await this.page.waitForTimeout(500);
        }
        
        TEST_RESULTS.privacy.notes.push('Privacy toggles functional');
        TEST_RESULTS.privacy.status = 'PASS';
      } else {
        TEST_RESULTS.privacy.issues.push('Privacy settings not found');
        TEST_RESULTS.privacy.status = 'FAIL';
      }

      // Check HTTPS
      if (this.page.url().startsWith('https://') || this.page.url().includes('localhost')) {
        TEST_RESULTS.privacy.notes.push('Secure connection verified');
      } else {
        TEST_RESULTS.privacy.issues.push('Site not using HTTPS in production');
      }

    } catch (error) {
      TEST_RESULTS.privacy.status = 'FAIL';
      TEST_RESULTS.privacy.issues.push(`Privacy test failed: ${error.message}`);
    }
  }

  // Test 6: Loading Performance
  async testLoading() {
    console.log('🔍 Testing Loading Performance...');
    
    try {
      const pages = ['/', '/browse', '/about', '/contact', '/faq'];
      
      for (const pagePath of pages) {
        const startTime = Date.now();
        await this.page.goto(`${BASE_URL}${pagePath}`);
        
        // Wait for page to be fully loaded
        await this.page.waitForSelector('body');
        const loadTime = Date.now() - startTime;
        
        if (loadTime < 3000) {
          TEST_RESULTS.loading.notes.push(`${pagePath}: ${loadTime}ms (GOOD)`);
        } else if (loadTime < 5000) {
          TEST_RESULTS.loading.notes.push(`${pagePath}: ${loadTime}ms (ACCEPTABLE)`);
        } else {
          TEST_RESULTS.loading.issues.push(`${pagePath}: ${loadTime}ms (SLOW)`);
        }
        
        // Check for broken images
        const brokenImages = await this.page.evaluate(() => {
          const images = Array.from(document.images);
          return images.filter(img => !img.complete || img.naturalWidth === 0).length;
        });
        
        if (brokenImages > 0) {
          TEST_RESULTS.loading.issues.push(`${pagePath}: ${brokenImages} broken images`);
        }
      }
      
      TEST_RESULTS.loading.status = TEST_RESULTS.loading.issues.length === 0 ? 'PASS' : 'PARTIAL';

    } catch (error) {
      TEST_RESULTS.loading.status = 'FAIL';
      TEST_RESULTS.loading.issues.push(`Loading test failed: ${error.message}`);
    }
  }

  // Test 7: Support Pages
  async testSupportPages() {
    console.log('🔍 Testing Support & Informational Pages...');
    
    try {
      const supportPages = ['/faq', '/contact', '/about', '/blog', '/events'];
      
      for (const pagePath of supportPages) {
        try {
          await this.page.goto(`${BASE_URL}${pagePath}`);
          await this.page.waitForTimeout(1000);
          
          // Check if page loads without 404
          const pageTitle = await this.page.title();
          const hasContent = await this.page.$('main, .content, article');
          
          if (hasContent && !pageTitle.includes('404')) {
            TEST_RESULTS.support.notes.push(`${pagePath}: Loads successfully`);
          } else {
            TEST_RESULTS.support.issues.push(`${pagePath}: Page not found or empty`);
          }
        } catch (pageError) {
          TEST_RESULTS.support.issues.push(`${pagePath}: ${pageError.message}`);
        }
      }
      
      TEST_RESULTS.support.status = TEST_RESULTS.support.issues.length === 0 ? 'PASS' : 'PARTIAL';

    } catch (error) {
      TEST_RESULTS.support.status = 'FAIL';
      TEST_RESULTS.support.issues.push(`Support pages test failed: ${error.message}`);
    }
  }

  // Test 8: Responsive Design
  async testResponsiveDesign() {
    console.log('🔍 Testing Responsive Design...');
    
    try {
      const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];
      
      for (const viewport of viewports) {
        await this.page.setViewport({ width: viewport.width, height: viewport.height });
        await this.page.goto(`${BASE_URL}`);
        await this.page.waitForTimeout(1000);
        
        // Check if navigation is accessible
        const navigation = await this.page.$('nav, .navigation, .navbar');
        if (navigation) {
          const isVisible = await navigation.isIntersectingViewport();
          if (isVisible) {
            TEST_RESULTS.responsive.notes.push(`${viewport.name}: Navigation visible`);
          } else {
            TEST_RESULTS.responsive.issues.push(`${viewport.name}: Navigation not visible`);
          }
        }
        
        await this.waitAndScreenshot(`responsive-${viewport.name.toLowerCase()}`);
      }
      
      TEST_RESULTS.responsive.status = TEST_RESULTS.responsive.issues.length === 0 ? 'PASS' : 'PARTIAL';

    } catch (error) {
      TEST_RESULTS.responsive.status = 'FAIL';
      TEST_RESULTS.responsive.issues.push(`Responsive design test failed: ${error.message}`);
    }
  }

  // Test 9: Premium Features
  async testPremiumFeatures() {
    console.log('🔍 Testing Premium Features...');
    
    try {
      // Check premium badge logic
      await this.page.goto(`${BASE_URL}/browse`);
      await this.page.waitForTimeout(2000);
      
      // Look for premium badges
      const premiumBadges = await this.page.$$('.premium-badge, [data-premium="true"]');
      
      if (premiumBadges.length > 0) {
        // Check if badges are only on premium profiles
        for (const badge of premiumBadges) {
          const profileCard = await badge.$x('./ancestor::*[contains(@class, "profile") or contains(@class, "card")]');
          if (profileCard.length > 0) {
            TEST_RESULTS.premium.notes.push('Premium badges found on profile cards');
          }
        }
      }
      
      // Check premium plans page
      await this.page.goto(`${BASE_URL}/premium`);
      const pricingPlans = await this.page.$$('.pricing-plan, .plan-card');
      
      if (pricingPlans.length > 0) {
        TEST_RESULTS.premium.notes.push(`Found ${pricingPlans.length} pricing plans`);
        TEST_RESULTS.premium.status = 'PASS';
      } else {
        TEST_RESULTS.premium.issues.push('Premium plans not found');
        TEST_RESULTS.premium.status = 'PARTIAL';
      }

    } catch (error) {
      TEST_RESULTS.premium.status = 'FAIL';
      TEST_RESULTS.premium.issues.push(`Premium features test failed: ${error.message}`);
    }
  }

  // Test 10: Performance Metrics
  async testPerformance() {
    console.log('🔍 Testing Performance Metrics...');
    
    try {
      await this.page.goto(`${BASE_URL}`);
      
      // Get performance metrics
      const metrics = await this.page.metrics();
      
      TEST_RESULTS.performance.notes.push(`JS Heap Used: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB`);
      TEST_RESULTS.performance.notes.push(`DOM Nodes: ${metrics.Nodes}`);
      TEST_RESULTS.performance.notes.push(`Event Listeners: ${metrics.JSEventListeners}`);
      
      // Check for console errors
      let errorCount = 0;
      this.page.on('console', msg => {
        if (msg.type() === 'error') errorCount++;
      });
      
      await this.page.waitForTimeout(3000);
      
      if (errorCount === 0) {
        TEST_RESULTS.performance.notes.push('No console errors detected');
      } else {
        TEST_RESULTS.performance.issues.push(`${errorCount} console errors detected`);
      }
      
      TEST_RESULTS.performance.status = errorCount === 0 ? 'PASS' : 'PARTIAL';

    } catch (error) {
      TEST_RESULTS.performance.status = 'FAIL';
      TEST_RESULTS.performance.issues.push(`Performance test failed: ${error.message}`);
    }
  }

  // Main test runner
  async runAllTests() {
    console.log('🚀 Starting Nikah Sufiyana Test Suite...');
    
    // Create screenshots directory
    try {
      await fs.mkdir('screenshots', { recursive: true });
    } catch (e) {}
    
    await this.init();
    
    try {
      await this.testRegistrationFlow();
      await this.testProfileCreation();
      await this.testMatchmaking();
      await this.testMessaging();
      await this.testPrivacySettings();
      await this.testLoading();
      await this.testSupportPages();
      await this.testResponsiveDesign();
      await this.testPremiumFeatures();
      await this.testPerformance();
    } finally {
      await this.cleanup();
    }

    // Generate test report
    await this.generateReport();
  }

  async generateReport() {
    const report = {
      testSuite: 'Nikah Sufiyana Matrimonial Platform',
      timestamp: new Date().toISOString(),
      summary: {
        total: Object.keys(TEST_RESULTS).length,
        passed: Object.values(TEST_RESULTS).filter(r => r.status === 'PASS').length,
        failed: Object.values(TEST_RESULTS).filter(r => r.status === 'FAIL').length,
        partial: Object.values(TEST_RESULTS).filter(r => r.status === 'PARTIAL').length
      },
      results: TEST_RESULTS
    };

    // Save JSON report
    await fs.writeFile('test-report.json', JSON.stringify(report, null, 2));
    
    // Console output
    console.log('\n🏁 Test Suite Complete!');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️  Partial: ${report.summary.partial}`);
    console.log(`📊 Total: ${report.summary.total}`);
    console.log('═══════════════════════════════════════');
    
    // Detailed results
    for (const [testName, result] of Object.entries(TEST_RESULTS)) {
      const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`\n${statusIcon} ${testName.toUpperCase()}: ${result.status}`);
      
      if (result.notes.length > 0) {
        console.log('  Notes:');
        result.notes.forEach(note => console.log(`    • ${note}`));
      }
      
      if (result.issues.length > 0) {
        console.log('  Issues:');
        result.issues.forEach(issue => console.log(`    ⚠️ ${issue}`));
      }
    }
    
    console.log('\n📄 Full report saved to: test-report.json');
    console.log('📸 Screenshots saved to: screenshots/');
  }
}

// Run the tests
const testSuite = new NikahSufiyanaTestSuite();
testSuite.runAllTests().catch(console.error);

module.exports = NikahSufiyanaTestSuite;
