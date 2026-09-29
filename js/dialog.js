// dialog.js — Artifact modal controller (ES module)
import { h, setHash } from './util.js';
import { createViewer } from './viewer.js';

/* DOM refs (elements live in timeline.html and fusion.html) */
const dlg       = document.getElementById('artifact-dialog');
const closeBtn  = document.getElementById('dlg-close');
const mediaEl   = document.getElementById('dlg-media');
const dateEl    = document.getElementById('dlg-date');
const titleEl   = document.getElementById('dlg-title');
const placeEl   = document.getElementById('dlg-place');
const nowEl     = document.getElementById('dlg-now');
const nowRow    = nowEl ? nowEl.closest('div') : null;
const mediumEl  = document.getElementById('dlg-medium');
const sigEl     = document.getElementById('dlg-significance');
const disputeEl = document.getElementById('dlg-dispute');
const sourcesEl = document.getElementById('dlg-sources');
const creditEl  = document.getElementById('dlg-credit');
const mapLink   = document.getElementById('dlg-map-link');

let triggerEl = null;

/**
 * Open the artifact dialog and fill it with data from a timeline item.
 * @param {object} item — a timeline.json entry
 * @param {HTMLElement} [trigger] — the button that opened the dialog (for focus return)
 */
export function openArtifact(item, trigger) {
  if (!dlg) return;
  triggerEl = trigger || null;

  /* Date */
  let dateText = item.dateLabel || '';
  if (item.dateNote) dateText += ` \u2014 ${item.dateNote}`;
  dateEl.textContent = dateText;

  /* Title */
  titleEl.textContent = item.title;

  /* Facts */
  placeEl.textContent = item.place || '';
  mediumEl.textContent = item.medium || '';
  if (nowEl) nowEl.textContent = item.now || '\u2014';
  if (nowRow) nowRow.hidden = !item.now;

  /* Significance */
  sigEl.textContent = item.significance || '';

  /* Disputes */
  if (item.disputes && item.disputes.length) {
    disputeEl.textContent = 'Disputed: ' + item.disputes.join('; ');
    disputeEl.hidden = false;
  } else {
    disputeEl.hidden = true;
  }

  /* Image — use zoomable viewer */
  mediaEl.replaceChildren();
  if (item.image?.src) {
    createViewer(mediaEl, item.image.src, item.image.alt || '', item.image.w, item.image.h);
  }

  /* Image credit */
  if (item.image?.creator && item.image.creator !== 'TODO') {
    creditEl.textContent = `Image: ${item.image.creator} \u00B7 ${item.image.license}`;
    creditEl.hidden = false;
  } else {
    creditEl.hidden = true;
  }

  /* Sources */
  sourcesEl.replaceChildren();
  if (item.sources) {
    for (const src of item.sources) {
      sourcesEl.appendChild(h('li', {},
        h('a', { href: src.url, target: '_blank', rel: 'noopener', textContent: src.label })
      ));
    }
  }

  /* Map link */
  if (item.mapId) {
    mapLink.href = `map.html#${item.mapId}`;
    mapLink.hidden = false;
  } else {
    mapLink.hidden = true;
  }

  /* Open */
  dlg.showModal();
  document.body.classList.add('lock');
}

/**
 * Close the artifact dialog if open.
 */
export function closeArtifact() {
  if (dlg && dlg.open) dlg.close();
}

/* ===== Event wiring ===== */
if (dlg) {
  closeBtn.addEventListener('click', () => dlg.close());

  /* Backdrop click: the dialog element itself is the backdrop target */
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  /* On close: unlock scroll, clear hash, return focus */
  dlg.addEventListener('close', () => {
    document.body.classList.remove('lock');
    setHash('');
    if (triggerEl) { triggerEl.focus(); triggerEl = null; }
  });
}
