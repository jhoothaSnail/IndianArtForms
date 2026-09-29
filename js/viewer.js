// viewer.js — Zoomable image viewer (ES module)

const SCALES = [1, 2, 3];

/**
 * Mount a zoomable image viewer into a container element.
 * Provides zoom in/out/reset buttons and pointer-event drag-to-pan.
 * @param {HTMLElement} container
 * @param {string} src
 * @param {string} alt
 * @param {number} w  — natural width
 * @param {number} h  — natural height
 */
export function createViewer(container, src, alt, w, h) {
  container.replaceChildren();
  container.classList.add('viewer');

  let zoomIdx = 0, panX = 0, panY = 0;
  let dragging = false, sx = 0, sy = 0, spx = 0, spy = 0;

  /* Image */
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.width = w;
  img.height = h;
  img.draggable = false;
  img.style.width = '100%';
  img.style.height = 'auto';
  container.appendChild(img);

  /* Lock container height once image loads so zoom doesn't resize it */
  const lockHeight = () => {
    const maxH = window.innerHeight * 0.55;
    container.style.height = Math.min(container.clientHeight, maxH) + 'px';
  };
  if (img.complete) {
    lockHeight();
  } else {
    img.addEventListener('load', lockHeight, { once: true });
  }

  /* Controls */
  const bar = document.createElement('div');
  bar.className = 'viewer__controls';

  function btn(label, text, fn) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  }

  bar.appendChild(btn('Zoom out', '\u2212', () => zoom(-1)));
  bar.appendChild(btn('Zoom in', '+', () => zoom(1)));
  bar.appendChild(btn('Reset zoom', '\u21BA', reset));
  container.appendChild(bar);

  /* Zoom / Pan helpers */
  function zoom(dir) {
    zoomIdx = Math.max(0, Math.min(SCALES.length - 1, zoomIdx + dir));
    clamp();
    apply();
  }

  function reset() { zoomIdx = 0; panX = 0; panY = 0; apply(); }

  function apply() {
    const s = SCALES[zoomIdx];
    img.style.transform = `translate(${panX}px,${panY}px) scale(${s})`;
    container.style.cursor = s > 1 ? 'grab' : 'default';
  }

  function clamp() {
    const s = SCALES[zoomIdx];
    if (s <= 1) { panX = 0; panY = 0; return; }
    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const imgH = (img.naturalHeight / img.naturalWidth) * cW * s;
    panX = Math.max(cW - cW * s, Math.min(0, panX));
    panY = Math.max(cH - imgH, Math.min(0, panY));
  }

  /* Pointer-event drag */
  container.addEventListener('pointerdown', e => {
    if (SCALES[zoomIdx] <= 1) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    spx = panX; spy = panY;
    container.setPointerCapture(e.pointerId);
    container.style.cursor = 'grabbing';
    img.style.transition = 'none';
  });

  container.addEventListener('pointermove', e => {
    if (!dragging) return;
    panX = spx + (e.clientX - sx);
    panY = spy + (e.clientY - sy);
    clamp();
    apply();
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    container.style.cursor = SCALES[zoomIdx] > 1 ? 'grab' : 'default';
    img.style.transition = '';
  };

  container.addEventListener('pointerup', endDrag);
  container.addEventListener('pointercancel', endDrag);

  apply();
}
