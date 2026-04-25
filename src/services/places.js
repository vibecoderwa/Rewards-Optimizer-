// Nearby places — orchestrator. Default is OSM (Overpass, free).
// If the user enables Google Places in Settings AND a key is configured,
// we try Google first (richer coverage, especially for small/independent
// businesses) and fall back to OSM on cap-hit, missing key, or error.

import { buildOverpassQuery, tagsToCategory, CATEGORY_ICONS } from '../data/categories.js';
import { distanceMeters } from './location.js';
import { fetchNearbyPlacesGoogle, HAS_GOOGLE_KEY } from './googlePlaces.js';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

export async function fetchNearbyPlaces({ lat, lon }, radius = 400, opts = {}) {
  // Caller can opt in via opts.useGoogle; we silently ignore if no key.
  if (opts.useGoogle && HAS_GOOGLE_KEY) {
    try {
      return await fetchNearbyPlacesGoogle({ lat, lon }, radius);
    } catch (e) {
      // GOOGLE_CAP_HIT, network failure, etc. — fall through to OSM so
      // the user always sees something instead of a hard error.
      console.warn('[places] Google fallback to OSM:', e.message);
    }
  }
  return fetchNearbyPlacesOSM({ lat, lon }, radius);
}

async function fetchNearbyPlacesOSM({ lat, lon }, radius = 400) {
  const body = buildOverpassQuery(lat, lon, radius);
  let lastErr;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'text/plain' },
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = await res.json();
      return normalize(json.elements || [], { lat, lon });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Overpass unreachable');
}

function normalize(elements, me) {
  const seen = new Map();
  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name;
    if (!name) continue;
    const category = tagsToCategory(tags);
    const pt = el.type === 'node'
      ? { lat: el.lat, lon: el.lon }
      : el.center ? { lat: el.center.lat, lon: el.center.lon } : null;
    if (!pt) continue;
    const distance = distanceMeters(me, pt);
    const key = `${name}::${category}`;
    const prev = seen.get(key);
    if (!prev || distance < prev.distance) {
      seen.set(key, {
        id: `${el.type}-${el.id}`,
        name,
        category,
        icon: CATEGORY_ICONS[category] || CATEGORY_ICONS.default,
        lat: pt.lat, lon: pt.lon,
        distance,
        tags,
      });
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.distance - b.distance);
}
