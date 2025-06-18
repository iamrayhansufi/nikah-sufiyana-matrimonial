// Post-fix script to restore role column functionality after database migration
// Run this after ensuring the role column exists in the database

const fs = require('fs');
const path = require('path');

async function restoreRoleColumn() {
  console.log("🔧 Restoring role column functionality in auth-options.ts...");
  
  const authOptionsPath = path.join(__dirname, 'lib', 'auth-options.ts');
  
  try {
    let content = fs.readFileSync(authOptionsPath, 'utf8');
    
    // Restore the select query to include all columns
    content = content.replace(
      /\/\/ Select specific columns to avoid role column issue until database is updated[\s\S]*?};/,
      '// Database query restored to select all columns including role'
    );
    
    content = content.replace(
      /const selectColumns = {[\s\S]*?};[\s\S]*?userArr = await db\.select\(selectColumns\)/g,
      'userArr = await db.select()'
    );
    
    // Restore role usage
    content = content.replace(
      /const userRole = 'user'; \/\/ user\.role \|\| 'user'; \/\/ Commented out until role column exists in DB/,
      'const userRole = user.role || \'user\';'
    );
    
    content = content.replace(
      /role: 'user', \/\/ user\.role \|\| 'user', \/\/ Default to user until role column exists/,
      'role: user.role || \'user\','
    );
    
    fs.writeFileSync(authOptionsPath, content);
    console.log("✅ Role column functionality restored!");
    
  } catch (error) {
    console.error("❌ Error restoring role column functionality:", error);
  }
}

restoreRoleColumn();
