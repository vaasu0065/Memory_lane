const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];
const extensions = ['.tsx', '.ts'];

const replacements = [
  // Text colors
  { regex: /text-white\/80/g, replacement: "text-gray-800" },
  { regex: /text-white\/70/g, replacement: "text-gray-700" },
  { regex: /text-white\/60/g, replacement: "text-gray-600" },
  { regex: /text-white\/50/g, replacement: "text-gray-500" },
  { regex: /text-white\/40/g, replacement: "text-gray-500" },
  { regex: /text-white\/30/g, replacement: "text-gray-400" },
  { regex: /text-white\/20/g, replacement: "text-gray-300" },
  { regex: /text-white\/10/g, replacement: "text-gray-200" },
  { regex: /text-white(?!\/)/g, replacement: "text-gray-900" },

  // Background colors (white-based translucents become solid white/gray)
  { regex: /bg-white\/5(?!\d)/g, replacement: "bg-white" },
  { regex: /bg-white\/10/g, replacement: "bg-white" },
  { regex: /bg-white\/20/g, replacement: "bg-white shadow-sm" },
  { regex: /bg-white\/30/g, replacement: "bg-gray-50 shadow-sm" },
  { regex: /bg-white\/40/g, replacement: "bg-gray-100 shadow-sm" },
  { regex: /hover:bg-white\/20/g, replacement: "hover:bg-gray-50" },
  { regex: /hover:bg-white\/30/g, replacement: "hover:bg-gray-100" },
  { regex: /hover:bg-white\/40/g, replacement: "hover:bg-gray-200" },
  
  // Specific button inversion (View & Edit button)
  { regex: /bg-white\/90 hover:bg-white text-black/g, replacement: "bg-black hover:bg-black/80 text-white" },

  // Borders
  { regex: /border-white\/20/g, replacement: "border-gray-200" },
  { regex: /border-white\/30/g, replacement: "border-gray-300" },
  { regex: /border-white\/40/g, replacement: "border-gray-300" },
  { regex: /border-white\/60/g, replacement: "border-gray-400" },
  { regex: /border-white(?!\/)/g, replacement: "border-gray-300" },
  
  // Black based translucents (inputs, dropzones)
  { regex: /bg-black\/40/g, replacement: "bg-gray-50" },
  { regex: /bg-black\/60/g, replacement: "bg-gray-100" },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    processDirectory(fullPath);
  }
});

console.log("Migration complete!");
