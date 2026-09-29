// timeline.js — Interactive Timeline (Task 1, ES module)
import { fetchJSON, h, getHash, setHash, onHashChange } from './util.js';
import { openArtifact, closeArtifact } from './dialog.js';

/* ===== Constants ===== */
const ERA_LABELS = {
  indus: 'Indus Valley',
  ajanta: 'Ajanta Caves',
  chola: 'Chola',
  mughal: 'Mughal',
  madhubani: 'Madhubani',
  warli: 'Warli'
};
const ERA_ORDER = ['indus', 'ajanta', 'chola', 'mughal', 'madhubani', 'warli'];

/* ===== State ===== */
let allItems = [];

/* ===== DOM refs ===== */
const $ = id => document.getElementById(id);
const loadingEl   = $('timeline-loading');
const errorEl     = $('timeline-error');
const eraRailList = $('era-rail-list');
const trackDated  = $('track-dated');
const trackLiving = $('track-living');
const spineDated  = $('spine-dated');
const spineLiving = $('spine-living');

/* ===== Data ===== */
async function loadData() {
  try {
    allItems = await fetchJSON('data/timeline.json');
    allItems.sort((a, b) => a.order - b.order);
    loadingEl.hidden = true;
    errorEl.hidden = true;
    render();
  } catch (err) {
    console.error('Failed to load timeline:', err);
    loadingEl.hidden = true;
    errorEl.hidden = false;
  }
}

/* ===== Render ===== */
function render() {
  buildEraRail();
  buildCards();
  setupScrollSpy();
  setupReveal();

  const hash = getHash();
  if (hash) openById(hash);

  onHashChange(id => { if (id) openById(id); else closeArtifact(); });
}

/* ===== Era rail (sticky nav) ===== */
function buildEraRail() {
  const usedEras = [...new Set(allItems.map(i => i.era))];
  const ordered = ERA_ORDER.filter(e => usedEras.includes(e));

  for (const era of ordered) {
    eraRailList.appendChild(h('li', {},
      h('a', {
        href: `#era-${era}`,
        className: 'era-link',
        'data-era': era,
        textContent: ERA_LABELS[era] || era
      })
    ));
  }
}

/* ===== Cards ===== */
function buildCards() {
  const dated = allItems.filter(i => i.track === 'dated');
  const living = allItems.filter(i => i.track === 'living');

  if (dated.length) { renderTrack(dated, spineDated); trackDated.hidden = false; }
  if (living.length) { renderTrack(living, spineLiving); trackLiving.hidden = false; }
}

function renderTrack(items, container) {
  let currentEra = null;
  let cardIdx = 0;

  for (const item of items) {
    /* Era section header */
    if (item.era !== currentEra) {
      currentEra = item.era;
      container.appendChild(h('li', {
        className: 'era-section', id: `era-${item.era}`, 'data-era': item.era
      }, h('h3', { className: 'era-label', textContent: ERA_LABELS[item.era] || item.era })));
    }

    /* Card */
    const side = cardIdx % 2 === 0 ? 'left' : 'right';
    container.appendChild(h('li', {
      className: `spine__item spine__item--${side} reveal`, 'data-era': item.era
    }, buildCard(item)));

    cardIdx++;
  }
}

function buildCard(item) {
  const kids = [];

  /* Image */
  if (item.image?.src) {
    const imgEl = h('img', {
      className: 'card__img card__open-img',
      src: item.image.src,
      width: String(item.image.w),
      height: String(item.image.h),
      alt: item.image.alt || '',
      loading: 'lazy',
      decoding: 'async',
      role: 'button',
      tabIndex: '0',
      'data-id': item.id,
      onClick: e => { openArtifact(item, e.currentTarget); setHash(item.id); },
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openArtifact(item, e.currentTarget);
          setHash(item.id);
        }
      }
    });
    kids.push(h('div', { className: 'card__img-wrap' }, imgEl));
  }

  /* Body */
  kids.push(h('div', { className: 'card__body' },
    h('p', { className: 'card__meta', textContent: item.dateLabel }),
    h('h4', { className: 'card__title', textContent: item.title }),
    h('p', { className: 'card__meta', textContent: item.place || '' }),
    h('p', { className: 'card__summary', textContent: item.summary })
  ));

  return h('article', { className: 'card' }, ...kids);
}

/* ===== Deep link ===== */
function openById(id) {
  const item = allItems.find(i => i.id === id);
  if (!item) return;
  const btn = document.querySelector(`[data-id="${id}"]`);
  openArtifact(item, btn);
}

/* ===== Scroll spy ===== */
function setupScrollSpy() {
  const sections = document.querySelectorAll('.era-section');
  if (!sections.length) return;

  let current = null;

  const obs = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const era = entry.target.dataset.era;
      if (era && era !== current) {
        current = era;
        eraRailList.querySelectorAll('.era-link').forEach(link => {
          const active = link.dataset.era === era;
          link.classList.toggle('active', active);
          link.setAttribute('aria-current', active ? 'true' : 'false');
        });
      }
    }
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ===== Scroll reveal ===== */
function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  items.forEach(el => obs.observe(el));
}

/* ===== Init ===== */
loadData();
