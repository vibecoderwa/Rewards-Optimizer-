import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, CardSticker, FakeStatus } from '../design/atoms.jsx';
import VariantToggle from '../components/VariantToggle.jsx';

export default function Landing() {
  const [variant, setVariant] = useState('A');
  return (
    <>
      {variant === 'A' ? <LandingA /> : <LandingB />}
      <VariantToggle variant={variant} onChange={setVariant} />
    </>
  );
}

function LandingA() {
  const nav = useNavigate();
  return (
    <div style={screen(T.paper)}>
      <FakeStatus />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 24px 18px' }}>
        <BrandMark bg={T.lemon} fg={T.ink} />
        <button
          onClick={() => nav('/auth/phone')}
          style={linkBtn}
        >Log in</button>
      </div>

      <div style={{ position: 'relative', height: 240, margin: '0 0 12px' }}>
        <div style={{ position: 'absolute', top: 40, left: 32 }}>
          <CardSticker brand="chase" name="Sapphire Reserve" last4="••21" rotate={-8} />
        </div>
        <div style={{ position: 'absolute', top: 76, left: 120 }}>
          <CardSticker brand="amex" name="Gold Card" last4="••04" rotate={4} />
        </div>
        <div style={{ position: 'absolute', top: 28, left: 210 }}>
          <CardSticker brand="savor" name="Savor" last4="••55" rotate={11} />
        </div>
        <div style={{ position: 'absolute', top: 20, right: 28, fontSize: 22 }}>✦</div>
        <div style={{ position: 'absolute', top: 180, left: 18, fontSize: 18, color: T.coral }}>✦</div>
        <div style={{ position: 'absolute', top: 210, right: 60, fontSize: 14, color: T.plumDk }}>✧</div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <h1 className="display" style={{
          fontSize: 52, lineHeight: 0.92, margin: 0, fontWeight: 900, letterSpacing: -0.04,
        }}>
          Your wallet<br/>
          just got<br/>
          <span style={{
            background: T.lemon, padding: '0 10px',
            border: `2.5px solid ${T.ink}`, borderRadius: 12,
            boxShadow: `4px 4px 0 0 ${T.ink}`, display: 'inline-block',
            transform: 'rotate(-1.5deg)', marginTop: 4,
          }}>opinionated.</span>
        </h1>
        <p style={{
          fontSize: 17, lineHeight: 1.4, color: T.graphite, marginTop: 22,
          maxWidth: 320, letterSpacing: -0.2,
        }}>
          Know which card to swipe, <i>before</i> you swipe it. We track your rewards, credits, and every coffee you forget to expense.
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        <ChunkyBtn bg={T.ink} fg={T.paper} size="lg" w="100%" onClick={() => nav('/auth/phone')}>
          Get started — it's free
        </ChunkyBtn>
        <div style={{ textAlign: 'center', fontSize: 13, color: T.dim, marginTop: 14 }}>
          <span style={{ fontWeight: 600, color: T.graphite }}>Already in?</span> Log in with your number
        </div>
      </div>
    </div>
  );
}

function LandingB() {
  const nav = useNavigate();
  return (
    <div style={screen(T.cream)}>
      <FakeStatus />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 24px 14px' }}>
        <BrandMark bg={T.coral} fg="#fff" />
        <button onClick={() => nav('/auth/phone')} style={linkBtn}>Log in</button>
      </div>

      <div style={{ padding: '12px 24px 0' }}>
        <Pill bg={T.mint} fg={T.ink}>your rewards · audited</Pill>
        <div style={{ marginTop: 14 }}>
          <span className="display" style={{ fontSize: 120, fontWeight: 900, lineHeight: 0.85, letterSpacing: -0.06 }}>
            $518
          </span>
          <div style={{ fontSize: 17, fontWeight: 600, color: T.graphite, marginTop: 10, lineHeight: 1.35 }}>
            That's what the average user finds in the first week. In rewards they were already earning — <i>and missing</i>.
          </div>
        </div>
      </div>

      <div style={{
        margin: '26px 24px 0', background: T.paper,
        border: `2.5px solid ${T.ink}`, borderRadius: 18,
        boxShadow: `5px 5px 0 0 ${T.ink}`, padding: 16, position: 'relative',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: T.dim }}>★ TODAY ★</div>

        <ReceiptRow icon="☕" bg={T.sky} title="Blue Bottle · $6.50" sub="Swipe Gold → 4× points" pill={{ bg: T.amex, fg: '#fff', text: 'AMEX' }} />
        <ReceiptRow icon="✈︎" bg={T.lemon} title="United flight · $412" sub="Swipe Sapphire → 5× points" pill={{ bg: T.chase, fg: '#fff', text: 'CHASE' }} />
        <ReceiptRow icon="⏰" bg={T.coral} title="Uber Cash expires Sunday" sub="$15 poof, if you don't use it" last />

        <div style={{ position: 'absolute', left: -7, top: '50%', width: 12, height: 12, borderRadius: '50%', background: T.cream, border: `2px solid ${T.ink}` }} />
        <div style={{ position: 'absolute', right: -7, top: '50%', width: 12, height: 12, borderRadius: '50%', background: T.cream, border: `2px solid ${T.ink}` }} />
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        <ChunkyBtn bg={T.coral} fg="#fff" size="lg" w="100%" onClick={() => nav('/auth/phone')}>
          Show me my money →
        </ChunkyBtn>
        <div style={{ textAlign: 'center', fontSize: 13, color: T.dim, marginTop: 14 }}>
          No credit check. No card number needed. Plaid-secure.
        </div>
      </div>
    </div>
  );
}

function ReceiptRow({ icon, bg, title, sub, pill, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginTop: 10, padding: last ? '8px 0 0' : '8px 0',
      borderBottom: last ? 'none' : `1.5px dashed ${T.hairline}`,
    }}>
      <div style={{
        width: 34, height: 34, background: bg, border: `1.5px solid ${T.ink}`,
        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: bg === T.coral ? '#fff' : T.ink,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 12, color: T.dim }}>{sub}</div>
      </div>
      {pill && <Pill bg={pill.bg} fg={pill.fg}>{pill.text}</Pill>}
    </div>
  );
}

function BrandMark({ bg, fg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 32, height: 32, background: bg, border: `2px solid ${T.ink}`, borderRadius: 9,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: fg,
        boxShadow: `2px 2px 0 0 ${T.ink}`,
      }}>$</div>
      <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>Swipewise</span>
    </div>
  );
}

const screen = (bg) => ({
  width: '100%', height: '100%', background: bg, color: T.ink,
  fontFamily: T.body, position: 'relative', overflow: 'hidden',
});

const linkBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 14, fontWeight: 600, color: T.graphite, fontFamily: T.body,
  padding: 0,
};
