// Given a spend category and the user's wallet, find the best card.
// "Best" = highest expected $ back per dollar spent (multiplier × point value).

import { CARDS, POINT_VALUES } from '../data/cards.js';

// Return every rule that applies to a given category across the user's wallet,
// sorted best-first. Items are { card, rule, effectivePct }.
export function rankCardsForCategory(category, ownedIds) {
  const rows = [];
  for (const card of CARDS) {
    if (!ownedIds.includes(card.id)) continue;
    const rule = pickRule(card, category);
    if (!rule) continue;
    const pointValue = rule.unit === 'pct' ? 0.01 : (POINT_VALUES[card.id] ?? 0.01);
    const effectivePct = rule.multiplier * pointValue;
    rows.push({ card, rule, effectivePct });
  }
  return rows.sort((a, b) => b.effectivePct - a.effectivePct);
}

function pickRule(card, category) {
  return card.rules.find((r) => r.category === category)
      || card.rules.find((r) => r.category === 'default');
}

export function formatMultiplier(rule) {
  if (rule.unit === 'pct') return `${rule.multiplier}%`;
  return `${rule.multiplier}×`;
}

// "At your usual basket of $X, this card earns ~$Y"
export function estimateReturn(rule, basket) {
  const pv = rule.unit === 'pct' ? 0.01 : 0.02;
  return basket * rule.multiplier * pv;
}

export function formatMoney(n) {
  if (n < 0.1) return `+$${n.toFixed(2)}`;
  if (n < 10) return `+$${n.toFixed(2)}`;
  return `+$${Math.round(n)}`;
}
