# CLA-I Indian Art Project: Implementation Plan

Scope: (1) Interactive Timeline, (2) Interactive Art Map, (3) Warli × Kalamkari Fusion Artwork, delivered as one static website plus artwork files.
Rule for the whole project: **no fact, date, number or image ships without a recorded source and licence.**

---

## 0. Decisions locked (change only with a reason)

| Decision | Choice |
|---|---|
| Architecture | One static multi-page site (6 HTML pages), no framework, no build step, no backend |
| Code | HTML + CSS + vanilla JS (ES modules) |
| Content | JSON files (`data/`), rendered by JS, validated by a Node script |
| Map | Leaflet **1.9.4** (vendored into the repo) + OpenStreetMap tiles |
| Timeline | Custom-built (not Tiki-Toki/TimelineJS). TimelineJS3 is the emergency fallback only |
| Artwork | Drawn by the team (vector in Inkscape + optional raster texture in Krita). Not generated |
| Hosting | GitHub Pages (public repo) |
| Language | English |

**Open items to confirm with faculty (Phase 0):** see 7.1. The plan below assumes: one site for all three tasks, hand-made artwork, custom timeline allowed.

---

## 1. Deliverables and "done" definitions

| Task | Marks / CO | Done means |
|---|---|---|
| 1. Timeline | 10 / CO1 | 6 eras/traditions, ≥1 clickable artifact each (≥8 total), every artifact modal has image, date, place, medium, significance, sources; works on 360 px phone; keyboard accessible |
| 2. Map | 10 / CO1 | 8 required locations (Ajanta, Ellora, Thanjavur, Khajuraho, Madhubani, Warli region, Puri, Jaipur) each with image, description, historical context; filters; deep links; tile-failure fallback |
| 3. Fusion | 10 / CO2 | Finished original Warli × Kalamkari artwork, concept statement, similarities/differences analysis, process documentation, project description, presentation points |
| Shared | n/a | Live URL, repo, Sources & Credits page, Team & Contributions page, zero console errors |

Team size shown in the brief: 5 for Tasks 1 and 3; none listed for Task 2 (confirm).

---

## 2. Tech stack and versions

| Layer | Tool | Notes |
|---|---|---|
| Markup/Style/JS | HTML5, CSS (custom properties, grid, clamp), JS ES modules | Target evergreen browsers only |
| Map | Leaflet 1.9.4 (stable, released 18 May 2023; 2.0 is still alpha) | Pin the version; copy `leaflet.js`, `leaflet.css` and the `images/` folder into `vendor/leaflet/`. `images/` must sit next to `leaflet.css` |
| Tiles | OSM standard tiles | Attribution mandatory; requests need a Referer (see 10.2) |
| Modals | Native `<dialog>` | Built-in focus trap and Esc |
| Scroll effects | `IntersectionObserver` | No animation library |
| Image zoom | Own `viewer.js` (pointer events + CSS transform) | MVP: fixed zoom steps; stretch: pinch/pan |
| Dev server | `npx serve .` or VS Code Live Server | Needed so tiles and `fetch()` work (never open via `file://`) |
| Validation | `scripts/validate.mjs` (Node LTS) | Blocks bad data before it reaches the site |
| Images | WebP; Squoosh (web app) or `cwebp` | See 14.3 |
| Artwork | Inkscape (vector), Krita or Procreate (raster) | Share a palette file (.gpl) |
| Fonts | 1 display serif + system-ui body, self-hosted WOFF2 | Check each font's licence file (OFL) |
| QA | Chrome DevTools Lighthouse, axe DevTools, real phones | |
| Hosting | GitHub Pages | Static only; site ≤ 1 GB; soft 100 GB/month bandwidth; repo must be public on a free account |

Why not React/Next: ~6 pages, no shared state. A framework adds build and routing failure modes for no benefit.

---

## 3. File structure

```
indian-art-cla1/
├─ index.html            # home: 3 "doors" + intro
├─ timeline.html         # Task 1
├─ map.html              # Task 2
├─ fusion.html           # Task 3
├─ sources.html          # generated from JSON: every source + image credit
├─ about.html            # team + who did what
├─ 404.html
├─ .nojekyll             # empty file; stops Jekyll processing
├─ README.md             # how to run, add content, deploy
├─ data/
│  ├─ timeline.json
│  └─ locations.json
├─ css/
│  ├─ tokens.css         # colours, type scale, spacing
│  ├─ base.css           # reset, typography, layout primitives
│  ├─ components.css     # header, card, chip, dialog, table, figure
│  └─ pages/ home.css timeline.css map.css fusion.css
├─ js/
│  ├─ util.js            # fetchJSON, h() DOM helper, hash helpers
│  ├─ layout.js          # injects header/footer, marks active link
│  ├─ dialog.js          # artifact modal
│  ├─ viewer.js          # zoomable image
│  ├─ timeline.js  map.js  fusion.js  sources.js
├─ vendor/leaflet/       # leaflet.js, leaflet.css, images/
├─ assets/
│  ├─ fonts/
│  ├─ icons/             # SVG
│  └─ img/ timeline/ map/ fusion/   # WebP only (+ process/ stage images)
├─ scripts/
│  ├─ validate.mjs       # data + image checks
│  └─ (optional) optimize-images.mjs
└─ .github/workflows/validate.yml   # optional: runs validate on PRs
```

