# Real card art (optional)

Drop an image named after each card's `id` in this folder and the app will
use it instead of the stylized SVG fallback.

## Filenames

The app tries `.png`, `.jpg`, `.jpeg`, then `.webp` (in that order) and
uses the first one it finds:

- `amex-gold.{png|jpg|jpeg|webp}`
- `amex-plat.{png|jpg|jpeg|webp}`
- `chase-csp.{png|jpg|jpeg|webp}`        ← Sapphire Preferred
- `venture-x.{png|jpg|jpeg|webp}`        ← Capital One Venture X
- `savor.{png|jpg|jpeg|webp}`            ← Capital One Savor
- `bilt-obsidian.{png|jpg|jpeg|webp}`    ← Bilt Obsidian

(IDs come from `src/data/cards.js` — change them there if you rename.)

## Recommended specs

- **Aspect:** 1.6 : 1 (standard credit card)
- **Size:** 880 × 550 px or larger — the app downscales as needed
- **Format:** PNG with transparent background works best, but JPG/PNG with
  the card photographed/rendered on white is fine

## Where to get card art

- Each issuer's product page usually has a high-res hero image
- For personal/test use, screenshotting and trimming is fine
- For a published app you'll want either licensed art (RewardCC, AwardWallet
  data feeds) or partnership artwork from the issuer

## After adding files

The change is automatic — just refresh the app. No code changes needed.
