import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, CardSwatch, FakeStatus } from '../design/atoms.jsx';
import { useAppState } from '../state/AppState.jsx';
import BackButton from '../components/BackButton.jsx';
import VariantToggle from '../components/VariantToggle.jsx';

export default function Onboarding() {
  const [variant, setVariant] = useState('A');
  return (
    <>
      {variant === 'A' ? <OnboardPlaid goManual={() => setVariant('B')} /> : <OnboardManual back={() => setVariant('A')} />}
      <VariantToggle variant={variant} onChange={setVariant} />
    </>
  );
}

function OnboardPlaid({ goManual }) {
  const nav = useNavigate();
  const { setBankConnected } = useAppState();
  const [connecting, setConnecting] = useState(false);

  const connect = () => {
    setConnecting(true);
    setTimeout(() => {
      setBankConnected(true);
      nav('/home');
    }, 1200);
  };

  return (
    <div style={screen(T.paper)}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.dim }}>Step 3 of 3</div>
        <button onClick={() => nav('/home')} style={skipLink}>Skip for now</button>
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        <Pill bg={T.lemon}>let's add your cards</Pill>
        <h1 className="display" style={{ fontSize: 42, lineHeight: 0.98, margin: '14px 0 10px', fontWeight: 900, letterSpacing: -0.03 }}>
          Bring your<br/>wallet, not your<br/>card numbers.
        </h1>
        <p style={{ fontSize: 15, color: T.graphite, lineHeight: 1.4, margin: 0 }}>
          Connect your bank through Plaid. We read which cards you have and categorize your spend. <b>Read-only.</b> No numbers stored.
        </p>
      </div>

      <div style={{
        margin: '28px 24px 0', padding: 20,
        background: T.sky, border: `2.5px solid ${T.ink}`, borderRadius: 18,
        boxShadow: `5px 5px 0 0 ${T.ink}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, background: T.ink, color: T.lemon, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Plaid — the secure way</span>
        </div>
        <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.4, opacity: 0.85 }}>
          Works with 12,000+ US banks. Takes ~20 seconds. We auto-detect your credit cards.
        </div>
        <div style={{ marginTop: 14 }}>
          <ChunkyBtn bg={T.ink} fg={T.paper} size="md" w="100%" onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting…' : '🔗 Connect my bank'}
          </ChunkyBtn>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '18px 24px 0', flexWrap: 'wrap' }}>
        <Pill bg={T.cream} fg={T.ink}>🔒 256-bit encrypted</Pill>
        <Pill bg={T.cream} fg={T.ink}>👁 Read-only</Pill>
        <Pill bg={T.cream} fg={T.ink}>🚫 No selling</Pill>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 24px 0' }}>
        <div style={{ flex: 1, height: 1.5, background: T.hairline }} />
        <div style={{ fontSize: 12, fontWeight: 700, color: T.dim, letterSpacing: 1 }}>OR</div>
        <div style={{ flex: 1, height: 1.5, background: T.hairline }} />
      </div>

      <div style={{ margin: '18px 24px 0' }}>
        <button
          onClick={goManual}
          style={{
            width: '100%', padding: '14px 16px', background: T.paper, fontFamily: T.body,
            border: `2px dashed ${T.ink}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: T.cream, border: `1.5px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✍︎</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Enter cards manually</div>
            <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>Pick from our catalog of 200+ cards. No bank needed.</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>›</div>
        </button>
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 24, right: 24, textAlign: 'center', fontSize: 12, color: T.dim }}>
        You're in control. Disconnect anytime in Settings.
      </div>
    </div>
  );
}

function OnboardManual({ back }) {
  const nav = useNavigate();
  const { catalog, selectedCardIds, toggleCard } = useAppState();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return catalog;
    const needle = q.toLowerCase();
    return catalog.filter((c) =>
      c.name.toLowerCase().includes(needle) || c.brand.toLowerCase().includes(needle)
    );
  }, [q, catalog]);

  const count = selectedCardIds.length;

  return (
    <div style={screen(T.paper)}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackButton onClick={back} />
        <div style={{ fontSize: 14, fontWeight: 600, color: T.dim, marginLeft: 6 }}>Add manually</div>
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        <h1 className="display" style={{ fontSize: 38, lineHeight: 0.98, margin: '0 0 10px', fontWeight: 900, letterSpacing: -0.03 }}>
          Pick the cards<br/>in your wallet.
        </h1>
        <p style={{ fontSize: 14, color: T.graphite, margin: 0 }}>{count} selected · tap to toggle</p>
      </div>

      <div style={{ margin: '18px 24px 0' }}>
        <div style={{
          padding: '10px 14px', background: T.cream,
          border: `2px solid ${T.ink}`, borderRadius: 14, boxShadow: `2px 2px 0 0 ${T.ink}`,
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 15,
        }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 200+ cards…"
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 15, fontFamily: T.body, flex: 1, color: T.ink,
            }}
          />
        </div>
      </div>

      <div style={{ margin: '18px 24px 120px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 440, overflowY: 'auto' }}>
        {filtered.map((c) => {
          const selected = selectedCardIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleCard(c.id)}
              style={{
                padding: 14, background: selected ? T.cream : T.paper,
                border: `2.5px solid ${T.ink}`, borderRadius: 14,
                boxShadow: selected ? `4px 4px 0 0 ${T.ink}` : `2px 2px 0 0 ${T.ink}`,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: T.body, textAlign: 'left',
              }}
            >
              <CardSwatch brand={c.brand} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{c.fee}</div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                border: `2px solid ${T.ink}`,
                background: selected ? T.mint : T.paper,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 16, color: T.ink,
              }}>{selected ? '✓' : ''}</div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: T.dim, fontSize: 13, padding: 24 }}>
            No cards match "{q}".
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 24, right: 24 }}>
        <ChunkyBtn
          bg={T.lemon} fg={T.ink} size="lg" w="100%"
          onClick={() => nav('/home')} disabled={count === 0}
        >
          Continue with {count} card{count === 1 ? '' : 's'}
        </ChunkyBtn>
      </div>
    </div>
  );
}

const screen = (bg) => ({
  width: '100%', height: '100%', background: bg, color: T.ink,
  fontFamily: T.body, position: 'relative', overflow: 'hidden',
});

const skipLink = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 14, fontWeight: 700, color: T.graphite, textDecoration: 'underline',
  fontFamily: T.body, padding: 0,
};
