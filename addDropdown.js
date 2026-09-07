const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components', 'dashboard-sections');
const files = fs.readdirSync(dir).filter(f => f.endsWith('DashboardSection.tsx'));

const dropdownCode = `
          <div className="relative">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const dropdown = e.currentTarget.nextElementSibling;
                dropdown.classList.toggle('hidden');
              }}
              className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all hover:-translate-y-1"
            >
              <MoreHorizontal size={24} />
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 hidden">
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(\`\${window.location.origin}/share/\${section.id}\`);
                   alert("Share link copied to clipboard!");
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Share Template
              </button>
            </div>
          </div>
`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to replace the button:
  const buttonRegex = /<button className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all hover:-translate-y-1">\s*<MoreHorizontal size=\{24\} \/>\s*<\/button>/g;
  
  if (content.match(buttonRegex)) {
    content = content.replace(buttonRegex, dropdownCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
