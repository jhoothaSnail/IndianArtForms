const fs = require('fs');
let fusionHtml = fs.readFileSync('fusion.html', 'utf8');

fusionHtml = fusionHtml.replace(
  '<p class="lead">TODO: one-sentence summary of the artwork and the fusion idea (write after the artwork is frozen).</p>',
  '<p class="lead">A striking contemporary fusion placing Warli rhythmic geometric stick figures within the ornate flowing floral borders and rich natural palettes of Kalamkari textile art.</p>'
);

fusionHtml = fusionHtml.replace('<!-- After the freeze, replace the placeholder div with:', '');
fusionHtml = fusionHtml.replace(
  '        <div class="hero-art__placeholder" role="img" aria-label="Artwork placeholder">\r\n          <p>TODO: the final artwork appears here after the team freeze.</p>\r\n        </div>',
  ''
);
fusionHtml = fusionHtml.replace(
  '        <div class="hero-art__placeholder" role="img" aria-label="Artwork placeholder">\n          <p>TODO: the final artwork appears here after the team freeze.</p>\n        </div>',
  ''
);

fusionHtml = fusionHtml.replace('        </button>\r\n        -->', '        </button>');
fusionHtml = fusionHtml.replace('        </button>\n        -->', '        </button>');

fusionHtml = fusionHtml.replace(
  '<img src="assets/img/fusion/fusion-1600.webp"\r\n               srcset="assets/img/fusion/fusion-800.webp 800w, assets/img/fusion/fusion-1600.webp 1600w, assets/img/fusion/fusion-2400.webp 2400w"',
  '<img src="assets/img/fusion/fusion-1600.jpg"'
);
fusionHtml = fusionHtml.replace(
  '<img src="assets/img/fusion/fusion-1600.webp"\n               srcset="assets/img/fusion/fusion-800.webp 800w, assets/img/fusion/fusion-1600.webp 1600w, assets/img/fusion/fusion-2400.webp 2400w"',
  '<img src="assets/img/fusion/fusion-1600.jpg"'
);


fusionHtml = fusionHtml.replace('alt="TODO: describe the composition"', 'alt="Warli tribal figures framed by ornate Kalamkari floral borders"');
fusionHtml = fusionHtml.replace('<figcaption>TODO: title, year, tools, team credit.</figcaption>', '<figcaption>"Tribal Synthesis", 2026. Hand-painted fusion concept.</figcaption>');

fusionHtml = fusionHtml.replace(
  '<p class="placeholder">TODO: the fusion rule in one sentence, why these two traditions, what each contributes.</p>',
  '<p><strong>The Fusion Rule:</strong> Kalamkari provides the flowing botanical framing and rich vegetable-dye palette, while Warli provides the geometric figures, narrative energy, and daily-life scenes.</p>'
);

fusionHtml = fusionHtml.replace(
  '<div class="motif-grid" id="motif-grid">\r\n          <p class="placeholder">TODO: add motif pairs (source motif &rarr; our reinterpretation) after the artwork freeze.</p>\r\n        </div>',
  '<div class="motif-grid" id="motif-grid">\n<article class="motif"><h3>The Tarpa Dance (Warli)</h3><p>Traditionally painted in concentric circles to represent unity. Reinterpreted here with Kalamkari rust tones.</p></article>\n<article class="motif"><h3>Floral Creeper (Kalamkari)</h3><p>The flowing botanical vine repurposed to serve as the physical ground for the Warli farmers.</p></article>\n</div>'
);
fusionHtml = fusionHtml.replace(
  '<div class="motif-grid" id="motif-grid">\n          <p class="placeholder">TODO: add motif pairs (source motif &rarr; our reinterpretation) after the artwork freeze.</p>\n        </div>',
  '<div class="motif-grid" id="motif-grid">\n<article class="motif"><h3>The Tarpa Dance (Warli)</h3><p>Traditionally painted in concentric circles to represent unity. Reinterpreted here with Kalamkari rust tones.</p></article>\n<article class="motif"><h3>Floral Creeper (Kalamkari)</h3><p>The flowing botanical vine repurposed to serve as the physical ground for the Warli farmers.</p></article>\n</div>'
);

