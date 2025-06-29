// Script to update heights in the browse page
// Run this script to replace h-72 with h-60 for all profile cards

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'page.tsx');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  // Replace all grid h-72 with h-60
  const result = data.replace(/viewMode === "grid" \? "h-72"/g, 'viewMode === "grid" ? "h-60"');
  
  fs.writeFile(filePath, result, 'utf8', err => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully updated all card heights from h-72 to h-60');
  });
});
