import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { CardSticker, CardSwatch, Pill, FakeStatus } from '../design/atoms.jsx';
import BottomNav from '../components/BottomNav.jsx';
import VariantToggle from '../components/VariantToggle.jsx';

const PLACES = [
  { id: 'wf',    icon: '🛒', name: 'Whole Foods',         sub: 'Market · 220 ft',      card: 'Amex Gold',        brand: 'amex',  mult: '4×', reward: '+$2.40',  cat: 'Groceries',    dist: '220 ft',  basket: 120 },
  { id: 'shell', icon: '⛽', name: 'Shell',               sub: 'Gas station · 0.2 mi', card: 'Savor',            brand: 'savor', mult: '3%', reward: '+$1.80',  cat: 'Gas',          dist: '0.2 mi',  basket: 60  },
  { id: 'bb',    icon: '☕', name: 'Blue Bottle',         sub: 'Coffee · 0.3 mi',      card: 'Amex Gold',        brand: 'amex',  mult: '4×', reward: '+$0.40',  cat: 'Dining',       dist: '0.3 mi',  basket: 10  },
  { id: 'delta', icon: '✈︎', name: 'Delta Counter (SFO)', sub: 'Airline · 0.7 mi',     card: 'Sapphire Reserve', brand: 'chase', mult: '5×', reward: '+$12.00', cat: 'Travel',       dist: '0.7 mi',  basket: 240 },
];

export default function Home() {
  const [variant, setVariant] = useState('A');
  const [selectedPlaceId, setSelectedPlaceId] = useState('wf');
  return (
    <>
      {variant === 'A'
        ? <GeoList selectedPlaceId={selectedPlaceId} onSelect={setSelectedPlaceId} />
        : <GeoBanner selectedPlaceId={selectedPlaceId} />
      }
      <VariantToggle variant={variant} onChange={setVariant} />
    </>
  );
}

function GeoList({ selectedPlaceId, onSelect }) {
  return (
    <div style={screen(T.paper)}>
      <FakeStatus />

      <div style={{ padding: '10px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: T.dim, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: T.mintDk,
            animation: 'pulse 1.8s ease-in-out infinite',
          }} />
          Near you · San Francisco
        </div>
        <h1 className="display" style={{ fontSize: 40, lineHeight: 0.98, margin: '10px 0 6px', fontWeight: 900, letterSpacing: -0.03 }}>
          Four places.<br/>Four smart swipes.
        </h1>
        <p style={{ fontSize: 14, color: T.graphite, margin: 0 }}>Tap a place to see why.</p>
      </div>

      {/* Map peek */}
      <div style={{
        margin: '18px 24px 0', height: 120, borderRadius: 18,
        background: T.cream, border: `2.5px solid ${T.ink}`,
        boxShadow: `4px 4px 0 0 ${T.ink}`, position: 'relative', overflow: 'hidden',
      }}>
        <svg viewBox="0 0 340 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M0 40 Q 120 60 220 30 T 340 70" stroke={T.haze} strokeWidth="14" fill="none" />
          <path d="M60 0 Q 80 70 120 120" stroke={T.haze} strokeWidth="10" fill="none" />
          <path d="M200 0 L 240 120" stroke={T.haze} strokeWidth="10" fill="none" />
          <circle cx="80" cy="60" r="8" fill={T.amex} stroke={T.ink} strokeWidth="2" />
          <circle cx="170" cy="40" r="8" fill={T.savor} stroke={T.ink} strokeWidth="2" />
          <circle cx="250" cy="55" r="8" fill={T.amex} stroke={T.ink} strokeWidth="2" />
          <circle cx="300" cy="90" r="8" fill={T.chase} stroke={T.ink} strokeWidth="2" />
          <circle cx="150" cy="80" r="14" fill={T.sky} stroke={T.ink} strokeWidth="2.5" />
          <circle cx="150" cy="80" r="5" fill={T.ink} />
        </svg>
      </div>

      <div style={{ margin: '18px 20px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PLACES.map((p) => {
          const isSelected = p.id === selectedPlaceId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                padding: 12, background: isSelected ? T.lemon : T.paper,
                border: `2.5px solid ${T.ink}`, borderRadius: 14,
                boxShadow: isSelected ? `4px 4px 0 0 ${T.ink}` : `2px 2px 0 0 ${T.ink}`,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: T.body, textAlign: 'left',
              }}
            >
              <div style={{ width: 42, height: 42, background: T.paper, border: `2px solid ${T.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {p.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: T.graphite, marginTop: 1 }}>{p.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <CardSwatch brand={p.brand} size={22} />
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{p.mult}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.mintDk, marginTop: 2 }}>{p.reward}</div>
              </div>
            </button>
          );
        })}
      </div>

      <BottomNav active="home" />
    </div>
  );
}

function GeoBanner({ selectedPlaceId }) {
  const place = PLACES.find((p) => p.id === selectedPlaceId) || PLACES[0];
  const isAmex = place.brand === 'amex';
  return (
    <div style={screen(T.paper)}>
      <FakeStatus />

      <div style={{
        margin: '10px 16px 0', padding: '14px 16px',
        background: T.mint, border: `2.5px solid ${T.ink}`, borderRadius: 18,
        boxShadow: `4px 4px 0 0 ${T.ink}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: T.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          position: 'relative',
        }}>
          📍
          <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: T.coral, border: `2px solid ${T.ink}` }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: T.graphite, textTransform: 'uppercase' }}>You're at</div>
          <div style={{ fontSize: 17, fontWeight: 800, marginTop: 1 }}>{place.name}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.graphite }}>{place.dist}</div>
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: T.dim }}>Swipe this one</div>
        <div style={{ margin: '14px 0 0', position: 'relative', display: 'inline-block' }}>
          <CardSticker brand={place.brand} name={place.card} last4="••04" rotate={-3} />
          <div style={{
            position: 'absolute', top: -12, right: -16,
            width: 64, height: 64, borderRadius: '50%', background: T.lemon,
            border: `2.5px solid ${T.ink}`, boxShadow: `3px 3px 0 0 ${T.ink}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.display, fontWeight: 900,
            transform: 'rotate(12deg)',
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{place.mult}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{isAmex ? 'PTS' : 'BACK'}</span>
          </div>
        </div>
        <div style={{ marginTop: 24, fontSize: 22, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2 }}>
          {place.cat} earn <span style={{ background: T.lemon, padding: '0 6px', borderRadius: 6 }}>{place.mult} {isAmex ? 'points' : 'back'}</span> on {place.card.split(' ').slice(-1)}.
        </div>
        <div style={{ marginTop: 6, fontSize: 14, color: T.graphite }}>
          Based on your usual basket (~${place.basket}), that's roughly <b>{place.reward}</b> in rewards today.
        </div>
      </div>

      <div style={{ margin: '28px 24px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: T.dim, marginBottom: 10 }}>Not {place.card.split(' ').slice(-1)}? Next best:</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <AltCard brand="savor" label="Savor" detail="3% cash" good />
          <AltCard brand="chase" label="Reserve" detail="1× pts" />
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

function AltCard({ brand, label, detail, good }) {
  return (
    <div style={{ flex: 1, padding: 12, background: T.paper, border: `2px solid ${T.ink}`, borderRadius: 12 }}>
      <CardSwatch brand={brand} size={24} />
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 11, color: good ? T.mintDk : T.dim, fontWeight: 800 }}>{detail}</div>
    </div>
  );
}

const screen = (bg) => ({
  width: '100%', height: '100%', background: bg, color: T.ink,
  fontFamily: T.body, position: 'relative', overflow: 'hidden',
});
