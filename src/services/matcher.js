// Thin backwards-compat wrapper around the pure rewards engine.
// New code should import directly from '../engine/rewards.js'.

import { rankForCategory, formatMultiplier, formatMoney } from '../engine/rewards.js';

export { formatMultiplier, formatMoney };

export function rankCardsForCategory(category, ownedIds) {
  // Old shape was a flat array of { card, rule, effectivePct }.
  return rankForCategory(category, ownedIds).ranked.map(({ card, rule, rate }) => ({
    card, rule, effectivePct: rate,
  }));
}

export function estimateReturn(rule, basket) {
  if (!rule || !basket) return 0;
  // Old behavior used a flat 0.02 cpp for points cards. Keeps parity for any
  // call sites that haven't migrated to the engine's card-aware rate.
  const pv = rule.unit === 'pct' ? 0.01 : 0.02;
  return basket * rule.multiplier * pv;
}
