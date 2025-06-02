const fs = require('fs');
const path = require('path');

// Function to recursively get all .ts files
function getFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getFiles(fullPath, files);
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to fix imports in a file
function fixImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.dirname(filePath), process.cwd());
  
  // Replace @/db and @/db/schema imports
  let newContent = content
    .replace(/from ["']@\/db["']/g, `from "${relativePath}/src/db"`.replace(/\\/g, '/'))
    .replace(/from ["']@\/db\/schema["']/g, `from "${relativePath}/src/db/schema"`.replace(/\\/g, '/'));

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  }
}

// Get all TypeScript files in the app/api directory
const apiDir = path.join(process.cwd(), 'app', 'api');
const files = getFiles(apiDir);

// Fix imports in each file
files.forEach(fixImports); 