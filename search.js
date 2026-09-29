const https = require('https');
https.get('https://commons.wikimedia.org/w/api.php?action=query&titles=File:Madhubani_Painting.jpg&prop=imageinfo&iiprop=url|extmetadata&format=json', {
  headers: { 'User-Agent': 'IndianArtProject/1.0' }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const data = JSON.parse(body);
    Object.values(data.query.pages).forEach(p => {
      if (!p.imageinfo) return;
      const info = p.imageinfo[0];
      console.log('Title: ' + p.title);
      console.log('URL: ' + info.url);
      console.log('Artist: ' + (info.extmetadata.Artist ? info.extmetadata.Artist.value.replace(/<[^>]+>/g, '') : 'Unknown'));
      console.log('License: ' + (info.extmetadata.LicenseShortName ? info.extmetadata.LicenseShortName.value : 'Unknown'));
    });
  });
});
