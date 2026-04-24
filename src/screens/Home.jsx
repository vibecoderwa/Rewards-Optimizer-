import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, CardSwatch, Pill, FakeStatus } from '../design/atoms.jsx';
import CardArt from '../design/CardArt.jsx';
import BottomNav from '../components/BottomNav.jsx';
import VariantToggle from '../components/VariantToggle.jsx';
import { useAppState } from '../state/AppState.jsx';
import { getCurrentLocation, requestLocationPermission, formatDistance } from '../services/location.js';
import { fetchNearbyPlaces } from '../services/places.js';
import { rankCardsForCategory, formatMultiplier, estimateReturn, formatMoney } from '../services/matcher.js';
import { CATEGORY_LABELS } from '../data/categories.js';

export default function Home() {
  const [variant, setVariant] = useState('A');
  const { selectedCardIds, usualBasket } = useAppState();
  const [coords, setCoords]   = useState(null);
  const [places, setPlaces]   = useState(null);
  const [status, setStatus]   = useState('idle'); // idle | locating | loading | ready | error
  const [error, setError]     = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const load = async () => {
    try {
      setStatus('locating'); setError('');
      const ok = await requestLocationPermission();
      if (!ok) throw new Error('Location permission denied. Enable it in Settings.');
      const pos = await getCurrentLocation();
      setCoords(pos);
      setStatus('loading');
      const found = await fetchNearbyPlaces(pos, 500);
      setPlaces(found);
      setStatus('ready');
      if (found[0]) setSelectedId(found[0].id);
    } catch (e) {
      setError(e.message || 'Could not find you');
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  // Enrich places with best-card-for-category. Cheap — re-runs only when
  // wallet or fetched places change.
  const enriched = useMemo(() => {
    if (!places) return null;
    return places.map((p) => {
      const ranked = rankCardsForCategory(p.category, selectedCardIds);
      return { ...p, ranked };
    });
  }, [places, selectedCardIds]);

  const content = (
    <>
      {status === 'locating' && <Status msg="Finding you…" />}
      {status === 'loading'  && <Status msg="Looking for nearby merchants…" />}
      {status === 'error'    && <ErrorPanel msg={error} onRetry={load} />}
      {status === 'ready' && enriched && (
        variant === 'A'
          ? <GeoList places={enriched} selectedId={selectedId} onSelect={setSelectedId} onRefresh={load} />
          : <GeoBanner place={enriched.find((p) => p.id === selectedId) || enriched[0]} basket={usualBasket} />
      )}
    </>
  );

  return (
    <>
      {content}
      <VariantToggle variant={variant} onChange={setVariant} />
    </>
  );
}

function Status({ msg }) {
  return (
    <div style={screen(T.paper)}>
      <FakeStatus />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%', background: T.mintDk,
          animation: 'pulse 1.4s ease-in-out infinite', marginBottom: 18,
        }} />
        <div style={{ fontSize: 15, color: T.graphite, fontWeight: 600 }}>{msg}</div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

function ErrorPanel({ msg, onRetry }) {
  return (
    <div style={screen(T.paper)}>
      <FakeStatus />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Can't read your location</div>
        <div style={{ fontSize: 13, color: T.graphite, marginBottom: 20, maxWidth: 300 }}>{msg}</div>
        <ChunkyBtn onClick={onRetry} bg={T.ink} fg={T.paper}>Try again</ChunkyBtn>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

function GeoList({ places, selectedId, onSelect, onRefresh }) {
  return (
    <div style={screen(T.paper)}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: T.dim, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: T.mintDk, animation: 'pulse 1.8s ease-in-out infinite' }} />
          Near you
          <button onClick={onRefresh} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: T.plumDk, fontSize: 12, fontWeight: 700, textDecoration: 'underline', fontFamily: T.body }}>refresh</button>
        </div>
        <h1 className="display" style={{ fontSize: 36, lineHeight: 0.98, margin: '10px 0 6px', fontWeight: 900, letterSpacing: -0.03 }}>
          {places.length} place{places.length === 1 ? '' : 's'}.<br/>
          {places.length} smart swipe{places.length === 1 ? '' : 's'}.
        </h1>
        <p style={{ fontSize: 14, color: T.graphite, margin: 0 }}>Tap a place to see the best card.</p>
      </div>

      <div style={{ margin: '18px 20px 120px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {places.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: T.dim, fontSize: 13 }}>
            Nothing useful within 500m. Try moving closer to shops/restaurants.
          </div>
        )}
        {places.slice(0, 12).map((p) => {
          const best = p.ranked[0];
          const isSelected = p.id === selectedId;
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: T.graphite, marginTop: 1 }}>{CATEGORY_LABELS[p.category]} · {formatDistance(p.distance)}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 76 }}>
                {best ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <CardSwatch brand={best.card.brand} size={22} />
                      <span style={{ fontSize: 12, fontWeight: 800 }}>{formatMultiplier(best.rule)}</span>
                    </div>
                    <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{best.card.short}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 10, color: T.dim }}>add cards</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <BottomNav active="home" />
    </div>
  );
}

