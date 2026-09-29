const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/timeline.json', 'utf8'));
data.forEach(item => {
  if (item.image) {
    console.log(item.id + ' -> ' + item.image.w + 'x' + item.image.h + ' (Ratio: ' + (item.image.w/item.image.h).toFixed(2) + ')');
  }
});