Keep out of the repo: PSD/KRA/large source files and raw downloads (repo recommended limit is 1 GB). Put them in a shared drive and store only web exports here.

**Path rule:** a project site lives at `https://<user>.github.io/<repo>/`, so use **relative paths everywhere** (`css/base.css`, never `/css/base.css`).

---

## 4. Data schemas

### 4.1 `timeline.json` entry
```json
{
  "id": "dancing-girl",
  "track": "dated",            // dated | living
  "era": "indus",              // indus | ajanta | chola | mughal | madhubani | warli
  "order": 10,                 // explicit sort; never sort by date
  "title": "Dancing Girl",
  "dateLabel": "c. 2500 BCE",  // display string
  "dateNote": "Approximate; mature Harappan phase",
  "place": "Mohenjo-daro (Sindh, Pakistan)",
  "now": "National Museum, New Delhi",
  "medium": "Bronze, lost-wax casting",
  "summary": "<= 25 words (card)",
  "significance": "<= 130 words (modal)",
  "mapId": null,               // must match a locations.json id if set
  "image": { "src": "assets/img/timeline/dancing-girl.webp", "w": 1200, "h": 1600,
             "alt": "...", "creator": "...", "license": "CC BY-SA 4.0",
             "source": "https://commons.wikimedia.org/wiki/File:..." },
  "sources": [ { "label": "...", "url": "https://..." } ],
  "status": "verified",        // verified | disputed
  "disputes": ["Discoverer attribution differs between sources"]
}
```

### 4.2 `locations.json` entry
```json
{
  "id": "ajanta",
  "name": "Ajanta Caves",
  "state": "Maharashtra",
  "lat": 20.5533, "lng": 75.7003,      // Leaflet order: [lat, lng]
  "medium": "mural",                   // mural | sculpture-architecture | folk-painting | court-miniature | textile
  "kind": "point",                     // point | region
  "region": null,                      // for regions: [[lat,lng],...] polygon, labelled "approximate"
  "period": "2nd c. BCE to c. 5th/6th c. CE (dating debated)",
  "summary": "...", "context": "...",
  "tabs": null,                        // e.g. Thanjavur: two tabs
  "image": { "...": "same shape as above" },
  "timelineIds": ["ajanta-padmapani"],
  "sources": [ { "label": "...", "url": "..." } ],
  "status": "verified"
}
```

### 4.3 `validate.mjs` rules (build these first; they enforce accuracy)
1. Required fields present; `id` unique and kebab-case.
2. `sources` has ≥1 entry, each with a working-format URL; `status: "disputed"` requires non-empty `disputes`.
3. Every image has `alt`, `creator`, `license`, `source`; file exists on disk; width ≤ 2400 px; file ≤ 400 KB (artwork exempt).
4. Coordinates: `lat` 6–37 and `lng` 68–98 (catches swapped lat/lng). Exception list for non-India items.
5. Text limits: `summary` ≤ 25 words, `significance` ≤ 130 words.
6. Cross-refs: every `mapId` exists in locations; every `timelineIds` exists in timeline.
7. Fail with a readable message (file, id, field).

---

## 5. Design system

**Concept:** a gallery lit by the materials of the art. Palette from the traditions' materials: rice-paste cream, red-ochre/mud-brown (Warli's ground), indigo and madder (Kalamkari natural dyes), lamp black.

`tokens.css` starting values (verify contrast with a checker before locking):
```
--cream:#F5EEDC  --ochre:#B5651D  --madder:#8E2A22  --indigo:#1C2B4A
--turmeric:#D9A23B  --leaf:#4E6B3A  --lamp:#1A1614
--font-display: "Fraunces", Georgia, serif;   --font-body: system-ui, sans-serif;
--step-0: clamp(1rem, .95rem + .25vw, 1.125rem)   /* scale up from here */
--radius: 10px;  --max: 1200px;  --header-h: 64px;
```
- Breakpoints: 600 / 900 / 1200 px. Mobile-first.
- Ornament: original SVG dividers using circle/triangle/square. Light touch; the fusion piece is the star.
- Motion: subtle reveal on scroll, disabled under `prefers-reduced-motion`. Reveal styles apply only when `<html class="js">` (set by a one-line inline script) so content is never hidden if JS fails.
- Accessibility baseline: visible focus ring, skip link, real `alt`, contrast ≥ 4.5:1 body text, all controls are buttons/links, no hover-only content.
- Viewport height: declare `height: calc(100vh - var(--header-h))` then override with `100dvh` (fallback for older browsers).
- Components (build once, reuse): header/nav, footer, card, chip (`aria-pressed`), dialog, figure+credit, comparison table, swatch.

