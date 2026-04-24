import React from 'react';
import { T } from './tokens.js';

// Wraps a 402x874 screen in an iPhone frame with dynamic island + home indicator.
// Used as the outer chrome on every route.
export default function PhoneFrame({ children, dark = false }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0EEE9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        width: 402, height: 874, borderRadius: 48, overflow: 'hidden',
        position: 'relative', background: dark ? '#000' : T.paper,
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: T.body, WebkitFontSmoothing: 'antialiased',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
          pointerEvents: 'none',
        }} />
        {/* inner screen */}
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
          height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          paddingBottom: 8, pointerEvents: 'none',
        }}>
          <div style={{
            width: 139, height: 5, borderRadius: 100,
            background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
          }} />
        </div>
      </div>
    </div>
  );
}