function GeoBanner({ place, basket }) {
  const nav = useNavigate();
  const best = place.ranked[0];
  const alts = place.ranked.slice(1, 3);
  const isAmex = best?.card.brand === 'amex';
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, position: 'relative',
        }}>📍</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: T.graphite, textTransform: 'uppercase' }}>Nearest</div>
          <div style={{ fontSize: 17, fontWeight: 800, marginTop: 1 }}>{place.name}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.graphite }}>{formatDistance(place.distance)}</div>
      </div>

      {best ? (
        <>
          <div style={{ padding: '28px 24px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: T.dim }}>Swipe this one</div>
            <div style={{ margin: '14px 0 0', position: 'relative', display: 'inline-block' }}>
              <CardArt id={best.card.id} last4="0421" width={300} rotate={-3} />
              <div style={{
                position: 'absolute', top: -12, right: -16,
                width: 64, height: 64, borderRadius: '50%', background: T.lemon,
                border: `2.5px solid ${T.ink}`, boxShadow: `3px 3px 0 0 ${T.ink}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.display, fontWeight: 900, transform: 'rotate(12deg)',
              }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{formatMultiplier(best.rule)}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{isAmex ? 'PTS' : best.rule.unit === 'pct' ? 'BACK' : 'PTS'}</span>
              </div>
            </div>
            <div style={{ marginTop: 24, fontSize: 20, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.25 }}>
              {CATEGORY_LABELS[place.category]} earn <span style={{ background: T.lemon, padding: '0 6px', borderRadius: 6 }}>{formatMultiplier(best.rule)} {isAmex ? 'points' : best.rule.unit === 'pct' ? 'back' : 'points'}</span> on {best.card.short}.
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: T.graphite }}>
              At your usual ~${basket}, that's roughly <b>{formatMoney(estimateReturn(best.rule, basket))}</b> in rewards.
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: T.dim, lineHeight: 1.4 }}>{best.rule.notes}</div>
          </div>

          {alts.length > 0 && (
            <div style={{ margin: '28px 24px 120px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: T.dim, marginBottom: 10 }}>Next best:</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {alts.map(({ card, rule }) => (
                  <div key={card.id} style={{ flex: 1, padding: 12, background: T.paper, border: `2px solid ${T.ink}`, borderRadius: 12 }}>
                    <CardSwatch brand={card.brand} size={24} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{card.short}</div>
                    <div style={{ fontSize: 11, color: T.dim, fontWeight: 800 }}>{formatMultiplier(rule)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Add cards to get a recommendation</div>
          <div style={{ fontSize: 13, color: T.graphite, marginBottom: 18 }}>
            Swipewise needs to know which cards you carry to pick the best one.
          </div>
          <ChunkyBtn onClick={() => nav('/cards')} bg={T.lemon} fg={T.ink}>Add cards</ChunkyBtn>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}

const screen = (bg) => ({
  width: '100%', height: '100%', background: bg, color: T.ink,
  fontFamily: T.body, position: 'relative', overflow: 'hidden',
});
