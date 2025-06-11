#!/usr/bin/env node

/**
 * Custom git sync utility for deployment
 * This replaces the missing git.sync command with standard git operations
 */

const { execSync } = require('child_process');

function gitSync() {
  try {
    console.log('🔄 Starting git synchronization...');
    
    // Fetch latest changes
    console.log('📥 Fetching latest changes...');
    execSync('git fetch origin', { stdio: 'inherit' });
    
    // Check current branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    console.log(`🌿 Current branch: ${currentBranch}`);
    
    // Pull latest changes
    console.log('⬇️ Pulling latest changes...');
    execSync(`git pull origin ${currentBranch}`, { stdio: 'inherit' });
    
    // Check if there are any uncommitted changes
    try {
      execSync('git diff-index --quiet HEAD --', { stdio: 'pipe' });
      console.log('✅ Working directory is clean');
    } catch (error) {
      console.log('⚠️ There are uncommitted changes');
      // You might want to handle this case differently
    }
    
    console.log('✅ Git synchronization completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Git synchronization failed:', error.message);
    process.exit(1);
  }
}

// Run the sync if this file is executed directly
if (require.main === module) {
  gitSync();
}

module.exports = gitSync;
