import React from 'react';
import { T } from '../design/tokens.js';

// Fixed bottom-right pill that lets the user flip between A/B design variants
// on screens that have them. Purely a prototype affordance — it's not part of
// the actual product UI.
export default function VariantToggle({ variant, onChange }) {
  return (
    <div style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 1000,
      display: 'flex', gap: 6, padding: 6,
      background: T.paper, border: `1.5px solid ${T.ink}`, borderRadius: 999,
      boxShadow: `3px 3px 0 0 ${T.ink}`, fontFamily: T.body,
    }}>
      {['A', 'B'].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
            background: variant === v ? T.ink : 'transparent',
            color: variant === v ? T.paper : T.ink,
            border: 'none', cursor: 'pointer',
          }}
        >variant {v}</button>
      ))}
    </div>
  );
}
