import React, { useState } from 'react';
import { T } from './tokens.js';

// Realistic-ish card art that:
//   1. Tries to load /cards/<id>.png first (real artwork if you drop it in)
//   2. Falls back to a stylized SVG that includes brand color, EMV chip,
//      contactless symbol, network logo, embossed numbers, and the issuer
//      wordmark — close enough that people recognize their card.
//
// Drop real images at /public/cards/<card-id>.png to upgrade automatically.
// Recommended size: 880x550 px (standard credit-card aspect 1.6:1).

const PRESETS = {
  'amex-gold': {
    bg: 'linear-gradient(135deg, #B89043 0%, #8E6B26 50%, #C9A04C 100%)',
    fg: '#1f1810', subtle: 'rgba(31,24,16,0.55)',
    issuer: 'American Express', tier: 'GOLD',
    network: 'amex', chipColor: '#E8C870',
  },
  'amex-plat': {
    bg: 'linear-gradient(135deg, #C2C9D2 0%, #8C95A0 50%, #DDE1E6 100%)',
    fg: '#1a1a1a', subtle: 'rgba(26,26,26,0.55)',
    issuer: 'American Express', tier: 'PLATINUM',
    network: 'amex', chipColor: '#D4D7DC',
  },
  'chase-csp': {
    bg: 'linear-gradient(135deg, #1B3A5C 0%, #0E223A 100%)',
    fg: '#fff', subtle: 'rgba(255,255,255,0.65)',
    issuer: 'Chase', tier: 'SAPPHIRE PREFERRED',
    network: 'visa', chipColor: '#D8C275',
  },
  'venture-x': {
    bg: 'linear-gradient(135deg, #042B4A 0%, #001627 100%)',
    fg: '#fff', subtle: 'rgba(255,255,255,0.65)',
    issuer: 'Capital One', tier: 'VENTURE X',
    network: 'visa', chipColor: '#D8C275',
  },
  'savor': {
    bg: 'linear-gradient(135deg, #5C2330 0%, #34121A 100%)',
    fg: '#fff', subtle: 'rgba(255,255,255,0.65)',
    issuer: 'Capital One', tier: 'SAVOR',
    network: 'mastercard', chipColor: '#D8C275',
  },
  'bilt-obsidian': {
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #000 60%)',
    fg: '#fff', subtle: 'rgba(255,255,255,0.55)',
    issuer: 'Bilt', tier: 'OBSIDIAN',
    network: 'mastercard', chipColor: '#D8C275',
  },
};

const EXTS = ['png', 'jpg', 'jpeg', 'webp'];

