import React, { useState } from 'react';
import { T } from '../design/tokens.js';
import { FakeStatus } from '../design/atoms.jsx';
import BottomNav from '../components/BottomNav.jsx';
import {
  SmallA, SmallB, MediumA, MediumB, LargeA, LargeB,
  LockRectA, LockCircleA, LockCircleB,
} from '../design/widgets.jsx';

const TABS = [
  { id: 'home', l: 'Home-screen' },
  { id: 'lock', l: 'Lock-screen' },
  { id: 'push', l: 'Notifications' },
];

export default function Insights() {
  const [tab, setTab] = useState('home');
  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper,
      color: T.ink, fontFamily: T.body, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: T.dim, textTransform: 'uppercase' }}>Insights</div>
        <h1 className="display" style={{ fontSize: 36, lineHeight: 0.98, margin: '6px 0 10px', fontWeight: 900, letterSpacing: -0.03 }}>
          Widgets gallery
        </h1>
        <p style={{ fontSize: 13, color: T.graphite, margin: 0 }}>How Swipewise shows up across your phone.</p>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '14px 20px 0', overflowX: 'auto' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              background: tab === t.id ? T.ink : T.paper,
              color: tab === t.id ? T.paper : T.ink,
              border: `1.5px solid ${T.ink}`, cursor: 'pointer',
              fontFamily: T.body, whiteSpace: 'nowrap',
              boxShadow: tab === t.id ? 'none' : `2px 2px 0 0 ${T.ink}`,
            }}
          >{t.l}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 120px' }}>
        {tab === 'home' && <HomeGallery />}
        {tab === 'lock' && <LockGallery />}
        {tab === 'push' && <NotifGallery />}
      </div>

      <BottomNav active="insights" />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: T.dim, textTransform: 'uppercase', margin: '4px 0 10px' }}>
      {children}
    </div>
  );
}

function HomeGallery() {
  return (
    <div>
      <SectionLabel>Small · 2×2</SectionLabel>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <SmallA /><SmallB />
      </div>
      <SectionLabel>Medium · 4×2</SectionLabel>
      <div style={{ display: 'flex', gap: 16, flexDirection: 'column', marginBottom: 22 }}>
        <MediumA /><MediumB />
      </div>
      <SectionLabel>Large · 4×4</SectionLabel>
      <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
        <LargeA /><LargeB />
      </div>
    </div>
  );
}

function LockGallery() {
  return (
    <div>
      <SectionLabel>On the lock screen</SectionLabel>
      <div style={{
        padding: 18, borderRadius: 22, border: `2.5px solid ${T.ink}`,
        boxShadow: `4px 4px 0 0 ${T.ink}`, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(180deg, #1a1f2b 0%, #0a0d14 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{ color: '#fff', fontFamily: '-apple-system, system-ui', fontSize: 12, opacity: 0.7 }}>Sunday, April 26</div>
        <div style={{ color: '#fff', fontSize: 56, fontWeight: 300, letterSpacing: -2, lineHeight: 0.9 }}>2:14</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <LockCircleA /><LockCircleB />
        </div>
        <LockRectA />
      </div>
    </div>
  );
}

function NotifGallery() {
  return (
    <div style={{
      padding: 18, borderRadius: 22, border: `2.5px solid ${T.ink}`,
      boxShadow: `4px 4px 0 0 ${T.ink}`,
      background: 'linear-gradient(180deg, #1a1f2b 0%, #0a0d14 100%)',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)', color: T.ink,
        borderRadius: 20, padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: T.lemon, border: `1.5px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20 }}>$</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Swipewise</span>
            <span style={{ fontSize: 11, color: T.dim }}>now</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>
            Walking into Whole Foods? <span style={{ color: T.mintDk }}>Use Gold</span> — 4× on groceries, +$9.60 on your usual basket.
          </div>
        </div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.75)', color: T.ink,
        borderRadius: 20, padding: '10px 14px', margin: '0 14px',
        display: 'flex', alignItems: 'center', gap: 10, opacity: 0.85,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.coral, border: `1.5px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏰</div>
        <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Uber Cash expires Sunday — $15 unused</div>
        <span style={{ fontSize: 11, color: T.dim }}>2h ago</span>
      </div>
    </div>
  );
}