---

## 6. Workflow and roles

**Roles (adjust to your team):**
| Role | Owns |
|---|---|
| Integrator/tech lead | Repo, shell, layout.js, validator, deploy, final QA |
| Map dev | Task 2 code + locations.json |
| Timeline dev | Task 1 code + viewer.js |
| Content lead | Fact register, sources page, image licences, project description, presentation |
| Art lead | Fusion art direction, style guide, integration of everyone's layers |
Everyone contributes to the artwork; everyone appears on `about.html` with true contributions.

**Git:** `main` = what is live. Work in branches (`map/filters`, `content/ellora`), open a PR, one reviewer, merge. One issue per step in this document. Commit messages: `area: what` (e.g. `map: add filter chips`). Run `node scripts/validate.mjs` before every PR.

**Content flow:** research → fact-register row (Section 17) → JSON entry → image (licence recorded) → validator passes → PR.

**Time split (of your total available time):** Phase 0–1: 20% · Phase 2: 10% · Map: 15% · Timeline: 20% · Fusion page: 10% · QA: 15% · Deploy/submission: 10%. The artwork runs in parallel across the whole window and must be frozen before the Fusion page is finalised.

---

## 7. Phase 0: Kickoff and setup

### 7.1 Steps
1. **Ask faculty (one message):** (a) Is Task 2 individual or team? (b) One site, or three separate submissions; what format (URL, ZIP, PPT)? (c) Is a custom-coded timeline acceptable instead of Tiki-Toki/TimelineJS? (d) Rules on AI-generated art and on reference images? (e) Deadline and demo format?
2. Create a **public** GitHub repo; add collaborators; create the folder skeleton from Section 3 with empty files.
3. Enable Pages: Settings → Pages → Deploy from branch → `main` / root. Add `.nojekyll`.
4. Install Node LTS, VS Code, Live Server (or use `npx serve .`). Everyone runs the site locally.
5. Deploy a **test page**: a 10-line Leaflet map (vendored Leaflet) with the OSM layer. Open the live URL and confirm tiles load.
6. Assign roles (Section 6). Create issues for each step below.

**Gate:** live URL shows a map with tiles; everyone can run locally; faculty answers recorded in README.

### 7.2 Difficulties
| Problem | Avoid/fix |
|---|---|
| Pages 404 after enabling | Wait a few minutes; confirm branch/root; filename `index.html` lowercase |
| CSS/JS not loading on live site | Root-absolute paths. Use relative paths |
| Map works on localhost, blank on Pages (or vice versa) | Test on both; check console for tile 403 |
| Free-account private repo can't use Pages | Repo must be public |
| Team edits clash | Small PRs, one owner per file group |

---

## 8. Phase 1: Content register (do this before writing UI code)

### 8.1 Steps
1. **Source tiers.** Tier 1: UNESCO, ASI, GI Registry, museum catalogue pages, scholarly books/papers. Tier 2: Britannica, World History Encyclopedia, government craft portals. Tier 3 (never a sole source): UPSC-prep sites, travel blogs, e-commerce pages, AI-written summaries.
2. **Two-source rule** for every date, number and attribution. If two good sources disagree, record `status: "disputed"` and publish the range or the cautious wording.
3. For each of the 6 timeline traditions and 8 map locations, fill a fact-register row (Section 17 has the starting rows with known conflicts).
4. **Images:** for each, find a Commons file (or your own photo/drawing). Record creator, licence, URL. Download the file; do not hotlink. Credit the original creator, not the uploader. If the licence is unclear, do not use it; link to the museum page instead.
5. Write **alt text** for each image while it is in front of you (what it shows, not "image of").
6. Write copy within limits: card 25 words, modal 130 words. Plain language; explain terms once.
7. Enter everything into the JSON files; run the validator.

**Gate:** validator passes with placeholder images for everything; content lead signs off the register.

### 8.2 Difficulties
| Problem | Avoid/fix |
|---|---|
| Sources contradict (they will; see Section 17) | Disputed status + range wording; never pick the flashier number |
| Copying text from sites | Write in your own words from ≥2 sources; keep the URL |
| No free image for a work | Use a different artifact, a Commons photo of the site, or your own sketch clearly labelled |
| Museum object photographed by a museum | Usually not reusable; link out |
| Dancing Girl image | Use the unaltered museum photo; a retouched version was in the news, so don't edit it |

---

## 9. Phase 2: Shell and design tokens

