# Indian Art Forms — Project Status

## ✅ Done (all code complete)

### Foundation
- **Design system**: `tokens.css` (7 palette colours, fluid type scale, spacing, shadows, transitions), `base.css` (reset, typography, focus rings, scroll-reveal with `prefers-reduced-motion` guard), `components.css` (buttons, sticky header + mobile hamburger, footer, cards, filter chips, native `<dialog>`, tags with 5 medium-specific colours, dispute badge, viewer, loading/error states, banner)
- **Shared JS**: `util.js` (`fetchJSON` with retry + exponential backoff, `h()` DOM builder using `textContent` only, hash read/write/listen), `layout.js` (header/footer injection, nav with `aria-current`, hamburger menu with Escape-close)

### Data (8 artifacts + 8 locations)
- **`timeline.json`**: 8 artifacts across 6 eras — Dancing Girl (Indus), Padmapani + Cave 17 (Ajanta), Brihadisvara mural (Chola), Hamzanama + Jaipur miniature (Mughal), Kohbar painting (Madhubani), Warli chowk (Warli). Every fact sourced from README Section 17. Summaries ≤25 words, significances ≤130 words.
- **`locations.json`**: 8 locations — Ajanta, Ellora, Thanjavur (2 tabs: Chola murals vs Thanjavur painting), Khajuraho, Madhubani (region polygon), Warli (region polygon), Puri/Raghurajpur, Jaipur. 4 verified coordinates from README; all within India bbox.
- **`validate.mjs`**: 7-rule validator — required fields, unique kebab IDs, ≥1 source with URL, disputed status consistency, image metadata (flags TODO), coordinate bbox (lat 6–37, lng 68–98), word limits, file existence/size, cross-refs (mapId ↔ timelineIds). `--skip-images` flag for dev.

### Map (Task 2)
- **Leaflet 1.9.4** vendored in `vendor/leaflet/` (JS + CSS + marker images)
- **`map.js`**: OSM tiles with 5-failure banner, `divIcon` markers coloured by medium, region polygons for Warli/Madhubani with dashed outline, sidebar location list, detail panel with Thanjavur tab support, `aria-pressed` filter chips, `flyTo` animation, `invalidateSize()` after layout shifts, hash deep links (`map.html#ajanta`), reset view with `fitBounds`
- **`map.css`**: 380px sidebar + map grid on desktop, stacked (map-on-top) on mobile ≤599px, marker hover scale, active list highlight, tab buttons

### Timeline (Task 1)
- **`timeline.js`**: Loads + sorts by `order` (never by date), groups into dated/living tracks, builds sticky era rail, renders alternating left/right cards, `IntersectionObserver` scroll-spy highlights active era, scroll-reveal animation, hash deep links open artifact modal
- **`dialog.js`**: Fills native `<dialog>` with artifact data (date, title, place, medium, significance, disputes, sources, map link), zoomable image via viewer, body scroll lock, backdrop click close, focus return to trigger
- **`viewer.js`**: 3 zoom levels (1×/2×/3×) with +/−/reset buttons, pointer-event drag-to-pan, pan clamping, container height lock
- **`timeline.css`**: Sticky era rail with pill links, centre spine line on desktop ≥900px, alternating 44% cards, era section pill labels, legend dots

### Fusion (Task 3)
- **`fusion.js`**: Hero artwork viewer dialog (activates post artwork-freeze when `#art-open` button exists), smooth-scroll for in-page anchors, scroll-reveal for sections
- **`fusion.css`**: Hero placeholder (dashed border) + post-freeze zoom-in button, comparison table with sticky header + hover rows, responsive motif grid (auto-fill 260px), 72px palette swatches, process gallery with vertical connector line + dots

### Sources & remaining pages
- **`sources.js`**: Fetches both JSONs, deduplicates sources by URL, renders alphabetical list with "used by" annotations into `#sources-root`
- **Home** (`index.html`): Hero, three-door cards, how-to steps, about section — fully wired, no JS needed
- **About** (`about.html`): Course facts DL, team table, methodology, acknowledgements — structure complete, content is TODO
- **404** (`404.html`): Configurable `BASE` path, back link

### QA
- **Zero 0-byte files** remaining in css/js/scripts
- **All cross-page links valid** (7 HTML pages verified)
- **Validator passes** with `--skip-images` (only 48 image TODO errors — expected)

---

## 🔲 Team needs to finish

| Task | Where | Details |
|---|---|---|
| **Source images** | Both JSONs + `assets/img/` | Find CC-licensed images on Wikimedia Commons for all 8 timeline artifacts + 8 map locations. Place `.webp` files in `assets/img/timeline/` and `assets/img/map/`. Update `creator`, `license`, `source` fields in both JSONs (currently "TODO"). |
| **Fusion artwork** | `fusion.html` | After artwork freeze: uncomment the `<button class="hero-art__open">` block (lines 34–38), remove placeholder div, fill `figcaption`, add motif `<article>` entries in the motif grid, name the 5 palette swatches, add process step images + captions, write concept/reflection/description sections. |
| **About page content** | `about.html` | Fill: Course name, Faculty name, Semester, Submission date, 5 team member rows (Name/Role/What they did), Acknowledgements. |
| **404 base path** | `404.html` line 14 | Change `BASE = '/REPO_NAME/'` to your actual GitHub repo name. |
| **Fonts** | `assets/fonts/` + `tokens.css` | Download Fraunces variable WOFF2, place in `assets/fonts/`, add `@font-face` rule to `tokens.css`, update `--font-display` variable. |
| **Run validator** | Terminal | `npm run validate` (full check) or `node scripts/validate.mjs --skip-images` (skip file checks). Fix all errors before submission. |
| **Test locally** | Terminal | `npm run dev` → opens `http://localhost:5500`. Never open via `file://`. Test: map tiles load, timeline cards render, dialog opens/closes, filters work, deep links work, mobile hamburger works, Escape closes menus/dialogs. |
| **Deploy** | GitHub Pages | Push to repo, enable Pages from main branch root. Verify all relative paths work at `https://<user>.github.io/<repo>/`. |
