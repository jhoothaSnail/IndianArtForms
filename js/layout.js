// layout.js — Injects header and footer, marks active nav link (ES module)

const PAGES = [
  { href: 'index.html', label: 'Home' },
  { href: 'timeline.html', label: 'Timeline' },
  { href: 'map.html', label: 'Map' },
  { href: 'fusion.html', label: 'Fusion' },
  { href: 'sources.html', label: 'Sources' },
  { href: 'about.html', label: 'About' },
];

function currentPage() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file === '' ? 'index.html' : file;
}

function buildHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const current = currentPage();

  const inner = document.createElement('div');
  inner.className = 'site-header__inner';

  // Logo
  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'site-header__logo';
  logo.textContent = 'Indian Art Forms';
  inner.appendChild(logo);

  // Mobile toggle (hamburger SVG)
  const toggle = document.createElement('button');
  toggle.className = 'site-header__toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  inner.appendChild(toggle);

  // Nav
  const nav = document.createElement('nav');
  nav.className = 'site-header__nav';
  nav.setAttribute('aria-label', 'Main');

  const ul = document.createElement('ul');
  for (const page of PAGES) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = page.href;
    a.textContent = page.label;
    if (page.href === current) a.setAttribute('aria-current', 'page');
    li.appendChild(a);
    ul.appendChild(li);
  }
  nav.appendChild(ul);
  inner.appendChild(nav);
  header.appendChild(inner);

  // Toggle handler
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.focus();
    }
  });
}

function buildFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const wrap = document.createElement('div');
  wrap.className = 'container';

  const p = document.createElement('p');
  const year = new Date().getFullYear();

  p.appendChild(document.createTextNode(`Indian Art Forms \u00A9 ${year} \u00B7 `));

  const srcLink = document.createElement('a');
  srcLink.href = 'sources.html';
  srcLink.textContent = 'Sources & credits';
  p.appendChild(srcLink);

  p.appendChild(document.createTextNode(' \u00B7 '));

  const aboutLink = document.createElement('a');
  aboutLink.href = 'about.html';
  aboutLink.textContent = 'About';
  p.appendChild(aboutLink);

  wrap.appendChild(p);
  footer.appendChild(wrap);
}

buildHeader();
buildFooter();
