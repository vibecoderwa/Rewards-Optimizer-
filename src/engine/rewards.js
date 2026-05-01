// Pure rewards engine — no React, no DOM, no Date.now(), no randomness.
// Implements:
//   FR-ENG-01  computeAll(state)         → totals + ranking
//   FR-ENG-02  monthlyTimeline(state)    → 12-month series
//   FR-ENG-03  bestCardForMerchant(...)  → live reco + runner-up + confidence
//   FR-ENG-04  determinism — same input, same output
//   FR-ENG-05  offline-capable — no network calls
//   FR-ENG-06  confidence on every recommendation
//
// Card rules come from /src/data/cards.js. Each card's `rules` array holds
// per-category multipliers in either points or cash; the engine resolves
// each (card, category) pair to a unit-normalized $-per-$ rate using the
// card's CPP (cents-per-point) for points cards, or the multiplier itself
// for cashback ones.

import { CARDS, POINT_VALUES } from '../data/cards.js';

// ─── Multiplier resolution (FR-CARD-02) ─────────────────────────────────────

// Per-category multiplier (raw, in the card's own unit) and its unit.
// Returns null if the card has no rule that applies (caller falls back to
// the card's "default" rule).
export function ruleFor(card, category) {
  return card.rules.find((r) => r.category === category)
      || card.rules.find((r) => r.category === 'default')
      || null;
}

// Convert a rule to a unit-normalized return rate ($ per $1 spent).
// For points: multiplier × CPP. For cash: multiplier / 100.
export function rateFor(card, rule, cppOverrides = {}) {
  if (!rule) return 0;
  if (rule.unit === 'pct') return rule.multiplier / 100;
  const cpp = cppOverrides[card.id] ?? POINT_VALUES[card.id] ?? 0.01;
  return rule.multiplier * cpp;
}

// ─── Best card for a single category (FR-ENG-03 + FR-ENG-06) ────────────────

// Rank ALL owned cards for a category and emit a confidence number.
// Confidence is the relative gap between #1 and #2, mapped into [0..1]:
//   gap / max(rate1, 0.001) — stable for tiny rates, capped at 1.
// "high" confidence == strong winner. "low" == within a hair of each other.
export function rankForCategory(category, ownedIds, opts = {}) {
  const cppOverrides = opts.cpp || {};
  const rows = [];
  for (const card of CARDS) {
    if (!ownedIds.includes(card.id)) continue;
    const rule = ruleFor(card, category);
    if (!rule) continue;
    const rate = rateFor(card, rule, cppOverrides);
    rows.push({ card, rule, rate });
  }
  rows.sort((a, b) => b.rate - a.rate);

  if (rows.length === 0) return { ranked: [], confidence: 0, gap: 0 };
  if (rows.length === 1) return { ranked: rows, confidence: 1, gap: rows[0].rate };

  const gap = rows[0].rate - rows[1].rate;
  const confidence = Math.max(0, Math.min(1, gap / Math.max(rows[0].rate, 1e-3)));
  return { ranked: rows, confidence, gap };
}

// FR-ENG-03 — best-card-for-merchant. Convenience wrapper over rankForCategory
// that names the runner-up and projects an expected reward against an
// optional basket size.
export function bestCardForMerchant({ category, ownedIds, basket = 0, cpp = {} }) {
  const { ranked, confidence, gap } = rankForCategory(category, ownedIds, { cpp });
  if (!ranked.length) return null;
  const [first, second] = ranked;
  return {
    bestCard:    first.card,
    bestRule:    first.rule,
    bestRate:    first.rate,
    runnerUp:    second?.card || null,
    runnerRate:  second?.rate || 0,
    confidence,
    gap,
    expectedReward: basket > 0 ? basket * first.rate : 0,
    upliftVsRunner: basket > 0 ? basket * gap : 0,
  };
}

// ─── computeAll (FR-ENG-01) ─────────────────────────────────────────────────