### 9.1 Steps
1. Write `tokens.css`, `base.css` (reset, typography, container, skip link, focus styles).
2. Build `layout.js`: injects header (logo, 5 links, `aria-current` on active) and footer (credits link); include `<noscript>` with plain links. Reserve header height in CSS to prevent layout shift.
3. Head boilerplate for every page:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<script>document.documentElement.classList.add('js')</script>
```
4. Build components once in `components.css`: card, chip, figure (image + credit line), dialog shell, table, swatch.
5. Build `index.html` with three doors and a short intro; link all pages (empty pages are fine, with titles).
6. Wireframe on paper or Figma for Timeline, Map, Fusion at 390 px and 1280 px before coding them.

**Gate:** all 6 pages load with header/footer, consistent typography, no console errors, Lighthouse accessibility ≥ 90 on the shell.

### 9.2 Difficulties
| Problem | Avoid/fix |
|---|---|
| Header/footer duplicated and drifting | `layout.js` is the single source |
| Fonts slow or blocked | Self-host WOFF2, `font-display: swap`, system fallback stack |
| Design gets busy | Ornament only in dividers and hero; keep body backgrounds flat |
| Low contrast colours | Check every text/background pair with a contrast checker |

---

## 10. Task 2: Interactive Art Map (build first; it is self-contained)

### 10.1 Steps
1. **Markup:** header, `<main>` with `#map` and `#panel` (side panel on desktop, bottom sheet on mobile), filter chips above the list.
2. **Container height:** give `#map` an explicit height (`calc(100vh - var(--header-h))` then `100dvh`). A zero-height container renders nothing.
3. **Initialise:**
```js
const map = L.map('map', { center:[22.5,79], zoom:5, minZoom:4, maxZoom:18 });
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
let bad = 0;
tiles.on('tileerror', () => { if (++bad === 5) showTileBanner(); });
```
4. **Load data:** `fetch('data/locations.json')` inside try/catch; on failure show a visible error message with a retry button.
5. **Markers:** `L.divIcon` (CSS-drawn, colour by `medium`, 18 px) instead of default PNG markers. Set `title` and `alt` options; markers are keyboard-focusable by default. Remember Leaflet uses `[lat, lng]`.
6. **Regions:** Warli (Thane–Palghar districts) and Madhubani (Mithila villages: Jitwarpur, Ranti, Rasidpur) as approximate polygons or circles with the label "approximate extent". Do not claim official boundaries.
7. **Panel content:** on marker click or list-item click: open panel with image, name, period, summary, context, medium tag, sources, and "see on timeline" links. Thanjavur uses two tabs (Chola temple murals vs Thanjavur painting).
8. **Sync selection:** clicking a marker highlights the list item and `map.flyTo(latlng, 8)`; clicking a list item does the reverse. List items are `<button>`s.
9. **Filters:** one `L.layerGroup` per medium; chips toggle groups; `aria-pressed` reflects state; "Reset view" button calls `fitBounds` on all markers with padding.
10. **Deep links:** parse `location.hash` (`map.html#ajanta`) after data loads and on `hashchange`; timeline modals link here.
11. **Optional extras** (only after the core is done): Srikalahasti and Pedana/Machilipatnam pins for Kalamkari to tie the map to Task 3; a small legend.
12. **Fallbacks:** tile-error banner ("Map tiles unavailable; use the list"); the list alone must present all content without the map.

**Handoff to Timeline:** export the final `id`s; the timeline's `mapId` values must match.
**Gate:** all 8 locations render with content; keyboard-only user can select each; works at 360 px; tile fallback tested by blocking the tile domain in DevTools.

### 10.2 Difficulties
| Problem | Avoid/fix |
|---|---|
| Map area blank/grey | Container height; call `map.invalidateSize()` after showing/hiding the panel |
| **Tiles blocked (403 "Referer is required")** | Never open via `file://`; serve over http(s); keep the referrer meta tag; OSM lists `strict-origin-when-cross-origin` among accepted policies |
| Blocked for missing attribution | Keep the attribution string; do not hide it with CSS |
| Marker image 404s | Use `divIcon`; if you use default icons, keep `images/` beside `leaflet.css` |
| Points land in the ocean/Africa | Lat/lng swapped; validator bbox check catches it |
| Ajanta and Ellora markers overlap at country zoom | They are about 80 km apart (computed from coordinates); at zoom 5 that is ~17 px. Use 18 px markers, `flyTo` zoom 8 on select (separates them clearly) |
| Popups cramped on phones | Use the custom panel/bottom sheet, tooltips only for names |
| Regions drawn as pins misrepresent them | Approximate polygons with the label |
| Hash opens before data exists | Parse hash only after the fetch resolves |
| Mohenjo-daro appears on an India map | Keep it on the timeline only (it is in Sindh, Pakistan) |
| Leaflet 2.0 alpha pulled in by "latest" URLs | Pin 1.9.4; vendored files cannot drift |
| Demo-day Wi-Fi fails | Record a screen video and keep a screenshot of the map as backup |

Coordinates verified in research: Ajanta 20.5533°N 75.7003°E; Ellora 20.0239°N 75.1778°E; Khajuraho 24.8544°N 79.9214°E; Thanjavur (Brihadisvara) 10.7831°N 79.1325°E. Source the others (Madhubani, Warli area, Puri/Raghurajpur, Jaipur, optional Kalamkari towns) from an authoritative page and confirm each on the OSM map.

