# Visual audit — FR-VIS-01..04

Audit of the current build against the four "Anti-loud aesthetic" rules in
`docs/REQUIREMENTS.html` §13.5. Catalogued, not fixed — each item has a
proposed remedy and a priority.

---

## FR-VIS-01 — Monochrome by default; accents only as state

**Current state: mostly compliant.** Body text, lists, and chrome render in
ink-on-paper. Accent colors appear primarily as state indicators
(recommendation = lemon, on-track = mint, expiring = coral, geo = sky).

**Open issues:**
- **Landing screen** uses multiple accents decoratively in the receipt-row
  preview (`src/screens/Landing.jsx:107-108`) — sky + lemon + amex + chase
  in adjacent rows. Marketing-leaning, but technically a violation.

---

## FR-VIS-02 — One accent per screen

**Current state: partial.**

| Screen | Status | Notes |
|---|---|---|
| Home / GeoList | ✓ | Single lemon accent on the selected row |
| Home / GeoBanner | ✗ | Mint banner + lemon callout circle + lemon highlight in body — three accent surfaces in one view |
| Settings | borderline | Mint Toggle when on, plus sky / cream / coral CTAs. Each is a single state-coded button so it's defensible, but reads busy |
| Landing | ✗ | Multiple accents in the receipt-row preview |
| Onboarding | needs review | Likely mixes lemon CTA with sky/mint highlights |

**Proposed fixes:**
- GeoBanner: drop the lemon body-text highlight; keep either the mint
  banner OR the lemon callout, not both.
- Landing: monochrome the receipt rows; rely on type weight + tiny issuer
  stripes for visual variety instead of color fills.

---

## FR-VIS-03 — No gradients; solid fills only

**Current state: zero violations in UI chrome.**

All `linear-gradient` / `radial-gradient` usages live in image-like
contexts where a real-world rendering is expected:

- `src/design/CardArt.jsx` — 12 preset gradients are credit-card
  *photographs/illustrations*, drawn to look like real cards. Not UI
  chrome.
- `src/screens/Insights.jsx` `LockGallery` & `NotifGallery` — gradients
  inside iPhone lock-screen prefabs. Not Swipewise UI; a *render of iOS*.
- `src/screens/Push.jsx` — same exemption: iPhone lock-screen mock
  background.

**No action needed.** Worth keeping the rule in mind as new screens land.

---

## FR-VIS-04 — Issuer colors as small marks only (2px stripe / label dot)

**Current state: multiple violations.** This is the biggest gap.

| Location | Severity | Issue |
|---|---|---|
| `src/design/atoms.jsx:45-46` `CardSwatch` | 🔴 high | Full square fill in issuer color. Used everywhere as a card chip. |
| `src/design/atoms.jsx:74-92` `CardSticker` | 🟠 med | Card-sized fill in issuer color. Used in onboarding card preview. |
| `src/design/widgets.jsx:159-161` `MediumA` | 🔴 high | Bar chart with three issuer-colored fills (Gold/Reserve/Savor) |
| `src/design/widgets.jsx:195` (AMEX badge) | 🟠 med | Badge with amex-color fill behind "AMEX" text |
| `src/screens/Push.jsx:99` (network badge) | 🟢 low | Logo-style fill, reads as "logo on the card" |
| `src/screens/Landing.jsx:107-108` (receipt pills) | 🟠 med | Pills filled in amex/chase color |
| `src/design/widgets.jsx:46-48, 164-166` (legend dots) | ✓ | Small swatches as legend marks — FR-VIS-04 explicitly permits this |

**Proposed fixes (priority order):**

1. **CardSwatch refactor** — replace full-fill chip with an ink-on-paper
   chip plus a 2px issuer stripe at the top edge. Touches 5+ screens, biggest
   visual win.
2. **Widget bar chart** — replace issuer-color bars with ink + hairline
   patterns. Use type weight to distinguish cards instead of hue.
3. **Landing receipt pills** — ink-on-paper pill with tiny issuer stripe
   on the left edge.
4. **CardSticker** — convert to a thin wrapper around `CardArt` so the
   onboarding card preview matches the rest of the app's "real card"
   treatment.
5. **AMEX badge in MediumA** — flip to ink-on-paper with the issuer color
   as a 2px stripe.

---

## Recommendation

These are visual-language changes, not bug fixes. Best approached as
**one focused PR** that touches `atoms.jsx` + `widgets.jsx` together, with
before/after screenshots, rather than threaded through other feature
work. The CardSwatch refactor alone propagates to most screens.

If we want to proceed: implement #1 (CardSwatch) first as a single focused
change, verify it reads well in context, then batch #2-#5.
