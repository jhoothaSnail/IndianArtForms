const fs = require('fs');

const timelineFile = 'data/timeline.json';
const locationsFile = 'data/locations.json';

const timelineData = JSON.parse(fs.readFileSync(timelineFile, 'utf8'));
const locationsData = JSON.parse(fs.readFileSync(locationsFile, 'utf8'));

// Timeline updates
const tMeta = {
  'dancing-girl': { ext: '.jpg', creator: 'Mangostar / Ismoon', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Dancing_girl.jpg' },
  'ajanta-padmapani': { ext: '.jpg', creator: 'Ancient Indian artist', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Ajanta_Padmapani.jpg' },
  'ajanta-cave17-murals': { ext: '.jpg', creator: 'Jean-Pierre Dalbéra', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Ajanta_Cave_17_Scene_of_the_Vessantara_Jataka.jpg' },
  'brihadisvara-mural': { ext: '.jpg', creator: 'Ancient Chola artist', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Rajaraja_mural.jpg' },
  'hamzanama-folio': { ext: '.jpg', creator: 'Attributed to Basawan and Jagan', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Mahlaj_shows_his_skill_to_Zumurrud_Shah_and_runs_a_spear_through_a_tree_(From_the_Hamzanama,_Volume_11).jpg' },
  'jaipur-miniature': { ext: '.jpg', creator: '18th-century court painter', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Raslila,_18th_century_CE,_Rajasthani_School_of_Art,_City_Palace_Museum,_Jaipur.jpg' },
  'madhubani-kohbar': { ext: '.jpg', creator: 'AxomiyaDangoriya', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:34545016_kohbar_auspicious_marriage_diagram_dh93.jpg' },
  'warli-chowk': { ext: '.jpg', creator: 'Omrmankar', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Warli_painting.jpg' }
};

for (const item of timelineData) {
  if (tMeta[item.id]) {
    const meta = tMeta[item.id];
    item.image.src = item.image.src.replace('.webp', meta.ext);
    if (item.id === 'ajanta-cave17-murals') item.image.src = 'assets/img/timeline/ajanta-cave17.jpg';
    item.image.creator = meta.creator;
    item.image.license = meta.license;
    item.image.source = meta.source;
  }
}

const lMeta = {
  'ajanta': { ext: '.jpg', creator: 'Ms Sarah Welch', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Ajanta_Caves_panorama_view.jpg' },
  'ellora': { ext: '.jpg', creator: 'Ms Sarah Welch', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Kailasa_temple_overview,_Ellora.jpg' },
  'thanjavur': { ext: '.jpg', creator: 'Rainer Halama', license: 'CC BY-SA', source: 'https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_(edit).jpg' },
  'khajuraho': { ext: '.jpg', creator: 'Arun.arunb', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Kandariya_Mahadeva_Temple,_Khajuraho.jpg' },
  'madhubani': { ext: '.jpg', creator: 'Sntshkumar750', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_paintings.jpg' },
  'warli': { ext: '.jpeg', creator: 'Joy1963', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Warli_painting_in_Warli.JPG' },
  'puri': { ext: '.jpg', creator: 'Sumita Roy Dutta', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Artist_with_Odisha_Pattachitra_DSCN1052_01.jpg' },
  'jaipur': { ext: '.jpg', creator: 'Chainwit.', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:City_Palace_Jaipur_%22Peacock_Gate%22_01.jpg' }
};

for (const item of locationsData) {
  if (lMeta[item.id]) {
    const meta = lMeta[item.id];
    item.image.src = item.image.src.replace('.webp', meta.ext);
    item.image.creator = meta.creator;
    item.image.license = meta.license;
    item.image.source = meta.source;
  }
}

fs.writeFileSync(timelineFile, JSON.stringify(timelineData, null, 2));
fs.writeFileSync(locationsFile, JSON.stringify(locationsData, null, 2));
console.log('JSON files updated.');
