import React from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, FakeStatus } from '../design/atoms.jsx';

const SWATCHES = [
  ['Ink', T.ink],     ['Paper', T.paper],  ['Cream', T.cream],
  ['Lemon', T.lemon], ['Mint', T.mint],    ['Coral', T.coral],
  ['Sky', T.sky],     ['Plum', T.plum],    ['Graphite', T.graphite],
];

export default function System() {
  const nav = useNavigate();
  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper, color: T.ink,
      fontFamily: T.body, position: 'relative', overflow: 'auto',
    }}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => nav(-1)}
          style={{
            width: 36, height: 36, borderRadius: 10, background: T.paper,
            border: `2px solid ${T.ink}`, boxShadow: `2px 2px 0 0 ${T.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, cursor: 'pointer', fontFamily: T.body, fontSize: 18, padding: 0,
          }}
        >‹</button>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.dim, marginLeft: 6 }}>Design system</div>
      </div>

      <div style={{ padding: '20px 24px 60px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: T.dim, textTransform: 'uppercase' }}>Design system</div>
        <h1 className="display" style={{ fontSize: 40, fontWeight: 800, margin: '6px 0 4px', letterSpacing: -0.03 }}>
          Quiet. Warm. <span style={{ fontStyle: 'italic', color: T.graphite }}>Considered.</span>
        </h1>
        <div style={{ fontSize: 13, color: T.graphite, marginBottom: 20 }}>
          Editorial leanings · muted warm palette · expressive serif numbers · paper base · soft shadows, not hard.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
          {SWATCHES.map(([name, color]) => (
            <div key={name}>
              <div style={{ height: 54, background: color, border: `1px solid ${T.hairline}`, borderRadius: 8 }}/>
              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 6 }}>{name}</div>
              <div style={{ fontSize: 9, color: T.dim, fontFamily: T.mono }}>{color}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label>Display · Fraunces</Label>
          <div className="display" style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.95, letterSpacing: -0.03 }}>+$518</div>
          <div className="display" style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic', marginTop: 4 }}>opinionated.</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label>Body · Inter Tight</Label>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Your wallet just got opinionated.</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.graphite, lineHeight: 1.45 }}>
            Know which card to swipe, before you swipe it. We track your rewards, credits, and every coffee you forget to expense.
          </div>
          <div className="mono" style={{ fontSize: 12, marginTop: 10, color: T.graphite }}>+1 (415) ••• 0199 · mono</div>
        </div>

        <Label>Atoms</Label>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <ChunkyBtn>Primary</ChunkyBtn>
          <ChunkyBtn bg={T.lemon} fg={T.ink}>Accent</ChunkyBtn>
          <ChunkyBtn bg={T.mint}  fg={T.ink}>Positive</ChunkyBtn>
          <ChunkyBtn bg={T.coral} fg="#fff">Alert</ChunkyBtn>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <Pill bg={T.lemon}>tag</Pill>
          <Pill bg={T.mint}>on track</Pill>
          <Pill bg={T.coral} fg="#fff">expiring</Pill>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: T.dim, marginBottom: 8, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}