export default function CardArt({ id, last4 = '0421', width = 320, rotate = 0, style = {} }) {
  const [extIdx, setExtIdx] = useState(0);
  const preset = PRESETS[id] || PRESETS['amex-gold'];
  const height = Math.round(width * 0.62); // close to ISO/IEC 7810 ID-1 ratio

  // Try real artwork from /cards/<id>.<ext>, falling back across extensions
  // before giving up and rendering the SVG.
  if (extIdx < EXTS.length) {
    return (
      <img
        src={`/cards/${id}.${EXTS[extIdx]}`}
        alt={preset.tier}
        onError={() => setExtIdx((i) => i + 1)}
        style={{
          width, height, borderRadius: 14, display: 'block',
          boxShadow: `0 1px 2px rgba(0,0,0,0.15), 3px 5px 0 0 ${T.ink}`,
          border: `1.5px solid ${T.ink}`,
          transform: `rotate(${rotate}deg)`,
          objectFit: 'cover',
          ...style,
        }}
      />
    );
  }

  return (
    <div style={{
      width, height, borderRadius: 14, position: 'relative', overflow: 'hidden',
      background: preset.bg, color: preset.fg,
      border: `1.5px solid ${T.ink}`,
      boxShadow: `3px 5px 0 0 ${T.ink}`,
      transform: `rotate(${rotate}deg)`,
      fontFamily: T.body,
      ...style,
    }}>
      {/* Subtle texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.45), transparent 50%)',
      }} />

      {/* Issuer top-left */}
      <div style={{
        position: 'absolute', top: width * 0.05, left: width * 0.05,
        fontSize: width * 0.045, fontWeight: 700, letterSpacing: 1.2,
        textTransform: 'uppercase', color: preset.subtle,
      }}>{preset.issuer}</div>

      {/* Network logo top-right */}
      <div style={{
        position: 'absolute', top: width * 0.045, right: width * 0.05,
      }}>
        <NetworkLogo network={preset.network} fg={preset.fg} subtle={preset.subtle} size={width * 0.13} />
      </div>

      {/* EMV chip + contactless */}
      <div style={{
        position: 'absolute', left: width * 0.05, top: width * 0.22,
        display: 'flex', alignItems: 'center', gap: width * 0.04,
      }}>
        <Chip size={width * 0.13} color={preset.chipColor} />
        <Contactless size={width * 0.09} fg={preset.fg} />
      </div>

      {/* Embossed-style number */}
      <div className="mono" style={{
        position: 'absolute', left: width * 0.05, bottom: width * 0.18,
        fontSize: width * 0.062, fontWeight: 600, letterSpacing: width * 0.012,
        color: preset.fg, textShadow: '0 1px 0 rgba(0,0,0,0.15)',
      }}>
        •••• •••• •••• {last4.slice(-4)}
      </div>

      {/* Tier wordmark bottom-left */}
      <div style={{
        position: 'absolute', left: width * 0.05, bottom: width * 0.05,
        fontSize: width * 0.055, fontWeight: 800, letterSpacing: 1.5,
        color: preset.fg,
      }}>{preset.tier}</div>
    </div>
  );
}

function Chip({ size = 36, color = '#D8C275' }) {
  // Stylized EMV chip — gold square with inset contact pattern.
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 36 28">
      <rect x="0" y="0" width="36" height="28" rx="3.5" fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
      <g stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" fill="none">
        <path d="M0 8 H10 M0 14 H10 M0 20 H10" />
        <path d="M26 8 H36 M26 14 H36 M26 20 H36" />
        <rect x="11" y="4" width="14" height="20" rx="2" fill="rgba(255,255,255,0.18)" />
        <line x1="18" y1="4" x2="18" y2="24" />
        <line x1="11" y1="14" x2="25" y2="14" />
      </g>
    </svg>
  );
}

function Contactless({ size = 26, fg = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: 0.85 }}>
      <g fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round">
        <path d="M7 8 a8 8 0 0 1 0 8" />
        <path d="M11 5 a13 13 0 0 1 0 14" />
        <path d="M15 2 a18 18 0 0 1 0 20" />
      </g>
    </svg>
  );
}

function NetworkLogo({ network, fg, subtle, size = 50 }) {
  if (network === 'amex') {
    return (
      <div style={{
        background: '#fff', color: '#0066B2', borderRadius: 4,
        padding: `${size * 0.08}px ${size * 0.18}px`,
        fontSize: size * 0.32, fontWeight: 900, letterSpacing: 1.2,
        border: '1px solid rgba(0,0,0,0.08)',
        textTransform: 'uppercase', fontFamily: 'Helvetica, Arial, sans-serif',
      }}>AMEX</div>
    );
  }
  if (network === 'visa') {
    return (
      <div style={{
        color: fg, fontStyle: 'italic', fontSize: size * 0.55, fontWeight: 900,
        letterSpacing: -1, fontFamily: 'Georgia, serif',
      }}>VISA</div>
    );
  }
  if (network === 'mastercard') {
    return (
      <svg width={size} height={size * 0.62} viewBox="0 0 50 31">
        <circle cx="18" cy="15.5" r="14" fill="#EB001B" opacity="0.9" />
        <circle cx="32" cy="15.5" r="14" fill="#F79E1B" opacity="0.9" />
      </svg>
    );
  }
  return null;
}
