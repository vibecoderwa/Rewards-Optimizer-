// Card rules for the 6 cards you listed.
// multiplier: how many points / % back per $ in that category
// unit: "pts" for points, "pct" for cash back
// cap: annual spend cap that still earns the multiplier (null = unlimited)
// notes: human-readable context shown in the UI
//
// Edit this file to add new cards or tweak rates. The app reads from it
// at runtime — no rebuild needed when running in the browser, just a
// cap sync when running on iPhone.

export const CARDS = [
  {
    id: 'amex-gold',
    brand: 'amex',
    name: 'Amex Gold',
    short: 'Gold',
    fee: '$325/yr',
    color: '#AE8B3B',
    rules: [
      { category: 'groceries',  multiplier: 4, unit: 'pts', cap: 25000, notes: '4× Membership Rewards at US supermarkets (up to $25k/yr)' },
      { category: 'dining',     multiplier: 4, unit: 'pts', cap: 50000, notes: '4× MR at restaurants worldwide (up to $50k/yr)' },
      { category: 'flights',    multiplier: 3, unit: 'pts', cap: null,  notes: '3× MR on flights booked direct or via Amex Travel' },
      { category: 'default',    multiplier: 1, unit: 'pts', cap: null,  notes: '1× MR on everything else' },
    ],
    perks: ['$10/mo Uber Cash', '$10/mo dining credit (select brands)', '$7/mo Dunkin credit'],
  },
  {
    id: 'amex-plat',
    brand: 'amex',
    name: 'Amex Platinum',
    short: 'Plat',
    fee: '$695/yr',
    color: '#6B6B6B',
    rules: [
      { category: 'flights', multiplier: 5, unit: 'pts', cap: 500000, notes: '5× MR on flights booked direct or via Amex Travel' },
      { category: 'hotels',  multiplier: 5, unit: 'pts', cap: null,   notes: '5× MR on prepaid hotels via Amex Travel' },
      { category: 'default', multiplier: 1, unit: 'pts', cap: null,   notes: '1× MR on everything else' },
    ],
    perks: ['$200/yr airline fee credit', '$200/yr Uber Cash', 'Centurion lounge access', 'TSA PreCheck/Global Entry credit'],
  },
  {
    id: 'chase-csp',
    brand: 'chase',
    name: 'Chase Sapphire Preferred',
    short: 'Preferred',
    fee: '$95/yr',
    color: '#2B4468',
    rules: [
      { category: 'travel',     multiplier: 5, unit: 'pts', cap: null, notes: '5× Ultimate Rewards on travel via Chase portal' },
      { category: 'dining',     multiplier: 3, unit: 'pts', cap: null, notes: '3× UR on dining (incl. takeout + delivery)' },
      { category: 'streaming',  multiplier: 3, unit: 'pts', cap: null, notes: '3× UR on select streaming services' },
      { category: 'groceries',  multiplier: 3, unit: 'pts', cap: null, notes: '3× UR on online groceries (not Walmart/Target)' },
      { category: 'flights',    multiplier: 2, unit: 'pts', cap: null, notes: '2× UR on other travel purchases' },
      { category: 'default',    multiplier: 1, unit: 'pts', cap: null, notes: '1× UR on everything else' },
    ],
    perks: ['$50/yr hotel credit via portal', '25% boost on UR redemptions via portal'],
  },
  {
    id: 'venture-x',
    brand: 'savor',
    name: 'Capital One Venture X',
    short: 'Venture X',
    fee: '$395/yr',
    color: '#004B87',
    rules: [
      { category: 'travel',  multiplier: 10, unit: 'pts', cap: null, notes: '10× miles on hotels/rental cars via Capital One Travel' },
      { category: 'flights', multiplier: 5,  unit: 'pts', cap: null, notes: '5× miles on flights via Capital One Travel' },
      { category: 'default', multiplier: 2,  unit: 'pts', cap: null, notes: '2× miles on everything else' },
    ],
    perks: ['$300/yr travel credit via portal', '10k anniversary bonus miles', 'Priority Pass + Capital One lounges'],
  },
  {
    id: 'savor',
    brand: 'savor',
    name: 'Capital One Savor',
    short: 'Savor',
    fee: '$95/yr',
    color: '#7A3848',
    rules: [
      { category: 'dining',        multiplier: 4, unit: 'pct', cap: null, notes: '4% cash back on dining' },
      { category: 'entertainment', multiplier: 4, unit: 'pct', cap: null, notes: '4% cash back on entertainment' },
      { category: 'streaming',     multiplier: 4, unit: 'pct', cap: null, notes: '4% cash back on popular streaming' },
      { category: 'groceries',     multiplier: 3, unit: 'pct', cap: null, notes: '3% on groceries (excludes Walmart, Target, Costco)' },
      { category: 'default',       multiplier: 1, unit: 'pct', cap: null, notes: '1% cash back on everything else' },
    ],
    perks: [],
  },
  {
    id: 'bilt-obsidian',
    brand: 'chase',
    name: 'Bilt Obsidian',
    short: 'Bilt',
    fee: '$95/yr',
    color: '#111111',
    rules: [
      // Cardholder picks ONE bonus category at 3× — dining OR groceries.
      // Owner selected DINING.
      { category: 'dining',    multiplier: 3, unit: 'pts', cap: null,  notes: '3× points on dining (selected bonus category)' },
      { category: 'groceries', multiplier: 1, unit: 'pts', cap: null,  notes: '1× — bonus category was set to dining instead' },
      { category: 'travel',    multiplier: 2, unit: 'pts', cap: null,  notes: '2× points on travel' },
      { category: 'default',   multiplier: 1, unit: 'pts', cap: null,  notes: '1× point on everyday spend' },
    ],
    perks: ['Pay rent with credit card, no fee', 'Rent Day 2× on non-rent (1st of month)'],
  },
];

// Rough dollar-value per point for quick "$ saved" math.
// These are conservative transferable-partner averages — update if you care.
export const POINT_VALUES = {
  'amex-gold':     0.02,
  'amex-plat':     0.02,
  'chase-csp':     0.0175,
  'venture-x':     0.0175,
  'savor':         0.01,
  'bilt-obsidian': 0.021,
};
