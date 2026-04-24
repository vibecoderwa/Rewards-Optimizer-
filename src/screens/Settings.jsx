import React from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, FakeStatus } from '../design/atoms.jsx';
import { useAppState } from '../state/AppState.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function Settings() {
  const nav = useNavigate();
  const { phone, bankConnected, setBankConnected, selectedCardIds, setSelectedCardIds, setPhone, setOtp } = useAppState();

  const signOut = () => {
    setPhone(''); setOtp(''); setSelectedCardIds([]); setBankConnected(false);
    nav('/');
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper,
      color: T.ink, fontFamily: T.body, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <FakeStatus />

      <div style={{ padding: '10px 24px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: T.dim, textTransform: 'uppercase' }}>Settings</div>
        <h1 className="display" style={{ fontSize: 36, lineHeight: 0.98, margin: '6px 0 10px', fontWeight: 900, letterSpacing: -0.03 }}>
          Your account
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 120px' }}>
        <Row label="Phone"    value={phone || 'Not set'} />
        <Row
          label="Bank"
          value={bankConnected ? <Pill bg={T.mint}>connected</Pill> : <Pill bg={T.cream} fg={T.ink}>not connected</Pill>}
          action={bankConnected
            ? { text: 'Disconnect', onClick: () => setBankConnected(false) }
            : { text: 'Connect', onClick: () => setBankConnected(true) }}
        />
        <Row label="Cards"    value={`${selectedCardIds.length} in wallet`} action={{ text: 'Manage', onClick: () => nav('/cards') }} />
        <Row label="Alerts"   value="Push, location, email" />
        <Row label="Privacy"  value="Read-only · no selling" />

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChunkyBtn bg={T.sky}   fg={T.ink} w="100%" onClick={() => nav('/push')}>Preview push alert</ChunkyBtn>
          <ChunkyBtn bg={T.cream} fg={T.ink} w="100%" onClick={() => nav('/system')}>Design system</ChunkyBtn>
          <ChunkyBtn bg={T.coral} fg="#fff" w="100%" onClick={signOut}>Sign out</ChunkyBtn>
        </div>

        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 11, color: T.dim }}>
          Swipewise v2 · prototype build
        </div>
      </div>

      <BottomNav active="settings" />
    </div>
  );
}

function Row({ label, value, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px', background: T.cream,
      border: `1.5px solid ${T.ink}`, borderRadius: 12, marginBottom: 10,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: T.dim, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{value}</div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: T.paper, color: T.ink, border: `1.5px solid ${T.ink}`,
            borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700,
            boxShadow: `2px 2px 0 0 ${T.ink}`, cursor: 'pointer', fontFamily: T.body,
          }}
        >{action.text}</button>
      )}
    </div>
  );
}
