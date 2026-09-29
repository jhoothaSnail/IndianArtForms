// map.js — Interactive Art Map (Task 2, ES module)
import { fetchJSON, h, getHash, setHash, onHashChange } from './util.js';

/* ===== Constants ===== */
const MEDIUM_LABELS = {
  'mural': 'Mural',
  'sculpture-architecture': 'Sculpture & Architecture',
  'folk-painting': 'Folk Painting',
  'court-miniature': 'Court Miniature',
  'textile': 'Textile'
};

const MEDIUM_COLORS = {
  'mural': '#8E2A22',
  'sculpture-architecture': '#1C2B4A',
  'folk-painting': '#4E6B3A',
  'court-miniature': '#B5651D',
  'textile': '#5B6D99'
};

/* ===== State ===== */
let leafletMap, tileLayer;
let allLocations = [];
const markers = {};
const regionLayers = [];

/* ===== DOM refs ===== */
const $ = (id) => document.getElementById(id);
const loadingEl    = $('map-loading');
const errorEl      = $('map-error');
const retryBtn     = $('map-retry');
const filtersEl    = $('filters');
const resultEl     = $('result-count');
const locList      = $('loc-list');
const locDetail    = $('loc-detail');
const locClose     = $('loc-close');
const resetBtn     = $('reset-view');
const tileBanner   = $('tile-banner');
// Detail fields
const locFigure    = $('loc-figure');
const locMedium    = $('loc-medium');
const locName      = $('loc-name');
const locMeta      = $('loc-meta');
const locTabs      = $('loc-tabs');
const locSummary   = $('loc-summary');
const locContext   = $('loc-context');
const locDispute   = $('loc-dispute');
const locTimeline  = $('loc-timeline');
const locTLinks    = $('loc-timeline-links');
const locSources   = $('loc-sources');

/* ===== Map init ===== */
function initMap() {
  leafletMap = L.map('map', { center: [22.5, 79], zoom: 5, minZoom: 4, maxZoom: 18 });

  tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(leafletMap);

  let tileFails = 0;
  tileLayer.on('tileerror', () => { if (++tileFails === 5) tileBanner.hidden = false; });
}

/* ===== Data ===== */
async function loadData() {
  try {
    allLocations = await fetchJSON('data/locations.json');
    loadingEl.hidden = true;
    errorEl.hidden = true;
    render();
  } catch (err) {
    console.error('Failed to load locations:', err);
    loadingEl.hidden = true;
    errorEl.hidden = false;
  }
}

/* ===== Render ===== */
function render() {
  buildFilters();
  buildMarkers();
  buildList();

  const hash = getHash();
  if (hash) selectLocation(hash);

  onHashChange(id => { if (id) selectLocation(id); else closeDetail(); });
}

/* ===== Filters ===== */
function buildFilters() {
  const mediums = [...new Set(allLocations.map(l => l.medium))];
  for (const m of mediums) {
    filtersEl.appendChild(h('button', {
      className: 'chip',
      type: 'button',
      'aria-pressed': 'true',
      'data-medium': m,
      textContent: MEDIUM_LABELS[m] || m,
      onClick: () => toggleFilter(m)
    }));
  }
  updateCount();
}

function toggleFilter(medium) {
  const chip = filtersEl.querySelector(`[data-medium="${medium}"]`);
  const was = chip.getAttribute('aria-pressed') === 'true';
  chip.setAttribute('aria-pressed', String(!was));
  applyFilters();
  updateCount();
}

function activeFilters() {
  const out = new Set();
  filtersEl.querySelectorAll('.chip').forEach(c => {
    if (c.getAttribute('aria-pressed') === 'true') out.add(c.dataset.medium);
  });
  return out;
}

function applyFilters() {
  const active = activeFilters();
  for (const loc of allLocations) {
    const show = active.has(loc.medium);
    const m = markers[loc.id];
    if (m) { if (show) m.addTo(leafletMap); else leafletMap.removeLayer(m); }
    const li = locList.querySelector(`[data-id="${loc.id}"]`);
    if (li) li.hidden = !show;
  }
}

function updateCount() {
  const n = allLocations.filter(l => activeFilters().has(l.medium)).length;
  resultEl.textContent = `${n} of ${allLocations.length} locations`;
}

