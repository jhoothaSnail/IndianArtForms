const fs = require('fs');
const file = 'data/locations.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));
const item = data.find(l => l.id === 'madhubani');
item.image.creator = 'Bhuvana Meenakshi';
item.image.license = 'CC BY-SA 3.0';
item.image.source = 'https://commons.wikimedia.org/wiki/File:Madhubani_painting_by_Bhuvana_Meenakshi.jpg';
fs.writeFileSync(file, JSON.stringify(data, null, 2));
