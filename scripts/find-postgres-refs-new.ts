// Script to find and list files with PostgreSQL/Drizzle/Neon references
import { readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Define types for results
interface PostgresReferences {
  apiRoutes: string[];
  libFiles: string[];
  schemaFiles: string[];
  scriptFiles: string[];
  otherFiles: string[];
}

// PostgreSQL and Drizzle related terms to search for
const terms = [
  '@neondatabase/serverless',
  'drizzle-orm',
  'drizzle-kit',
  'schema.users',
  'schema.interests',
  'schema.shortlist',
  'schema.notifications',
  'schema.verificationCodes',
  'postgresql',
  'postgres://',
  'neon(',
  'neon`',
  'drizzle(',
  'db.query',
  'db.insert',
  'db.update',
  'db.delete',
  'migrate.ts',
  'migrate-to-redis.ts'
];

async function findFilesWithPostgresReferences(): Promise<PostgresReferences> {
  console.log('Searching for files with PostgreSQL references...');
  
  const results: PostgresReferences = {
    apiRoutes: [],
    libFiles: [],
    schemaFiles: [],
    scriptFiles: [],
    otherFiles: []
  };
  
  for (const term of terms) {
    try {
      // Use git grep for faster searching
      const { stdout } = await execAsync(`git grep -l "${term}" -- "*.ts" "*.js" "*.tsx" "*.jsx"`);
      const files = stdout.trim().split('\n').filter(Boolean);
      
      for (const file of files) {
        const relativePath = file;
        
        // Categorize files
        if (relativePath.startsWith('app/api/')) {
          if (!results.apiRoutes.includes(relativePath)) {
            results.apiRoutes.push(relativePath);
          }
        } else if (relativePath.startsWith('lib/')) {
          if (!results.libFiles.includes(relativePath)) {
            results.libFiles.push(relativePath);
          }
        } else if (relativePath.startsWith('src/db/')) {
          if (!results.schemaFiles.includes(relativePath)) {
            results.schemaFiles.push(relativePath);
          }
        } else if (relativePath.startsWith('scripts/')) {
          if (!results.scriptFiles.includes(relativePath)) {
            results.scriptFiles.push(relativePath);
          }
        } else {
          if (!results.otherFiles.includes(relativePath)) {
            results.otherFiles.push(relativePath);
          }
        }
      }
    } catch (error) {
      // If git grep fails or there are no matches, continue
      continue;
    }
  }
  
  return results;
}

async function generateReport() {
  const references = await findFilesWithPostgresReferences();
  
  let report = `# PostgreSQL References Report\n\n`;
  report += `Generated on ${new Date().toISOString()}\n\n`;
  
  report += `## API Routes with PostgreSQL References\n\n`;
  if (references.apiRoutes.length > 0) {
    references.apiRoutes.forEach(file => {
      report += `- \`${file}\`\n`;
    });
  } else {
    report += `No API routes with PostgreSQL references found.\n`;
  }
  
  report += `\n## Library Files with PostgreSQL References\n\n`;
  if (references.libFiles.length > 0) {
    references.libFiles.forEach(file => {
      report += `- \`${file}\`\n`;
    });
  } else {
    report += `No library files with PostgreSQL references found.\n`;
  }
  
  report += `\n## Schema Files (To Be Archived)\n\n`;
  if (references.schemaFiles.length > 0) {
    references.schemaFiles.forEach(file => {
      report += `- \`${file}\`\n`;
    });
  } else {
    report += `No schema files found.\n`;
  }
  
  report += `\n## Script Files with PostgreSQL References\n\n`;
  if (references.scriptFiles.length > 0) {
    references.scriptFiles.forEach(file => {
      report += `- \`${file}\`\n`;
    });
  } else {
    report += `No script files with PostgreSQL references found.\n`;
  }
  
  report += `\n## Other Files with PostgreSQL References\n\n`;
  if (references.otherFiles.length > 0) {
    references.otherFiles.forEach(file => {
      report += `- \`${file}\`\n`;
    });
  } else {
    report += `No other files with PostgreSQL references found.\n`;
  }
  
  report += `\n## Cleanup Recommendations\n\n`;
  report += `1. Update API routes to use Redis client\n`;
  report += `2. Update or remove unused library files\n`;
  report += `3. Archive schema files for reference\n`;
  report += `4. Update or remove script files that reference PostgreSQL\n`;
  report += `5. Review other files with PostgreSQL references\n`;
  
  // Write report to file
  writeFileSync('POSTGRES_REFERENCES_REPORT.md', report);
  console.log('Report generated: POSTGRES_REFERENCES_REPORT.md');
}

generateReport().catch(error => {
  console.error('Error generating report:', error);
  process.exit(1);
});
