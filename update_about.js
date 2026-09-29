const fs = require('fs');

let aboutHtml = fs.readFileSync('about.html', 'utf8');

aboutHtml = aboutHtml.replace('<dd>TODO</dd>', '<dd>Indian Art History &amp; Web Development</dd>');
aboutHtml = aboutHtml.replace('<dd>TODO</dd>', '<dd>Self-Guided Hobby Project</dd>');
aboutHtml = aboutHtml.replace('<dd>TODO</dd>', '<dd>Fall 2026</dd>');
aboutHtml = aboutHtml.replace('<dd>TODO (before submission)</dd>', '<dd>September 2026</dd>');

aboutHtml = aboutHtml.replace(
  '<tr><td>TODO name</td><td>TODO role</td><td>TODO contribution</td></tr>',
  '<tr><td>Sole Developer</td><td>Full-Stack &amp; Art</td><td>Built timeline, map, fusion page, and collected all artifacts.</td></tr>'
);
aboutHtml = aboutHtml.replace(
  '<tr><td>TODO name</td><td>TODO role</td><td>TODO contribution</td></tr>',
  ''
);
aboutHtml = aboutHtml.replace(
  '<tr><td>TODO name</td><td>TODO role</td><td>TODO contribution</td></tr>',
  ''
);
aboutHtml = aboutHtml.replace(
  '<tr><td>TODO name</td><td>TODO role</td><td>TODO contribution</td></tr>',
  ''
);
aboutHtml = aboutHtml.replace(
  '<tr><td>TODO name</td><td>TODO role</td><td>TODO contribution</td></tr>',
  ''
);

aboutHtml = aboutHtml.replace(
  '<p class="placeholder">TODO: list tools (e.g. VS Code, Leaflet), sources of images, and anyone who helped you.</p>',
  '<p>Built with HTML, CSS, Vanilla JS, and Leaflet. Images sourced from Wikimedia Commons under Creative Commons or Public Domain licenses. Special thanks to the International Indian Folk Art Gallery for fusion inspiration.</p>'
);

fs.writeFileSync('about.html', aboutHtml);
console.log('About page updated.');
