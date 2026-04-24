import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, FakeStatus } from '../design/atoms.jsx';
import { useAppState } from '../state/AppState.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { requestNotifPermission, fireLocalNotif } from '../services/notifications.js';
import { requestLocationPermission, getCurrentLocation } from '../services/location.js';

export default function Settings() {
  const nav = useNavigate();
  const {
    phone, bankConnected, setBankConnected,
    selectedCardIds, setSelectedCardIds, setPhone, setOtp,
    autoPush, setAutoPush, usualBasket, setUsualBasket,
  } = useAppState();

  const [status, setStatus] = useState('');

  const toggleAutoPush = async () => {
    if (!autoPush) {
      setStatus('Requesting permissions…');
      const loc = await requestLocationPermission();
      const notif = await requestNotifPermission();
      if (!loc)   { setStatus('Location denied. Enable in iOS Settings.'); return; }
      if (!notif) { setStatus('Notifications denied. Enable in iOS Settings.'); return; }
      setAutoPush(true); setStatus('Auto-push on.');
    } else {
      setAutoPush(false); setStatus('Auto-push off.');
    }
  };

  const testPush = async () => {
    setStatus('Sending test…');
    const ok = await requestNotifPermission();
    if (!ok) { setStatus('Allow notifications in iOS Settings first.'); return; }
    try {
      const pos = await getCurrentLocation().catch(() => null);
      await fireLocalNotif({
        title: 'Swipewise',
        body: pos
          ? `Testing alerts — you're near ${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)}.`
          : 'Testing alerts. Looks good.',
      });
      setStatus('Notification sent.');
    } catch (e) {
      setStatus('Failed: ' + e.message);
    }
  };

  const signOut = () => {
    setPhone(''); setOtp(''); setSelectedCardIds([]); setBankConnected(false); setAutoPush(false);
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
        <Row label="Phone"   value={phone || 'Not set'} />
        <Row
          label="Bank"
          value={bankConnected ? <Pill bg={T.mint}>connected</Pill> : <Pill bg={T.cream} fg={T.ink}>not connected</Pill>}
          action={bankConnected
            ? { text: 'Disconnect', onClick: () => setBankConnected(false) }
            : { text: 'Connect',    onClick: () => setBankConnected(true) }}
        />
        <Row label="Cards"   value={`${selectedCardIds.length} in wallet`} action={{ text: 'Manage', onClick: () => nav('/cards') }} />

        <Toggle
          label="Auto-push when I arrive"
          sub="Requires 'Always Allow' location + notifications"
          on={autoPush}
          onClick={toggleAutoPush}
        />

        <Row
          label="Usual basket"
          value={`$${usualBasket}`}
          sub="Used to estimate rewards on the home screen"
          action={{
            text: 'Edit',
            onClick: () => {
              const next = parseInt(prompt('Typical purchase size in $?', String(usualBasket)) || '', 10);
              if (!Number.isNaN(next) && next > 0) setUsualBasket(next);
            },
          }}
        />

        <div style={{ fontSize: 12, color: T.dim, margin: '6px 2px 14px', minHeight: 18 }}>{status}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChunkyBtn bg={T.sky}   fg={T.ink} w="100%" onClick={testPush}>Send me a test notification</ChunkyBtn>
          <ChunkyBtn bg={T.cream} fg={T.ink} w="100%" onClick={() => nav('/push')}>Preview push design</ChunkyBtn>
          <ChunkyBtn bg={T.cream} fg={T.ink} w="100%" onClick={() => nav('/system')}>Design system</ChunkyBtn>
          <ChunkyBtn bg={T.coral} fg="#fff"  w="100%" onClick={signOut}>Reset & sign out</ChunkyBtn>
        </div>

        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 11, color: T.dim }}>
          Swipewise · prototype build
        </div>
      </div>

      <BottomNav active="settings" />
    </div>
  );
}

function Row({ label, value, sub, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', background: T.cream,
      border: `1.5px solid ${T.ink}`, borderRadius: 12, marginBottom: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: T.dim, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{sub}</div>}
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

function Toggle({ label, sub, on, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '12px 14px', background: on ? T.mint : T.cream,
        border: `1.5px solid ${T.ink}`, borderRadius: 12, marginBottom: 10,
        cursor: 'pointer', fontFamily: T.body, textAlign: 'left',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: T.dim, textTransform: 'uppercase' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: T.graphite, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 46, height: 28, borderRadius: 99,
        background: on ? T.ink : T.paper, border: `1.5px solid ${T.ink}`,
        position: 'relative', transition: 'background 150ms',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 20 : 2, width: 22, height: 22, borderRadius: '50%',
          background: on ? T.lemon : T.ink, transition: 'left 150ms',
        }} />
      </div>
    </button>
  );
}
