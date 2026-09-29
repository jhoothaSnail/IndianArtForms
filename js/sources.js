// sources.js — Auto-generate deduplicated source list from JSON data (ES module)
import { fetchJSON, h } from './util.js';

const root = document.getElementById('sources-root');

async function loadSources() {
  try {
    const [timeline, locations] = await Promise.all([
      fetchJSON('data/timeline.json'),
      fetchJSON('data/locations.json')
    ]);

    /* Collect all sources keyed by URL to deduplicate */
    const byUrl = new Map();

    function collect(label, entry) {
      if (!entry.sources) return;
      for (const src of entry.sources) {
        if (!byUrl.has(src.url)) {
          byUrl.set(src.url, { label: src.label, url: src.url, usedBy: [] });
        }
        byUrl.get(src.url).usedBy.push({ section: label, title: entry.title || entry.name });
      }
    }

    for (const item of timeline)  collect('Timeline', item);
    for (const loc  of locations) collect('Map', loc);

    /* Build list grouped by first letter of label */
    const sorted = [...byUrl.values()].sort((a, b) => a.label.localeCompare(b.label));

    if (sorted.length === 0) {
      root.replaceChildren(h('p', { className: 'placeholder', textContent: 'No sources found in data files.' }));
      return;
    }

    const ul = h('ul', { className: 'source-list' });

    for (const src of sorted) {
      const usedText = src.usedBy.map(u => `${u.section}: ${u.title}`).join('; ');
      ul.appendChild(h('li', {},
        h('a', { href: src.url, target: '_blank', rel: 'noopener', textContent: src.label }),
        h('span', { className: 'source-list__used', textContent: ` \u2014 used by: ${usedText}` })
      ));
    }

    root.replaceChildren(ul);
  } catch (err) {
    console.error('Failed to load sources:', err);
    root.replaceChildren(h('p', { className: 'error', textContent: 'Could not load source data. See data/timeline.json and data/locations.json.' }));
  }
}

loadSources();