// state shape:
//   {
//     spend:        { [categoryId]: monthlyDollars },
//     ownedIds:     ['amex-gold', ...],
//     fees:         { [cardId]: annualFee },         (optional override)
//     cpp:          { [cardId]: dollarsPerPoint },   (optional override)
//     creditsUsed:  { [cardId]: { [creditId]: bool } },
//   }
//
// Returns rows-per-category, per-card totals (rewards/credits/fee/net),
// optimized total (best card per category), and overall ranking.
export function computeAll(state) {
  const { spend = {}, ownedIds = [], fees = {}, cpp = {}, creditsUsed = {} } = state;
  const owned = CARDS.filter((c) => ownedIds.includes(c.id));

  const rows = Object.keys(spend).map((catId) => {
    const monthly = spend[catId] || 0;
    const annual = monthly * 12;
    const per = {};
    let topRate = -Infinity;
    let secondRate = -Infinity;
    let winner = null;
    for (const card of owned) {
      const rule = ruleFor(card, catId);
      const rate = rateFor(card, rule, cpp);
      per[card.id] = { rate, rule, value: annual * rate };
      if (rate > topRate) { secondRate = topRate; topRate = rate; winner = card.id; }
      else if (rate > secondRate) { secondRate = rate; }
    }
    return {
      categoryId: catId,
      monthly, annual, per,
      winner,
      gap: Math.max(0, topRate - (secondRate === -Infinity ? 0 : secondRate)),
    };
  });

  const cards = {};
  for (const card of owned) {
    const rewards = rows.reduce((s, r) => s + (r.per[card.id]?.value || 0), 0);
    const captured = creditsUsed[card.id] || {};
    const credits = (card.credits || []).reduce(
      (s, c) => s + (captured[c.id] ? (c.annual || 0) : 0), 0,
    );
    const fee = fees[card.id] ?? card.feeAnnual ?? 0;
    cards[card.id] = { rewards, credits, fee, net: rewards + credits - fee };
  }

  const optimizedRewards = rows.reduce(
    (s, r) => s + Math.max(0, ...owned.map((c) => r.per[c.id]?.value || 0)),
    0,
  );
  const totalCredits = owned.reduce((s, c) => s + cards[c.id].credits, 0);
  const totalFees    = owned.reduce((s, c) => s + cards[c.id].fee, 0);
  const optimizedNet = optimizedRewards + totalCredits - totalFees;

  const ranking = owned
    .map((c) => ({ id: c.id, card: c, ...cards[c.id] }))
    .sort((a, b) => b.net - a.net);

  return {
    rows,
    cards,
    ranking,
    optimizedRewards,
    optimizedNet,
    realizedNet: ranking.reduce((s, r) => s + r.net, 0),
    delta: ranking.length > 1 ? ranking[0].net - ranking[1].net : 0,
    leftOnTable: optimizedRewards - ranking.reduce((s, r) => s + r.rewards, 0),
  };
}

// ─── monthlyTimeline (FR-ENG-02) ────────────────────────────────────────────

// Returns 12 entries shaped { month, realized, optimal } so the chart
// matches the FR-HOME-04/05 realized-vs-potential framing.
export function monthlyTimeline(state) {
  const { spend = {}, ownedIds = [], cpp = {} } = state;
  const owned = CARDS.filter((c) => ownedIds.includes(c.id));
  const months = [];
  for (let i = 0; i < 12; i += 1) {
    const monthDate = new Date(Date.UTC(2026, i, 1));
    let realized = 0;
    let optimal = 0;
    for (const catId of Object.keys(spend)) {
      const monthlySpend = spend[catId] || 0;
      // Realized: best owned card's rate for this category (we don't track
      // *which* card the user actually swiped; the optimizer's premise is
      // that the user uses the recommended card, so realized == optimal
      // until we have transaction data to ground-truth it).
      const rates = owned.map((c) => rateFor(c, ruleFor(c, catId), cpp));
      const best = Math.max(0, ...rates);
      realized += monthlySpend * best;
      optimal  += monthlySpend * best;
    }
    months.push({
      month: monthDate.toISOString().slice(0, 7),
      realized,
      optimal,
    });
  }
  return months;
}

// ─── Display helpers (no logic, no state) ───────────────────────────────────

export function formatMultiplier(rule) {
  if (!rule) return '—';
  if (rule.unit === 'pct') return `${rule.multiplier}%`;
  return `${rule.multiplier}×`;
}

export function formatMoney(n) {
  if (n == null) return '';
  if (n < 0.1)  return `+$${n.toFixed(2)}`;
  if (n < 10)   return `+$${n.toFixed(2)}`;
  return `+$${Math.round(n)}`;
}

// FR-HOME-07 — render hint. Maps the [0..1] confidence into a 4-step bucket
// the UI can consume with a small bar/dot pattern.
export function confidenceTier(confidence) {
  if (confidence >= 0.5)  return 'high';
  if (confidence >= 0.25) return 'medium';
  if (confidence >  0.05) return 'low';
  return 'tied';
}