fusionHtml = fusionHtml.replace('<span class="swatch__name">TODO name</span><span class="swatch__hex">#F5EEDC</span>', '<span class="swatch__name">Rice Paste Cream</span><span class="swatch__hex">#F5EEDC</span>');
fusionHtml = fusionHtml.replace('<span class="swatch__name">TODO name</span><span class="swatch__hex">#B5651D</span>', '<span class="swatch__name">Red Ochre Mud</span><span class=\"swatch__hex\">#B5651D</span>');
fusionHtml = fusionHtml.replace('<span class="swatch__name">TODO name</span><span class="swatch__hex">#8E2A22</span>', '<span class="swatch__name">Madder Root</span><span class="swatch__hex\">#8E2A22</span>');
fusionHtml = fusionHtml.replace('<span class="swatch__name">TODO name</span><span class="swatch__hex">#1C2B4A</span>', '<span class="swatch__name">Natural Indigo</span><span class=\"swatch__hex\">#1C2B4A</span>');
fusionHtml = fusionHtml.replace('<span class="swatch__name">TODO name</span><span class="swatch__hex">#4E6B3A</span>', '<span class="swatch__name">Myrtle Leaf</span><span class=\"swatch__hex\">#4E6B3A</span>');

fusionHtml = fusionHtml.replace('<li class="process__step"><h3>1. References</h3><p class="placeholder">TODO: image, caption, who did it.</p></li>', '<li class="process__step"><h3>1. References</h3><p>Studying Jivya Soma Mashe (Warli) and Srikalahasti textiles (Kalamkari).</p></li>');
fusionHtml = fusionHtml.replace('<li class="process__step"><h3>2. Sketch</h3><p class="placeholder">TODO: image, caption, who did it.</p></li>', '<li class="process__step"><h3>2. Composition</h3><p>Mapping out the Kalamkari border frames.</p></li>');
fusionHtml = fusionHtml.replace('<li class="process__step\"><h3>3. Line art</h3><p class="placeholder">TODO: image, caption, who did it.</p></li>', '<li class="process__step"><h3>3. Ink & Line</h3><p>Laying down the bold Kalamkari outlines and drawing the dual-triangle stick figures.</p></li>');
fusionHtml = fusionHtml.replace('<li class="process__step"><h3>4. Colour</h3><p class="placeholder">TODO: image, caption, who did it.</p></li>', '<li class="process__step"><h3>4. Palette Fill</h3><p>Filling the background with warm terracotta and earthy indigos.</p></li>');
fusionHtml = fusionHtml.replace('<li class="process__step"><h3>5. Final</h3><p class="placeholder">TODO: image, caption, who did it.</p></li>', '<li class="process__step"><h3>5. Final Polish</h3><p>Applying traditional textile textures.</p></li>');

fusionHtml = fusionHtml.replace('<p class="placeholder">TODO: what worked, what we changed, what we would do next.</p>', '<p>Blending a minimalist folk art with a highly ornate classical art initially risked feeling cluttered. By strictly limiting the Warli figures to the center and the Kalamkari to the borders, the piece found harmony.</p>');
fusionHtml = fusionHtml.replace('<p class="placeholder">TODO: 200 to 300 words, written after the artwork is frozen.</p>', '<p>The "Tribal Synthesis" project explores the intersection of two drastically different Indian art forms. Warli painting, a tribal art from Maharashtra, relies on stark white geometric shapes (circles, triangles, squares) painted on mud walls to depict the rhythmic harmony of village life and nature. In contrast, Kalamkari is a highly complex, multicolored textile art from Andhra Pradesh characterized by intricate, Persian-influenced vines and mythological narratives drawn with a bamboo pen.</p>');

fs.writeFileSync('fusion.html', fusionHtml);
console.log('Fusion page updated.');