/* ===== Markers ===== */
function buildMarkers() {
  for (const loc of allLocations) {
    const color = MEDIUM_COLORS[loc.medium] || '#1C2B4A';

    const icon = L.divIcon({
      className: 'map-marker',
      html: `<span style="background:${color}"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon, title: loc.name, alt: loc.name })
      .addTo(leafletMap);

    marker.on('click', () => { selectLocation(loc.id); setHash(loc.id); });
    markers[loc.id] = marker;

    // Region polygon
    if (loc.kind === 'region' && loc.region) {
      const poly = L.polygon(loc.region, {
        color, weight: 2, opacity: 0.5, fillOpacity: 0.08, dashArray: '6, 4'
      }).addTo(leafletMap);
      poly.bindTooltip('Approximate extent', { direction: 'center', className: 'region-tip' });
      regionLayers.push(poly);
    }
  }
}

/* ===== List ===== */
function buildList() {
  for (const loc of allLocations) {
    const btn = h('button', {
      className: 'loc-item', type: 'button', 'data-id': loc.id,
      onClick: () => { selectLocation(loc.id); setHash(loc.id); }
    },
      h('span', { className: 'loc-item__name', textContent: loc.name }),
      h('span', { className: `tag tag--${loc.medium}`, textContent: MEDIUM_LABELS[loc.medium] || loc.medium })
    );
    locList.appendChild(h('li', { 'data-id': loc.id }, btn));
  }
}

/* ===== Selection ===== */
function selectLocation(id) {
  const loc = allLocations.find(l => l.id === id);
  if (!loc) return;

  // Highlight list item
  locList.querySelectorAll('.loc-item').forEach(b => b.classList.toggle('active', b.dataset.id === id));

  // Fly to marker
  leafletMap.flyTo([loc.lat, loc.lng], 8, { duration: 0.8 });

  // Fill and show detail panel
  fillDetail(loc);
  locList.hidden = true;
  filtersEl.hidden = true;
  resultEl.hidden = true;
  locDetail.hidden = false;
  locDetail.focus();

  setTimeout(() => leafletMap.invalidateSize(), 350);
}

/* ===== Detail panel ===== */
function fillDetail(loc) {
  // Tag
  locMedium.textContent = MEDIUM_LABELS[loc.medium] || loc.medium;
  locMedium.className = `tag tag--${loc.medium}`;

  // Name + meta
  locName.textContent = loc.name;
  locMeta.textContent = `${loc.state} \u00B7 ${loc.period}`;

  // Tabs or flat content
  if (loc.tabs && loc.tabs.length) {
    locTabs.replaceChildren();
    locTabs.hidden = false;

    loc.tabs.forEach((tab, i) => {
      const btn = h('button', {
        className: 'tab-btn' + (i === 0 ? ' active' : ''),
        type: 'button', role: 'tab', 'aria-selected': String(i === 0),
        textContent: tab.label,
        onClick: () => {
          locTabs.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active'); b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          locSummary.textContent = tab.summary || '';
          locContext.textContent = tab.context || '';
          locMeta.textContent = `${loc.state} \u00B7 ${tab.period || loc.period}`;
        }
      });
      locTabs.appendChild(btn);
    });

    locSummary.textContent = loc.tabs[0].summary || '';
    locContext.textContent = loc.tabs[0].context || '';
    locMeta.textContent = `${loc.state} \u00B7 ${loc.tabs[0].period || loc.period}`;
  } else {
    locTabs.hidden = true;
    locSummary.textContent = loc.summary || '';
    locContext.textContent = loc.context || '';
  }

  // Disputes
  if (loc.status === 'disputed' && loc.disputes?.length) {
    locDispute.textContent = 'Disputed: ' + loc.disputes.join('; ');
    locDispute.hidden = false;
  } else {
    locDispute.hidden = true;
  }

  // Image
  locFigure.replaceChildren();
  if (loc.image?.src) {
    locFigure.appendChild(h('img', {
      src: loc.image.src, width: String(loc.image.w), height: String(loc.image.h),
      alt: loc.image.alt || '', loading: 'lazy', decoding: 'async'
    }));
    if (loc.image.creator && loc.image.creator !== 'TODO') {
      locFigure.appendChild(h('figcaption', {
        className: 'credit', textContent: `${loc.image.creator} \u00B7 ${loc.image.license}`
      }));
    }
    locFigure.hidden = false;
  } else {
    locFigure.hidden = true;
  }

  // Timeline links
  locTLinks.replaceChildren();
  if (loc.timelineIds?.length) {
    for (const tid of loc.timelineIds) {
      locTLinks.appendChild(h('li', {},
        h('a', { href: `timeline.html#${tid}`, textContent: tid.replace(/-/g, ' ') })
      ));
    }
    locTimeline.hidden = false;
  } else {
    locTimeline.hidden = true;
  }

  // Sources
  locSources.replaceChildren();
  if (loc.sources) {
    for (const src of loc.sources) {
      locSources.appendChild(h('li', {},
        h('a', { href: src.url, target: '_blank', rel: 'noopener', textContent: src.label })
      ));
    }
  }
}

function closeDetail() {
  locDetail.hidden = true;
  locList.hidden = false;
  filtersEl.hidden = false;
  resultEl.hidden = false;
  setHash('');
  locList.querySelectorAll('.loc-item').forEach(b => b.classList.remove('active'));
}

/* ===== Reset ===== */
function resetView() {
  const active = activeFilters();
  const visible = allLocations.filter(l => active.has(l.medium)).map(l => markers[l.id]).filter(Boolean);
  if (visible.length) leafletMap.fitBounds(L.featureGroup(visible).getBounds().pad(0.1));
}

/* ===== Events ===== */
retryBtn.addEventListener('click', loadData);
locClose.addEventListener('click', closeDetail);
resetBtn.addEventListener('click', () => { closeDetail(); resetView(); });

/* ===== Init ===== */
initMap();
loadData();
