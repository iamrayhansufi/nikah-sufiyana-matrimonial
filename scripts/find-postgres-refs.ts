// Script to find remaining PostgreSQL references in the codebase
import fs from 'fs';
import path from 'path';

// Terms that indicate PostgreSQL usage
const pgTerms = [
  'DATABASE_URL',
  'DATABASE_URL_UNPOOLED',
  'POSTGRES_URL',
  'postgres://',
  'neon(',
  'drizzle(',
  '@neondatabase/serverless',
  'neondb_owner',
  'ep-nameless-feather',
  'drizzle-orm/pg-core'
];

// Directories to skip
const skipDirs = [
  'node_modules',
  '.git',
  '.next',
  'drizzle',
  'migrations'
];

// File extensions to check
const fileExtensions = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.md',
  '.json',
  '.env'
];

// Function to check if a file contains PostgreSQL references
function checkFileForPgRefs(filePath: string): { hasRefs: boolean; refs: string[] } {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const foundRefs: string[] = [];
    
    pgTerms.forEach(term => {
      if (content.includes(term)) {
        foundRefs.push(term);
      }
    });
    
    return { 
      hasRefs: foundRefs.length > 0, 
      refs: foundRefs 
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return { hasRefs: false, refs: [] };
  }
}

// Function to scan directories recursively
function scanDirectory(dir: string, results: any[] = []): any[] {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      
      // Skip directories in the exclude list
      if (isDirectory && skipDirs.includes(file)) {
        continue;
      }
      
      if (isDirectory) {
        // Recursively scan subdirectories
        scanDirectory(filePath, results);
      } else {
        // Check file extension
        const ext = path.extname(file);
        if (fileExtensions.includes(ext)) {
          const { hasRefs, refs } = checkFileForPgRefs(filePath);
          if (hasRefs) {
            results.push({
              file: filePath,
              references: refs
            });
          }
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
    return results;
  }
}

// Main function to scan the codebase
function scanCodebase() {
  console.log('Scanning codebase for PostgreSQL references...');
  
  const rootDir = path.resolve(__dirname, '..');
  const results = scanDirectory(rootDir);
  
  console.log(`Found ${results.length} files with PostgreSQL references:`);
  
  if (results.length > 0) {
    results.forEach(result => {
      const relativePath = path.relative(rootDir, result.file);
      console.log(`- ${relativePath}`);
      console.log(`  References: ${result.references.join(', ')}`);
    });
    
    // Output summary by file type
    const fileTypes = new Map<string, number>();
    results.forEach(result => {
      const ext = path.extname(result.file);
      fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
    });
    
    console.log('\nSummary by file type:');
    fileTypes.forEach((count, ext) => {
      console.log(`${ext}: ${count} files`);
    });
  } else {
    console.log('No PostgreSQL references found!');
  }
  
  console.log('\nTo complete the migration to Redis:');
  console.log('1. Update any remaining API routes to use the Redis database service');
  console.log('2. Remove or comment out PostgreSQL imports and configurations');
  console.log('3. Update any environment variables in deployment settings');
}

// Run the scanner
scanCodebase();
