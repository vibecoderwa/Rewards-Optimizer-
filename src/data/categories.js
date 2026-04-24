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
  warehouse:     'Warehouse club',
  drugstore:     'Drugstore',
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
  warehouse:     '📦',
  drugstore:     '💊',
  default:       '•',
};

// OSM tag -> category. Keys are "key=value" strings from Overpass output.
const TAG_MAP = {
  'shop=supermarket':       'groceries',
  'shop=convenience':       'groceries',
  'shop=greengrocer':       'groceries',
  'shop=butcher':           'groceries',
  'shop=bakery':            'groceries',
  'shop=wholesale':         'warehouse',
  'shop=department_store':  'warehouse',
  'shop=chemist':           'drugstore',
  'amenity=pharmacy':       'drugstore',
  'amenity=restaurant':     'dining',
  'amenity=fast_food':      'dining',
  'amenity=cafe':           'dining',
  'amenity=bar':            'dining',
  'amenity=pub':            'dining',
  'amenity=food_court':     'dining',
  'amenity=ice_cream':      'dining',
  'amenity=fuel':           'gas',
  'aeroway=aerodrome':      'flights',
  'aeroway=terminal':       'flights',
  'tourism=hotel':          'hotels',
  'tourism=motel':          'hotels',
  'tourism=guest_house':    'hotels',
  'railway=station':        'transit',
  'amenity=bus_station':    'transit',
  'amenity=cinema':         'entertainment',
  'amenity=theatre':        'entertainment',
  'leisure=stadium':        'entertainment',
};

// Brand-name overrides applied AFTER OSM-tag classification.
// OSM is generic ("shop=supermarket"), but issuer rules are brand-specific
// (Amex Gold groceries excludes Walmart/Target/Costco). Patterns are matched
// case-insensitively against the place's `name` tag — first hit wins.
const BRAND_OVERRIDES = [
  // Warehouse clubs — usually excluded from supermarket bonuses, so route
  // them to a category no card rules touch (falls through to default).
  { pattern: /\b(walmart|target|costco|sam'?s club|bj'?s wholesale)\b/i, category: 'warehouse' },

  // Drugstores — own category for future card additions (Freedom Flex etc.)
  { pattern: /\b(cvs|walgreens|rite aid|duane reade)\b/i, category: 'drugstore' },

  // Force-classify true grocers even if OSM tag is wonky (organic, deli, etc.)
  { pattern: /\b(whole foods|trader joe'?s|wegmans|publix|kroger|safeway|h-?e-?b|aldi|sprouts|food lion|giant eagle)\b/i, category: 'groceries' },

  // Big-brand gas stations — OSM occasionally tags them as convenience stores
  { pattern: /\b(shell|chevron|mobil|exxon|bp|sunoco|valero|arco|76|conoco|phillips 66|marathon|speedway|wawa|sheetz|quiktrip|circle k|7-eleven)\b/i, category: 'gas' },

  // Coffee chains - reliably "dining" even if OSM marks them as something else
  { pattern: /\b(starbucks|dunkin|peet'?s|tim hortons|blue bottle)\b/i, category: 'dining' },
];

function brandOverride(name) {
  if (!name) return null;
  for (const { pattern, category } of BRAND_OVERRIDES) {
    if (pattern.test(name)) return category;
  }
  return null;
}

export function tagsToCategory(tags) {
  if (!tags) return 'default';
  // Brand override beats OSM tags — chain identity is more reliable than
  // OSM's free-form classification.
  const override = brandOverride(tags.name);
  if (override) return override;
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
    // Groceries + warehouse clubs (warehouse routed via brand overrides)
    'shop~"^(supermarket|convenience|greengrocer|butcher|bakery|wholesale|department_store)$"',
    // Drugstores (CVS/Walgreens are usually shop=chemist; some are amenity=pharmacy)
    'shop=chemist',
    'amenity~"^(restaurant|fast_food|cafe|bar|pub|food_court|ice_cream|fuel|cinema|theatre|bus_station|pharmacy)$"',
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