---

## 11. Task 1: Interactive Timeline

### 11.1 Steps
1. **Structure the story:** rail of 6 eras in the user's order: Indus Valley → Ajanta → Chola → Mughal, plus a separate **Living traditions** track for Madhubani and Warli. Add a visible note: "Not to scale."
2. **Data:** finalise `timeline.json` (schema 4.1). Sort by `order`, never by parsed date. Store dates as display strings (`"c. 2500 BCE"`); JavaScript `Date` handles BCE poorly.
3. **Layout:** sticky era rail at top (anchor links) and a vertical "spine" of cards. Desktop: alternate left/right via CSS grid; mobile: single column. No JS layout math.
4. **Render:** `timeline.js` builds cards with the `h()` helper and `textContent` (not `innerHTML`), so `<`, `&`, quotes in copy cannot break the page.
5. **Card:** image (fixed aspect-ratio frame, `object-fit: cover`), title, dateLabel, place, 25-word summary, "Open artifact" button.
6. **Artifact modal** (`dialog.js`, native `<dialog>`):
```js
btn.addEventListener('click', () => { fill(dlg, item); dlg.showModal(); document.body.classList.add('lock'); });
dlg.addEventListener('close', () => document.body.classList.remove('lock'));
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); }); // backdrop click
```
   Contents: zoomable image, dateLabel + dateNote, place, current location, medium, 130-word significance, "Disputed" note if any, sources list, image credit, "View on map" link if `mapId`.
   Give the dialog no padding; put content in an inner wrapper so the backdrop-click test works. Use `aria-labelledby` on the title.
7. **Zoomable image (`viewer.js`):** MVP = buttons for 1×/2×/3× and reset, drag to pan when zoomed. Stretch = wheel zoom and two-finger pinch using pointer events, `touch-action: none` on the viewer, `overscroll-behavior: contain`. Clamp pan so the image cannot leave the frame.
8. **Scroll-spy:** `IntersectionObserver` on era sections (`rootMargin` around −40% top/bottom) sets `aria-current="true"` on the rail link. Guard against flicker by updating only when the active id changes.
9. **Deep links:** `timeline.html#dancing-girl` opens that modal after data loads; closing the modal clears the hash.
10. **Reveal animation:** only under `.js` and only if `prefers-reduced-motion` is not set.
11. **Cross-links:** each modal's map link goes to `map.html#<mapId>`; each map panel links back to `timeline.html#<id>`.
12. **Legend and reading aid:** short intro line explaining the two tracks and the "not to scale" rail.

**Candidate artifacts (verify each choice and image licence in Phase 1):** Dancing Girl (Indus); an Ajanta Cave 1 mural such as Padmapani (verify identification and cave number with ASI/UNESCO); a Brihadisvara sanctum mural (Chola); a Hamzanama folio (Mughal); a Kohbar wall painting (Madhubani); a Warli chowk (Warli). A second artifact per era makes the timeline richer if licences allow.

**Handoff to Fusion page:** reuse `viewer.js` and `dialog.js` there.
**Gate:** all artifacts open, close, and deep-link; keyboard-only path works; modal images never overflow at 360 px.

### 11.2 Difficulties
| Problem | Avoid/fix |
|---|---|
| BCE dates break sorting/formatting | Display strings + explicit `order` |
| Proportional axis is unreadable (2500 BCE to today) | Era rail, non-proportional, labelled |
| Folk traditions placed on a fake date | Separate "Living traditions" track with documented milestones (Section 17) |
| Images of very different shapes (tall mural crops, wide folios, tiny bronze) | Fixed frames with `cover` in cards, `contain` in modal; store art-directed crops separately |
| Modal accessibility bugs | Native `<dialog>`; test Tab, Shift+Tab, Esc, focus return to the trigger |
| Page scrolls behind the modal | `lock` class on `<body>` (`overflow:hidden`) |
| Pinch-zoom fights page scroll on phones | `touch-action:none` inside the viewer only; ship MVP first |
| Scroll-spy flicker | Update only on change; tune `rootMargin` |
| Text overflows cards | Validator word limits; CSS line clamp is a backup, not the fix |
| Content invisible if JS animation fails | Hide-then-reveal styles only when `.js` is present |
| Layout jump as images load | `width`/`height` attributes on every `<img>` |
| Broken links between pages | Validator cross-checks `mapId` and `timelineIds` |
| Images too heavy | 600 px card images ≤ 60 KB; 1600 px modal images ≤ 300 KB; `loading="lazy"` |

---

## 12. Task 3: Warli × Kalamkari Fusion Artwork

Start on day one; it has the longest lead time. The website page is built after the artwork is frozen.

