// fusion.js — Fusion page interactivity (Task 3, ES module)
import { createViewer } from './viewer.js';

/* ===== Hero artwork viewer dialog ===== */
const openBtn  = document.getElementById('art-open');
const dlg      = document.getElementById('art-dialog');
const closeBtn = document.getElementById('art-close');
const viewerEl = document.getElementById('art-viewer');

function openArtViewer() {
  if (!openBtn || !dlg) return;

  const img = openBtn.querySelector('img');
  if (!img) return;

  createViewer(
    viewerEl,
    img.currentSrc || img.src,
    img.alt,
    img.naturalWidth  || parseInt(img.width, 10),
    img.naturalHeight || parseInt(img.height, 10)
  );

  dlg.showModal();
  document.body.classList.add('lock');
}

function closeArtViewer() {
  if (dlg && dlg.open) dlg.close();
}

/* Wiring — only when the hero image button is present (post artwork-freeze) */
if (openBtn) {
  openBtn.addEventListener('click', openArtViewer);
}

if (dlg) {
  closeBtn.addEventListener('click', closeArtViewer);
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    document.body.classList.remove('lock');
    if (openBtn) openBtn.focus();
  });
}

/* ===== Smooth scroll for in-page section links ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== Scroll reveal (respects prefers-reduced-motion) ===== */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sections = document.querySelectorAll('.section');
  if (sections.length) {
    const obs = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    sections.forEach(s => { s.classList.add('reveal'); obs.observe(s); });
  }
}
