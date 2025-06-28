// A script to update the height values in the browse page
// Run with Node.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'browse', 'page.tsx');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Update the height values from h-80 to h-72 for the grid view
  // This change makes the cards slightly shorter to fit four in a row
  const updatedContent = data.replace(/viewMode === "grid" \? "h-80" : "h-40"/g, 'viewMode === "grid" ? "h-72" : "h-40"');

  fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully updated heights in browse page');
  });
});
