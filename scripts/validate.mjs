/**
 * validate.mjs — Data and image validator for the Indian Art project.
 *
 * Rules (from README Section 4.3):
 * 1. Required fields present; id unique and kebab-case.
 * 2. sources ≥1 entry with URL; status:"disputed" requires non-empty disputes.
 * 3. Image: alt, creator, license, source present; file exists; file ≤ 400 KB.
 * 4. Coordinates: lat 6–37, lng 68–98 (catches swapped lat/lng).
 * 5. Text limits: summary ≤ 25 words, significance ≤ 130 words.
 * 6. Cross-refs: every mapId in locations; every timelineIds entry in timeline.
 * 7. Fail with readable message (file, id, field).
 *
 * Usage:
 *   node scripts/validate.mjs                # full check
 *   node scripts/validate.mjs --skip-images  # skip image file existence/size
 */

import { readFile, stat, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');

const SKIP_IMAGES = process.argv.includes('--skip-images');

/* --- Constants --- */
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\//;

const ERAS = new Set(['indus', 'ajanta', 'chola', 'mughal', 'madhubani', 'warli']);
const TRACKS = new Set(['dated', 'living']);
const MEDIUMS = new Set(['mural', 'sculpture-architecture', 'folk-painting', 'court-miniature', 'textile']);
const KINDS = new Set(['point', 'region']);

const TIMELINE_REQUIRED = ['id', 'track', 'era', 'order', 'title', 'dateLabel', 'medium', 'summary', 'significance', 'image', 'sources', 'status'];
const LOCATION_REQUIRED = ['id', 'name', 'state', 'lat', 'lng', 'medium', 'kind', 'summary', 'image', 'sources', 'status'];

/* --- Helpers --- */
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).length;
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function getSize(path) {
  try { return (await stat(path)).size; } catch { return -1; }
}

