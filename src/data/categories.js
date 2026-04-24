// Map OpenStreetMap tags -> Swipewise spend categories.
// Overpass returns places tagged with things like amenity=restaurant,
// shop=supermarket, etc. We flatten those into a handful of reward categories.

export const CATEGORY_LABELS = {
  groceries:     'Groceries',
  dining:        'Dining',
  flights:       'Flights',
  travel:        'Travel',
  hotels:        'Hotels',
  gas:           'Gas',
  transit:       'Transit',
  streaming:     'Streaming',
  entertainment: 'Entertainment',
  rent:          'Rent',
  default:       'Everything else',
};

export const CATEGORY_ICONS = {
  groceries:     '🛒',
  dining:        '🍽',
  flights:       '✈︎',
  travel:        '🧳',
  hotels:        '🏨',
  gas:           '⛽',
  transit:       '🚆',
  streaming:     '📺',
  entertainment: '🎟',
  rent:          '🏠',
  default:       '•',
};

// OSM tag -> category. Keys are "key=value" strings from Overpass output.
const TAG_MAP = {
  'shop=supermarket':   'groceries',
  'shop=convenience':   'groceries',
  'shop=greengrocer':   'groceries',
  'shop=butcher':       'groceries',
  'shop=bakery':        'groceries',
  'amenity=restaurant': 'dining',
  'amenity=fast_food':  'dining',
  'amenity=cafe':       'dining',
  'amenity=bar':        'dining',
  'amenity=pub':        'dining',
  'amenity=food_court': 'dining',
  'amenity=ice_cream':  'dining',
  'amenity=fuel':       'gas',
  'aeroway=aerodrome':  'flights',
  'aeroway=terminal':   'flights',
  'tourism=hotel':      'hotels',
  'tourism=motel':      'hotels',
  'tourism=guest_house':'hotels',
  'railway=station':    'transit',
  'amenity=bus_station':'transit',
  'amenity=cinema':     'entertainment',
  'amenity=theatre':    'entertainment',
  'leisure=stadium':    'entertainment',
};

export function tagsToCategory(tags) {
  if (!tags) return 'default';
  for (const [k, v] of Object.entries(tags)) {
    const hit = TAG_MAP[`${k}=${v}`];
    if (hit) return hit;
  }
  return 'default';
}

// Overpass query: everything within `radius` meters of lat/lon that we
// care about.  Output is JSON-ish ("out:json"), max 40 results.
export function buildOverpassQuery(lat, lon, radius = 400) {
  const around = `around:${radius},${lat},${lon}`;
  const wanted = [
    'shop~"^(supermarket|convenience|greengrocer|butcher|bakery)$"',
    'amenity~"^(restaurant|fast_food|cafe|bar|pub|food_court|ice_cream|fuel|cinema|theatre|bus_station)$"',
    'aeroway~"^(aerodrome|terminal)$"',
    'tourism~"^(hotel|motel|guest_house)$"',
    'railway=station',
    'leisure=stadium',
  ];
  const clauses = wanted
    .map((w) => `  node[${w}](${around});\n  way[${w}](${around});`)
    .join('\n');
  return `
[out:json][timeout:15];
(
${clauses}
);
out center 40;
  `.trim();
}
