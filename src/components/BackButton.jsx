import React from 'react';
import { T } from '../design/tokens.js';

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Back"
      style={{
        width: 36, height: 36, borderRadius: 10, background: T.paper,
        border: `2px solid ${T.ink}`, boxShadow: `2px 2px 0 0 ${T.ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
        cursor: 'pointer', fontFamily: T.body, fontSize: 18, lineHeight: 1,
        padding: 0,
      }}
    >‹</button>
  );
}
