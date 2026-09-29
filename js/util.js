// util.js — Shared utilities (ES module)

/**
 * Fetch JSON with retry and exponential backoff.
 * @param {string} url
 * @param {number} retries — max retry attempts (default 2)
 * @returns {Promise<any>}
 */
export async function fetchJSON(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 500 * 2 ** i));
    }
  }
}

/**
 * Create a DOM element. Uses textContent, never innerHTML.
 * @param {string} tag
 * @param {Record<string, any>} attrs — className, textContent, data-*, aria-*, or event handlers (onClick, etc.)
 * @param  {...(string|Node)} children
 * @returns {HTMLElement}
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'className') el.className = v;
    else if (k === 'textContent') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  }
  return el;
}

/**
 * Get current hash without the '#'.
 * @returns {string}
 */
export function getHash() {
  return decodeURIComponent(location.hash.slice(1));
}

/**
 * Set hash without triggering a scroll.
 * @param {string} id
 */
export function setHash(id) {
  history.replaceState(null, '', id ? `#${id}` : location.pathname + location.search);
}

/**
 * Listen for hash changes.
 * @param {(id: string) => void} callback
 */
export function onHashChange(callback) {
  window.addEventListener('hashchange', () => callback(getHash()));
}
