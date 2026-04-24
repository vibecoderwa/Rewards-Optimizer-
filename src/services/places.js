// Nearby places via OpenStreetMap's Overpass API. Free, no key.
// We de-dupe by name+category so a chain with several OSM nodes collapses.

import { buildOverpassQuery, tagsToCategory, CATEGORY_ICONS } from '../data/categories.js';
import { distanceMeters } from './location.js';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

export async function fetchNearbyPlaces({ lat, lon }, radius = 400) {
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
