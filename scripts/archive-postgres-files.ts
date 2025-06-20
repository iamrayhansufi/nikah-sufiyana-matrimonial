/**
 * This script archives or removes PostgreSQL-related files
 * that are no longer needed after migrating to Redis.
 */

import fs from 'fs';
import path from 'path';

// Define paths
const rootDir = process.cwd();
const archiveDir = path.join(rootDir, 'archive', 'postgres');

// Files and directories to archive
const filesToArchive = [
  // Schema files
  'src/db/index.ts',
  'src/db/migrate.ts',
  'src/db/schema.ts',
  
  // Library files
  'lib/database.ts',
  'lib/database-new.ts',
  'lib/verification.ts',
  'lib/auth-options.ts', // Keeping redis version
  
  // Config files
  'drizzle.config.ts',
  
  // Script files
  'scripts/migrate.ts',
  'scripts/check-db.ts',
  'scripts/add-occupation-columns.ts',
  'scripts/add-profile-photos-column.ts',
  'scripts/security-check.ts',
  'scripts/insert-admin-user.js',
  'scripts/rotate-credentials.js',
  'scripts/generate-credentials.js',
  
  // Drizzle migration files
  ...fs.readdirSync(path.join(rootDir, 'drizzle'))
    .filter(file => !file.startsWith('.'))
    .map(file => `drizzle/${file}`)
];

// Create archive directory if it doesn't exist
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
  console.log(`📁 Created archive directory: ${archiveDir}`);
}

// Archive function
function archiveFile(filePath: string): void {
  const fullPath = path.join(rootDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  const archivePath = path.join(archiveDir, filePath);
  const archiveParentDir = path.dirname(archivePath);
  
  // Create parent directory if it doesn't exist
  if (!fs.existsSync(archiveParentDir)) {
    fs.mkdirSync(archiveParentDir, { recursive: true });
  }
  
  try {
    // Copy file to archive
    fs.copyFileSync(fullPath, archivePath);
    console.log(`📋 Archived: ${filePath}`);
    
    // Delete original file
    fs.unlinkSync(fullPath);
    console.log(`🗑️ Removed: ${filePath}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error archiving ${filePath}:`, errorMessage);
  }
}

// Main execution
console.log('🔶 Starting PostgreSQL file archiving process');

filesToArchive.forEach(filePath => {
  archiveFile(filePath);
});

// Create a summary file
const summaryContent = `# PostgreSQL Files Archive

This directory contains PostgreSQL-related files that were archived during the migration to Redis.
These files are kept for reference purposes but are no longer used in the application.

## Archived Files

${filesToArchive.map(file => `- ${file}`).join('\n')}

## Archive Date

${new Date().toISOString()}
`;

fs.writeFileSync(path.join(archiveDir, 'README.md'), summaryContent);
console.log('📝 Created archive summary file');

console.log('✅ PostgreSQL file archiving completed!');
