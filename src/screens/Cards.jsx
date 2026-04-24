import React, { useState } from 'react';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, CardSticker, CardSwatch, FakeStatus } from '../design/atoms.jsx';
import { useAppState } from '../state/AppState.jsx';
import BottomNav from '../components/BottomNav.jsx';

const META = {
  amex:  { color: T.amex,  issuer: 'American Express' },
  chase: { color: T.chase, issuer: 'Chase' },
  savor: { color: T.savor, issuer: 'Capital One' },
};

export default function Cards() {
  const { catalog, selectedCardIds, toggleCard } = useAppState();
  const [managing, setManaging] = useState(false);
  const selected = catalog.filter((c) => selectedCardIds.includes(c.id));
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
          <Pill bg={T.mint}>on track · +$132 april</Pill>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 120px' }}>
        {selected.length === 0 ? (
          <div style={{
            margin: '40px 0', padding: 18, textAlign: 'center',
            border: `2px dashed ${T.ink}`, borderRadius: 14,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>No cards yet.</div>
            <div style={{ fontSize: 13, color: T.dim, marginTop: 6 }}>Add one below to start earning smarter.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {selected.map((c, i) => (
              <div key={c.id} style={{ position: 'relative' }}>
                <CardSticker
                  brand={c.brand}
                  name={c.name}
                  last4={'••' + String(11 + i * 17).padStart(2, '0')}
                  rotate={i % 2 === 0 ? -1.5 : 1.5}
                  style={{ width: '100%', height: 160 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: T.dim }}>{c.fee}</div>
                  <div style={{ flex: 1 }} />
                  {managing && (
                    <button
                      onClick={() => toggleCard(c.id)}
                      style={smallBtn(T.coral, '#fff')}
                    >Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: T.dim, textTransform: 'uppercase' }}>Add more</div>
          <button
            onClick={() => setManaging((m) => !m)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 13, fontWeight: 700, color: T.plumDk, textDecoration: 'underline',
              fontFamily: T.body,
            }}
          >{managing ? 'Done' : 'Manage'}</button>
        </div>

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {available.map((c) => (
            <div key={c.id} style={{
              padding: 12, background: T.paper,
              border: `2px solid ${T.ink}`, borderRadius: 14,
              boxShadow: `2px 2px 0 0 ${T.ink}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <CardSwatch brand={c.brand} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: T.dim }}>{META[c.brand].issuer} · {c.fee}</div>
              </div>
              <ChunkyBtn bg={T.lemon} fg={T.ink} size="sm" onClick={() => toggleCard(c.id)}>Add</ChunkyBtn>
            </div>
          ))}
          {available.length === 0 && (
            <div style={{ color: T.dim, fontSize: 12, textAlign: 'center', padding: 12 }}>
              You've got every card in our catalog.
            </div>
          )}
        </div>
      </div>

      <BottomNav active="cards" />
    </div>
  );
}

function smallBtn(bg, fg) {
  return {
    background: bg, color: fg, border: `1.5px solid ${T.ink}`,
    borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700,
    boxShadow: `2px 2px 0 0 ${T.ink}`, cursor: 'pointer', fontFamily: T.body,
  };
}
