import React from 'react';
import { T } from './tokens.js';

export function ChunkyBtn({
  children, bg = T.ink, fg = T.paper, w, onClick,
  style = {}, size = 'md', type = 'button', disabled,
}) {
  const pad = size === 'lg' ? '18px 28px' : size === 'sm' ? '10px 16px' : '14px 22px';
  const fs = size === 'lg' ? 18 : size === 'sm' ? 14 : 16;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg, color: fg, border: `1.5px solid ${T.ink}`,
        borderRadius: 12, padding: pad, fontSize: fs, fontWeight: 600,
        fontFamily: T.body, cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: `2px 2px 0 0 ${T.ink}`,
        width: w, letterSpacing: -0.2,
        transition: 'transform 120ms, box-shadow 120ms',
        opacity: disabled ? 0.55 : 1,
        ...style,
      }}
      onMouseDown={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translate(1px, 1px)';
        e.currentTarget.style.boxShadow = `1px 1px 0 0 ${T.ink}`;
      }}
      onMouseUp={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `2px 2px 0 0 ${T.ink}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `2px 2px 0 0 ${T.ink}`;
      }}
    >
      {children}
    </button>
  );
}

export function CardSwatch({ brand = 'amex', size = 28 }) {
  const bg = brand === 'amex' ? T.amex : brand === 'chase' ? T.chase : T.savor;
  return (
    <div style={{
      width: size, height: size * 0.65, borderRadius: 4, background: bg,
      border: `1.5px solid ${T.ink}`, flexShrink: 0, position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 2, right: 3, width: 6, height: 4,
        borderRadius: 1, background: 'rgba(255,255,255,0.7)',
      }} />
    </div>
  );
}

export function Pill({ children, bg = T.lemon, fg = T.ink, bordered = true, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: bg, color: fg,
      border: bordered ? `1px solid ${T.ink}` : 'none',
      borderRadius: 999, padding: '3px 10px',
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4,
      textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

export function CardSticker({ brand = 'amex', name, last4 = '••34', rotate = 0, style = {} }) {
  const bg = brand === 'amex' ? T.amex : brand === 'chase' ? T.chase : T.savor;
  const fg = brand === 'amex' ? T.ink : '#fff';
  const label = brand === 'amex' ? 'American Express' : brand === 'chase' ? 'Chase' : 'Capital One';
  return (
    <div style={{
      width: 220, height: 138, borderRadius: 14, background: bg,
      border: `1.5px solid ${T.ink}`, color: fg,
      boxShadow: `3px 3px 0 0 ${T.ink}`,
      padding: '14px 16px', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', fontFamily: T.body,
      transform: `rotate(${rotate}deg)`,
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: 14, right: 14,
        width: 34, height: 26, borderRadius: 4,
        background: brand === 'amex' ? '#fff' : 'rgba(255,255,255,0.3)',
        border: '1.5px solid rgba(0,0,0,0.2)',
      }} />
      <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9 }}>
        {label}
      </div>
      <div>
        <div className="mono" style={{ fontSize: 13, letterSpacing: 2, fontWeight: 500, opacity: 0.85 }}>
          •••• •••• •••• {last4.replace('••','')}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, letterSpacing: -0.3 }}>{name}</div>
      </div>
    </div>
  );
}

export function BigDollar({ value, size = 72, color = T.ink, sign = false }) {
  const pos = value >= 0;
  return (
    <span className="display" style={{
      fontSize: size, color, lineHeight: 0.95,
      fontWeight: 900, letterSpacing: -0.03,
      display: 'inline-flex', alignItems: 'baseline',
    }}>
      {sign && <span style={{ fontSize: size * 0.55, marginRight: 2 }}>{pos ? '+' : '−'}</span>}
      <span style={{ fontSize: size * 0.55, fontWeight: 700 }}>$</span>
      {Math.abs(value).toLocaleString()}
    </span>
  );
}

export function FakeStatus({ time = '9:41', dark = false }) {
  const c = dark ? '#fff' : T.ink;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 28px 6px', color: c, fontSize: 15, fontWeight: 600,
      fontFamily: '-apple-system, system-ui',
    }}>
      <span>{time}</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.5" fill={c}/><rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={c}/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill={c}/><rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={c}/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 3C10 3 11.5 3.7 13 5L14 4C12.5 2.5 10.5 1.5 8 1.5C5.5 1.5 3.5 2.5 2 4L3 5C4.5 3.7 6 3 8 3Z" fill={c}/><circle cx="8" cy="9" r="1.5" fill={c}/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={c} fill="none"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill={c}/></svg>
      </span>
    </div>
  );
}

export function BlobBG({ children, tone = T.lemon, style = {} }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: T.paper, ...style }}>
      <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle cx="320" cy="120" r="140" fill={tone} opacity="0.35"/>
        <circle cx="60" cy="420" r="100" fill={T.mint} opacity="0.28"/>
        <circle cx="280" cy="520" r="80" fill={T.coral} opacity="0.22"/>
      </svg>
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  );
}
