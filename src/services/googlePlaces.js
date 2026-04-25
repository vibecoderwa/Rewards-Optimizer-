// Google Places (New) API client — opt-in alternative to OSM/Overpass.
//
// Three layers of cost protection:
//   1. The single point that matters: a hard quota cap set in Google Cloud
//      Console (Maps SKU "Nearby Search Pro" → 165 req/day). Google itself
//      enforces it; even buggy code can't bill you.
//   2. Aggressive 24h cache keyed by rounded lat/lon — reopening the app at
//      the same spot is free.
//   3. localStorage monthly counter capped at 4500 (90% of the 5k free
//      tier). Belt-and-suspenders against the cap; not a real safety net
//      since it's per-device and clearable.
//
// If no API key is configured, the module throws so the orchestrator can
// fall back to OSM.

import { CATEGORY_ICONS } from '../data/categories.js';
import { distanceMeters } from './location.js';
import { tagsToCategory } from '../data/categories.js';

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY || '';
const ENDPOINT = 'https://places.googleapis.com/v1/places:searchNearby';
const FIELD_MASK = 'places.id,places.displayName,places.types,places.location';

// Free tier is 5,000 Nearby Search Pro calls/mo. Stop at 4500 to leave
// headroom in case the user has multiple devices or clears storage.
const MONTHLY_CAP = 4500;

// Round to 3 decimals (~110 m). Good enough that walking around the same
// block reuses cached results, but small enough that real movement
// invalidates the cache.
const COORD_PRECISION = 3;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const INCLUDED_TYPES = [
  'restaurant', 'cafe', 'bar', 'bakery', 'meal_delivery', 'meal_takeaway',
  'supermarket', 'grocery_store', 'convenience_store',
  'gas_station',
  'pharmacy', 'drugstore',
  'airport',
  'lodging', 'hotel', 'motel',
  'bus_station', 'train_station', 'subway_station', 'transit_station',
  'movie_theater', 'stadium',
  'department_store',
];

// Google place type -> our internal category. Brand overrides still apply
// after this via tagsToCategory below.
const TYPE_MAP = {
  restaurant:        'dining',
  cafe:              'dining',
  bar:               'dining',
  bakery:            'dining',
  meal_delivery:     'dining',
  meal_takeaway:     'dining',
  supermarket:       'groceries',
  grocery_store:     'groceries',
  convenience_store: 'groceries',
  gas_station:       'gas',
  pharmacy:          'drugstore',
  drugstore:         'drugstore',
  airport:           'flights',
  international_airport: 'flights',
  lodging:           'hotels',
  hotel:             'hotels',
  motel:             'hotels',
  bus_station:       'transit',
  train_station:     'transit',
  subway_station:    'transit',
  transit_station:   'transit',
  light_rail_station:'transit',
  movie_theater:     'entertainment',
  stadium:           'entertainment',
  performing_arts_theater: 'entertainment',
  department_store:  'warehouse',
};

function monthKey() {
  const d = new Date();
  return `gp_count:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function readCount() {
  try { return parseInt(localStorage.getItem(monthKey()) || '0', 10) || 0; }
  catch { return 0; }
}

function bumpCount() {
  try { localStorage.setItem(monthKey(), String(readCount() + 1)); } catch { /* ignore */ }
}

export function getMonthlyUsage() {
  return { used: readCount(), cap: MONTHLY_CAP };
}

function cacheKey(lat, lon, radius) {
  const rl = lat.toFixed(COORD_PRECISION);
  const rn = lon.toFixed(COORD_PRECISION);
  return `gp_cache:${rl}:${rn}:${radius}`;
}

function readCache(lat, lon, radius) {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon, radius));
    if (!raw) return null;
    const { ts, places } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return places;
  } catch { return null; }
}

function writeCache(lat, lon, radius, places) {
  try {
    localStorage.setItem(
      cacheKey(lat, lon, radius),
      JSON.stringify({ ts: Date.now(), places }),
    );
  } catch { /* quota full → ignore */ }
}

// Map a Google place to the same shape places.js produces from OSM.
function normalizePlace(p, me) {
  const name = p.displayName?.text || '';
  const types = p.types || [];
  // Pick the first type we recognize — Google returns ordered specificity.
  let category = 'default';
  for (const t of types) {
    if (TYPE_MAP[t]) { category = TYPE_MAP[t]; break; }
  }
  // Brand overrides apply on top (Walmart→warehouse, etc.). Pass a fake
  // tags object so tagsToCategory's brand-override path runs.
  const overridden = tagsToCategory({ name });
  if (overridden !== 'default') category = overridden;

  return {
    id: `g-${p.id}`,
    name,
    category,
    icon: CATEGORY_ICONS[category] || CATEGORY_ICONS.default,
    lat: p.location?.latitude,
    lon: p.location?.longitude,
    distance: p.location ? distanceMeters(me, { lat: p.location.latitude, lon: p.location.longitude }) : null,
    tags: { name, types: types.join(',') },
  };
}

export async function fetchNearbyPlacesGoogle({ lat, lon }, radius = 700) {
  if (!API_KEY) {
    throw new Error('GOOGLE_KEY_MISSING');
  }

  const cached = readCache(lat, lon, radius);
  if (cached) return cached;

  if (readCount() >= MONTHLY_CAP) {
    throw new Error('GOOGLE_CAP_HIT');
  }

  const body = {
    includedTypes: INCLUDED_TYPES,
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lon },
        radius: Math.min(radius, 50000),
      },
    },
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  });
  bumpCount();

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Google Places ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  const places = (data.places || [])
    .map((p) => normalizePlace(p, { lat, lon }))
    .filter((p) => p.lat && p.lon)
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

  writeCache(lat, lon, radius, places);
  return places;
}

export const HAS_GOOGLE_KEY = !!API_KEY;