### 12.1 Art process (steps and gates)
1. **Study (both traditions, ~1–2 days).** Build a reference board for study only (do not trace or reproduce a specific artist's work). Note:
   - *Warli:* white rice-paste linework on red-ochre/mud ground; circle, triangle, square as the vocabulary; figures from two triangles joined at the tip; scenes of daily life, farming, dance, nature; the square chowk as a central ritual frame.
   - *Kalamkari:* bamboo-pen freehand (Srikalahasti) or carved-block printing (Machilipatnam/Pedana); natural dyes (indigo, madder, etc.); Persian-influenced vines and florals with Indian motifs (parrots, lotuses, cartwheels); black outlines then colour fills.
2. **Define the fusion rule (decide as a team, in one sentence).** Suggested rule: *Warli provides figures, geometry and narrative; Kalamkari provides botanicals, colour and the framing border.* A clear rule keeps the piece coherent instead of two styles pasted together.
3. **Concept sketches (3 thumbnails, then 1 pick).** Suggested concept: Warli dancers in a circle at the centre; Kalamkari vine-and-floral frame around them; border repeating Kalamkari vine with small Warli triangles/dots. Choose ground colour (madder or indigo cloth-tone, or ochre wall-tone).
4. **Style guide (1 page):** line weights, figure proportions, corner rounding, dot size, spacing, allowed motifs, palette (exported as `.gpl` for Inkscape/Krita). Draw one **sample tile** (one figure + one flower + border segment) and get team sign-off before scaling up.
5. **Layer ownership:** Person A figures; B botanicals; C border; D ground/colour/texture; E integrator/QA/documentation. Each works on a separate layer or separate SVG file; the art lead assembles the master.
6. **Line art pass → colour pass → texture pass.** Vector for the geometric elements (crisp at any size). Optional raster texture for a cloth/mud feel. Photograph or screenshot each stage for the process page.
7. **Review round** against the fusion rule and style guide; fix hierarchy: focal circle first, botanicals second, border third; keep breathing space.
8. **Freeze and export:** master SVG; PNG at 3000 px on the long edge; WebP web versions at 800 / 1600 / 2400 px; thumbnail. Export in sRGB. If a printed copy is needed, also export A3 at 300 dpi (4961 × 3508 px).
9. **Cultural accuracy check** (Section 12.3) and sign-off sheet with names.

**Gate:** frozen master + exports + process images + palette + written concept in 5 sentences.

### 12.2 Fusion page build (after the freeze)
1. **Hero:** the artwork, `srcset` (800/1600/2400), click to open the zoom viewer, long alt text describing composition.
2. **Concept statement:** the fusion rule, why these two traditions, what each contributes.
3. **Comparison table (satisfies the "similarities and differences" objective):** rows = surface/ground, medium/pigment, technique, palette, motifs, themes, region, GI registration. Use only Section 17 verified facts (Warli: mud walls, rice paste, geometric shapes, Thane–Palghar area, GI certificate 2014; Kalamkari: cotton, bamboo pen or wooden blocks, natural dyes, two GI-registered styles).
4. **Motif dictionary:** pairs of "source motif → how we reinterpreted it" with small crops.
5. **Palette:** swatches with hex codes and the natural-dye inspiration for each.
6. **Process gallery:** 5 stages (references, sketch, line art, colour, final) with captions and who did what.
7. **Reflection:** what worked, what we changed, what we would do next.
8. **Project description (200–300 words) and presentation points:** write last, once the artwork is frozen (Appendix A has the presentation skeleton).

**Gate:** page passes validator (images licensed/own), performance budget, and the artwork is zoomable on phone.

### 12.3 Cultural accuracy guardrails
- Keep Warli's geometric vocabulary and white-on-earth-tone logic recognisable; do not invent new "Warli" conventions and present them as traditional.
- Sources conflict on whether Warli art depicts deities (one says it does not portray mythological characters; another describes a mother-goddess figure inside the Devchauk). Avoid the claim; keep the artwork and copy to daily life, nature and celebration, which both agree on.
- Credit traditions and regions accurately; say "inspired by", not "traditional".
- Do not imitate a named living artist's composition.
- Do not use the artwork as a claim of authenticity for either GI-protected craft.

### 12.4 Difficulties
| Problem | Avoid/fix |
|---|---|
| Five hands, five styles | Style guide, one sample tile approved first, one integrator |
| Warli is monochrome, Kalamkari is multi-colour | Fusion rule: white linework for figures, limited natural palette for botanicals/border |
| Cluttered, unreadable result | 3-tier hierarchy; leave empty space; cap motif types |
| Merge conflicts on artwork | Separate layer files, single assembler; big source files outside git |
| Colours look different on screen vs print | Work and export in sRGB; test on 2 screens; soft-proof if printing |
| Huge image slows the page | `srcset`, WebP, lazy load, viewer loads the 2400 px version only on open |
| Looks generated or copied | Keep sketches, layers, timestamps; process page; sign-off sheet |
| Time overrun | Milestones: sample tile approved → line art done → colour frozen; if late, simplify the border first |
| Description written too early | Skeleton only until freeze; then write from the final piece |

---

## 13. Home, Sources and About pages

1. **Home:** short intro (what, why), three cards linking to the tasks, a "how to explore" hint, credits link.
2. **Sources & Credits (`sources.js`):** loops both JSON files and lists every source and image credit grouped by page; the OSM attribution and Leaflet credit; font licences. Because it is generated, it cannot go out of date.
3. **About/Team:** roles and actual contributions per person; course/faculty/semester; date.
4. **404 page:** link back home.

---

## 14. QA, accessibility, performance

### 14.1 Test matrix (run before every release to `main`)
| Area | Check |
|---|---|
| Widths | 360, 390, 768, 1280 px; landscape phone |
| Browsers | Chrome, Edge, Firefox, iOS Safari (real phone if possible) |
| Keyboard | Tab through every page; open/close every modal; select every map location |
| Screen reader spot-check | Landmarks, headings order, button names, alt text |
| Motion | Enable "reduce motion"; nothing essential animates |
| Failure modes | Block tile domain (map fallback); rename an image (broken-image fallback); disable JS (noscript nav, readable message) |
| Console | Zero errors/warnings on every page |
| Links | Every internal and external link works (run a link checker) |
| Data | `node scripts/validate.mjs` passes |
| Live URL | Repeat smoke tests on the deployed site, not only localhost |

### 14.2 Score targets
Lighthouse (mobile): Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90. Fix contrast and missing alt text first. These are project targets, not requirements from the brief.

### 14.3 Performance budget
HTML+CSS+JS (excluding Leaflet) ≤ 150 KB; home page total ≤ 1.5 MB; card images ≤ 60 KB; modal images ≤ 300 KB; artwork 2400 px version loads only on zoom. WebP, `loading="lazy"`, `decoding="async"`, explicit `width`/`height`, one display font subset.

---

## 15. Deploy and submission

1. Merge to `main` only after 14.1 passes on a PR preview locally.
2. Live URL: `https://<user>.github.io/<repo>/`. After each deploy, hard-refresh and test the live page. If assets look stale, add a version query (`?v=2`) to CSS/JS links.
3. Deploy limits to remember: site ≤ 1 GB, soft bandwidth 100 GB/month, soft limit of 10 builds/hour.
4. **Submission pack:** live URL, repo link (or ZIP if required), artwork files (SVG/PNG), project description, presentation, Sources page export, team contribution sheet.
5. **Demo plan:** open the live site 10 minutes early; keep the offline backup (screen recording + screenshots); rehearse the click path: Home → Timeline artifact → "View on map" → Fusion page → zoom.
6. Tag a release (`v1.0`) so the submitted version is fixed even if you keep editing.

---

## 16. Risk register

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | Wrong facts from bad sources | High | High | Source tiers, two-source rule, disputed status, validator | Content lead |
| 2 | Artwork not finished / not original enough | Medium | High | Start day one, milestones, process evidence, faculty rule check | Art lead |
| 3 | OSM tiles blocked | Medium | High | Serve over http(s), referrer meta, attribution, fallback list | Map dev |
| 4 | Image licence problems | Medium | Medium | Commons only or own work; licence in JSON; validator | Content lead |
| 5 | Scope creep (3D, animations, extras) | High | Medium | Core first; extras only after gates | Integrator |
| 6 | Team merge conflicts | Medium | Medium | Ownership, small PRs, source files outside git | Integrator |
| 7 | Mobile bugs | Medium | Medium | Mobile-first, real-device testing | Everyone |
| 8 | Demo-day connectivity | Medium | Medium | Recorded backup, screenshots | Integrator |
| 9 | Submission format mismatch | Low | High | Ask faculty in Phase 0 | Integrator |
| 10 | Deadline compression | Medium | High | Freeze features at 70% of time; QA time reserved | Everyone |

---

## 17. Fact register (starting rows; conflicts already found)

Facts came from search excerpts. **Re-open each source and confirm before publishing.**

| Topic | Use this wording | Avoid |
|---|---|---|
| Warli origin | Origin undocumented; often placed around the 10th century CE; wider recognition from the 1970s (Jivya Soma Mashe is associated with this) | "2,500 BCE" (one craft page) |
| Warli GI | Certificate dated 31 March 2014 (GI Registry entry) | "2023" (one craft page) |
| Warli look | Mud walls, white rice-paste pigment, brown/ochre grounds, circle/triangle/square; area: Thane and Palghar districts | Claims about deities (sources conflict) |
| Madhubani | Documented to outsiders after the 15 Jan 1934 earthquake (W. G. Archer); moved to paper in 1966 (Pupul Jayakar, Bhaskar Kulkarni); GI 2007 | Ramayana-era origin as fact; "1934 drought" (wrong) |
| Ajanta | Rock-cut Buddhist caves near Aurangabad district, Maharashtra; UNESCO 1983; two phases from 2nd c. BCE to about 480 CE; second-phase dating debated; largest surviving paintings in Caves 1, 2, 16, 17 | One confident date |
| Ellora | UNESCO 1983; 34 caves: 12 Buddhist, 17 Hindu, 5 Jain; Kailasa (Cave 16) under Krishna I, c. 756–775 CE | "6th–7th century BCE" for Buddhist caves (error in one source) |
| Khajuraho | Chandela temples, UNESCO 1986; mostly 10th–11th century (sources give 950–1050 CE and 885–1000 CE); about 20 survive of about 85 recorded | Precise construction years; painting claims (it is sculpture/architecture) |
| Chola / Thanjavur | Brihadisvara Temple built by Rajaraja I, 1003–1010 CE; part of Great Living Chola Temples (UNESCO 1987, extended 2004) | Calling later Thanjavur paintings "Chola" |
| Thanjavur painting | Origins around 1600 under the Nayakas; present form from the Maratha court (1676–1855); GI 2007–08 | Merging with Chola murals |
| Puri / Pattachitra | Cloth scroll painting linked to Jagannath worship; hub village Raghurajpur about 14 km from Puri | Naming pigment colours per mineral (sources disagree on haritala) |
| Jaipur | Jaipur school takes distinct identity early 18th century under Sawai Jai Singh (1699–1743); collections at the Maharaja Sawai Man Singh II Museum, City Palace | Overstating a single date |
| Mughal | Humayun brought Mir Sayyid Ali and Abd al-Samad from Persia; Akbar's atelier; Hamzanama c. 1562–77, about 1,400 large folios, about 200 survive in dispersed collections | Exact folio counts and sizes |
| Dancing Girl | About 10.5 cm bronze, c. 2500 BCE, lost-wax; excavated 1926 at Mohenjo-daro (Sindh, Pakistan); in National Museum, New Delhi; the "Dancing Girl" name is currently debated | Naming a discoverer (sources differ) |
| Kalamkari | Two GI-registered styles: Srikalahasti (freehand pen, 2005) and Machilipatnam (block, 2008); cotton, natural dyes; commonly described as 23 steps | "3,000 years old" |

---

## 18. References (start here; verify before quoting)

**Tools and rules**
- Leaflet download/versions: https://leafletjs.com/download
- OSM blocked-tiles policy (Referer, attribution): https://wiki.openstreetmap.org/wiki/Blocked
- OSM attribution enforcement: https://github.com/openstreetmap/tile-attribution
- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- About GitHub Pages: https://help.github.com/articles/what-is-github-pages
- Commons reuse rules: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- TimelineJS (original, no longer developed): https://github.com/NUKnightLab/TimelineJS
- Tiki-Toki FAQ (free plan limits; check current terms): https://www.tiki-toki.com/faqs/

**Content starting points (Tier 1–2 where possible)**
- Ellora, ASI Aurangabad Circle: https://asiaurangabadcircle.com/monuments/ellora/elloraCaves.php
- Machilipatnam Kalamkari (Handicrafts portal): https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Textile/Other_Textiles_Based/Machilipatnam_Kalamkari/MachilipatnamKalamkariWebPage.html
- Warli GI record: https://www.theippress.com/?p=3433
- Madhubani discovery history: https://sarmaya.in/?p=8707
- Dancing Girl (NVLI): https://nvli.in/museums/dancing-girl
- Khajuraho: https://en.wikipedia.org/wiki/Khajuraho_Group_of_Monuments
- Warli painting: https://en.wikipedia.org/wiki/Warli_painting
- Kalamkari: https://en.wikipedia.org/wiki/Kalamkari
- Jaipur miniature school (book listing): https://dkprintworld.com/product/panorama-of-jaipur-paintings/

Also consult UNESCO World Heritage pages for Ajanta (ref. 242), Ellora (ref. 243), Khajuraho (ref. 240) and Great Living Chola Temples (ref. 250bis), and the official GI Registry for each GI claim.

---

## Appendix A: Presentation skeleton (fill after the artwork freeze)

1. Title + team + roles
2. Problem/brief: three activities, three objectives (CO1, CO2)
3. Site tour: architecture in one slide (static site, JSON, Leaflet)
4. Timeline: two tracks, three artifacts demo, "not to scale" decision
5. Map: 8 locations, medium colour-coding, region handling
6. Fact-checking method: two-source rule, disputed entries (show 2 examples)
7. Fusion: the fusion rule, comparison table
8. Process: sketch → line → colour → final
9. Challenges and how we solved them
10. Learnings, credits, Q&A

## Appendix B: Definition of "ready to submit"

- [ ] Validator passes; zero console errors on all pages
- [ ] All 8 map locations and all 6 traditions complete with sources and image credits
- [ ] Fusion artwork frozen; process page complete; contributions truthful
- [ ] Lighthouse targets met on the live URL
- [ ] Keyboard and phone tests passed; tile fallback tested
- [ ] Backup recording and screenshots stored
- [ ] Release `v1.0` tagged; submission pack assembled
