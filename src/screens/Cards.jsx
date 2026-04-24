import React from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, CardSwatch, FakeStatus } from '../design/atoms.jsx';
import CardArt from '../design/CardArt.jsx';
import { useAppState } from '../state/AppState.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { formatMultiplier } from '../services/matcher.js';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../data/categories.js';

export default function Cards() {
  const nav = useNavigate();
  const { catalog, selectedCardIds, toggleCard } = useAppState();
  const selected  = catalog.filter((c) => selectedCardIds.includes(c.id));
  const available = catalog.filter((c) => !selectedCardIds.includes(c.id));

  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper,
      color: T.ink, fontFamily: T.body, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <FakeStatus />

      <div style={{ padding: '10px 24px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: T.dim, textTransform: 'uppercase' }}>Your wallet</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
          <h1 className="display" style={{ fontSize: 36, lineHeight: 0.98, margin: 0, fontWeight: 900, letterSpacing: -0.03 }}>
            {selected.length} card{selected.length === 1 ? '' : 's'}
          </h1>
          {selected.length > 0 && <Pill bg={T.mint}>ready</Pill>}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 120px' }}>
        {selected.length === 0 ? (
          <div style={{
            margin: '20px 0', padding: 18, textAlign: 'center',
            border: `2px dashed ${T.ink}`, borderRadius: 14,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>No cards yet.</div>
            <div style={{ fontSize: 13, color: T.dim, marginTop: 6 }}>Tap "Add" below to build your wallet.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {selected.map((c, i) => (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CardArt
                    id={c.id}
                    last4={String(1100 + i * 173).slice(-4)}
                    width={320}
                    rotate={i % 2 === 0 ? -1.5 : 1.5}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.dim }}>· {c.fee}</div>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => toggleCard(c.id)}
                    style={{
                      background: T.coral, color: '#fff', border: `1.5px solid ${T.ink}`,
                      borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                      boxShadow: `2px 2px 0 0 ${T.ink}`, cursor: 'pointer', fontFamily: T.body,
                    }}
                  >Remove</button>
                </div>
                <RuleStrip card={c} />
              </div>
            ))}
          </div>
        )}

        {available.length > 0 && (
          <>
            <div style={{ marginTop: 28, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: T.dim, textTransform: 'uppercase' }}>Add more</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {available.map((c) => (
                <div key={c.id} style={{
                  padding: 12, background: T.paper,
                  border: `2px solid ${T.ink}`, borderRadius: 14,
                  boxShadow: `2px 2px 0 0 ${T.ink}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <CardSwatch brand={c.brand} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: T.dim }}>{c.fee}</div>
                  </div>
                  <ChunkyBtn bg={T.lemon} fg={T.ink} size="sm" onClick={() => toggleCard(c.id)}>Add</ChunkyBtn>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button
            onClick={() => nav('/home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: T.plumDk, textDecoration: 'underline', fontFamily: T.body }}
          >See what's nearby →</button>
        </div>
      </div>

      <BottomNav active="cards" />
    </div>
  );
}

function RuleStrip({ card }) {
  // Show the top 3 non-default rules as chips.
  const top = card.rules.filter((r) => r.category !== 'default').slice(0, 3);
  if (top.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
      {top.map((r, i) => (
        <span key={i} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: T.cream, border: `1px solid ${T.ink}`, borderRadius: 999,
          padding: '3px 10px', fontSize: 11, fontWeight: 700,
        }}>
          {CATEGORY_ICONS[r.category] || '•'} {CATEGORY_LABELS[r.category]} · {formatMultiplier(r)}
        </span>
      ))}
    </div>
  );
}