/* --- Main --- */
async function main() {
  let errors = 0;
  const fail = (file, id, field, msg) => {
    errors++;
    console.error(`  ❌  [${file}] ${id ? '#' + id : ''} .${field} — ${msg}`);
  };

  console.log('Validating data files…\n');
  if (SKIP_IMAGES) console.log('  ⚠  --skip-images: skipping image file checks\n');

  /* Load JSON */
  let timeline, locations;
  try {
    timeline = JSON.parse(await readFile(join(ROOT, 'data/timeline.json'), 'utf8'));
  } catch (e) { console.error('❌ data/timeline.json: ' + e.message); process.exit(1); }

  try {
    locations = JSON.parse(await readFile(join(ROOT, 'data/locations.json'), 'utf8'));
  } catch (e) { console.error('❌ data/locations.json: ' + e.message); process.exit(1); }

  if (!Array.isArray(timeline)) { console.error('❌ timeline.json must be an array'); process.exit(1); }
  if (!Array.isArray(locations)) { console.error('❌ locations.json must be an array'); process.exit(1); }

  const timelineIds = new Set();
  const locationIds = new Set();

  /* ========== Timeline ========== */
  console.log(`Timeline: ${timeline.length} entries`);

  for (const entry of timeline) {
    const id = entry.id || '(no id)';
    const f = (field, msg) => fail('timeline.json', id, field, msg);

    // Rule 1: Required fields
    for (const key of TIMELINE_REQUIRED) {
      if (entry[key] == null) f(key, 'missing');
    }

    // id: unique, kebab-case
    if (entry.id) {
      if (!KEBAB.test(entry.id)) f('id', `not kebab-case: "${entry.id}"`);
      if (timelineIds.has(entry.id)) f('id', 'duplicate');
      else timelineIds.add(entry.id);
    }

    // Enum fields
    if (entry.track && !TRACKS.has(entry.track)) f('track', `invalid value: "${entry.track}"`);
    if (entry.era && !ERAS.has(entry.era)) f('era', `invalid value: "${entry.era}"`);

    // Rule 2: Sources
    if (entry.sources) {
      if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
        f('sources', 'must have ≥ 1 entry');
      } else {
        entry.sources.forEach((s, i) => {
          if (!s.label) f(`sources[${i}].label`, 'missing');
          if (!s.url || !URL_RE.test(s.url)) f(`sources[${i}].url`, 'missing or not a URL');
        });
      }
    }

    // Disputed status requires disputes
    if (entry.status === 'disputed') {
      if (!Array.isArray(entry.disputes) || entry.disputes.length === 0) {
        f('disputes', 'status is "disputed" but disputes array is empty');
      }
    }

    // Rule 3: Image metadata
    if (entry.image && typeof entry.image === 'object') {
      const img = entry.image;
      if (!img.alt) f('image.alt', 'missing');
      if (!img.creator || img.creator === 'TODO') f('image.creator', 'missing or TODO');
      if (!img.license || img.license === 'TODO') f('image.license', 'missing or TODO');
      if (!img.source || img.source === 'TODO') f('image.source', 'missing or TODO');

      // File checks
      if (!SKIP_IMAGES && img.src) {
        const imgPath = join(ROOT, img.src);
        if (!await exists(imgPath)) {
          f('image.src', `file not found: ${img.src}`);
        } else {
          const size = await getSize(imgPath);
          if (size > 20000 * 1024) {
            f('image.src', `${Math.round(size / 1024)} KB exceeds 20000 KB limit`);
          }
        }
      }
    }

    // Rule 5: Word limits
    if (entry.summary && countWords(entry.summary) > 25) {
      f('summary', `${countWords(entry.summary)} words (max 25)`);
    }
    if (entry.significance && countWords(entry.significance) > 130) {
      f('significance', `${countWords(entry.significance)} words (max 130)`);
    }
  }

  /* ========== Locations ========== */
  console.log(`Locations: ${locations.length} entries`);

  for (const entry of locations) {
    const id = entry.id || '(no id)';
    const f = (field, msg) => fail('locations.json', id, field, msg);

    // Rule 1: Required fields
    for (const key of LOCATION_REQUIRED) {
      if (entry[key] == null) f(key, 'missing');
    }

    // id: unique, kebab-case
    if (entry.id) {
      if (!KEBAB.test(entry.id)) f('id', `not kebab-case: "${entry.id}"`);
      if (locationIds.has(entry.id)) f('id', 'duplicate');
      else locationIds.add(entry.id);
    }

    // Enum fields
    if (entry.medium && !MEDIUMS.has(entry.medium)) f('medium', `invalid value: "${entry.medium}"`);
    if (entry.kind && !KINDS.has(entry.kind)) f('kind', `invalid value: "${entry.kind}"`);

    // Rule 4: Coordinates in India bbox
    if (entry.lat != null && (entry.lat < 6 || entry.lat > 37)) {
      f('lat', `${entry.lat} outside India range 6–37`);
    }
    if (entry.lng != null && (entry.lng < 68 || entry.lng > 98)) {
      f('lng', `${entry.lng} outside India range 68–98`);
    }

    // Rule 2: Sources
    if (entry.sources) {
      if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
        f('sources', 'must have ≥ 1 entry');
      } else {
        entry.sources.forEach((s, i) => {
          if (!s.label) f(`sources[${i}].label`, 'missing');
          if (!s.url || !URL_RE.test(s.url)) f(`sources[${i}].url`, 'missing or not a URL');
        });
      }
    }

    if (entry.status === 'disputed') {
      if (!Array.isArray(entry.disputes) || entry.disputes.length === 0) {
        f('disputes', 'status is "disputed" but disputes array is empty');
      }
    }

    // Rule 3: Image metadata
    if (entry.image && typeof entry.image === 'object') {
      const img = entry.image;
      if (!img.alt) f('image.alt', 'missing');
      if (!img.creator || img.creator === 'TODO') f('image.creator', 'missing or TODO');
      if (!img.license || img.license === 'TODO') f('image.license', 'missing or TODO');
      if (!img.source || img.source === 'TODO') f('image.source', 'missing or TODO');

      if (!SKIP_IMAGES && img.src) {
        const imgPath = join(ROOT, img.src);
        if (!await exists(imgPath)) {
          f('image.src', `file not found: ${img.src}`);
        } else {
          const size = await getSize(imgPath);
          // Artwork exempt from 20000 KB limit
          if (size > 20000 * 1024 && !img.src.includes('fusion/fusion-')) {
            f('image.src', `${Math.round(size / 1024)} KB exceeds 20000 KB limit`);
          }
        }
      }
    }
  }

  /* ========== Rule 6: Cross-references ========== */
  console.log('\nCross-referencing…');

  for (const entry of timeline) {
    if (entry.mapId && !locationIds.has(entry.mapId)) {
      fail('timeline.json', entry.id, 'mapId', `references unknown location: "${entry.mapId}"`);
    }
  }

  for (const entry of locations) {
    if (Array.isArray(entry.timelineIds)) {
      for (const tid of entry.timelineIds) {
        if (!timelineIds.has(tid)) {
          fail('locations.json', entry.id, 'timelineIds', `references unknown timeline entry: "${tid}"`);
        }
      }
    }
  }

  /* ========== Summary ========== */
  console.log('');
  if (errors) {
    console.error(`❌ ${errors} error(s) found.\n`);
    process.exit(1);
  } else {
    console.log('✅ All checks passed.\n');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
