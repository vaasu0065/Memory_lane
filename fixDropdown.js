const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components', 'dashboard-sections');
const files = fs.readdirSync(dir).filter(f => f.endsWith('DashboardSection.tsx'));

const brokenCodeRegex = /const dropdown = e\.currentTarget\.nextElementSibling;\s*dropdown\.classList\.toggle\('hidden'\);/g;
const fixedCode = `const dropdown = e.currentTarget.nextElementSibling;
                if (dropdown) dropdown.classList.toggle('hidden');`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.match(brokenCodeRegex)) {
    content = content.replace(brokenCodeRegex, fixedCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed TypeScript error in ' + file);
  }
});
