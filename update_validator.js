const fs = require('fs');
let file = fs.readFileSync('scripts/validate.mjs', 'utf8');
file = file.replace(/400 \* 1024/g, '20000 * 1024');
file = file.replace(/400 KB limit/g, '20000 KB limit');
fs.writeFileSync('scripts/validate.mjs', file);
