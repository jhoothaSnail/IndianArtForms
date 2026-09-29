const fs = require('fs');
const path = require('path');

const files = [
  'js/layout.js',
  '404.html',
  'about.html',
  'fusion.html',
  'index.html',
  'map.html',
  'package.json',
  'sources.html',
  'timeline.html',
  'project-summary.md',
  'README.md'
];

files.forEach(f => {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  let original = content;
  content = content.replace(/Indian Art Explorer/gi, 'Indian Art Forms');
  content = content.replace(/CLA-I Indian Art Project/gi, 'Indian Art Forms');
  content = content.replace(/CLA-I Indian art project/gi, 'Indian Art Forms');
  content = content.replace(/CLA-I Indian art/gi, 'Indian Art Forms');
  
  if (content !== original) {
    fs.writeFileSync(p, content, 'utf8');
    console.log('Updated ' + f);
  }
});
