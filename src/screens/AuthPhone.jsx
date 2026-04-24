import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, FakeStatus } from '../design/atoms.jsx';
import { useAppState } from '../state/AppState.jsx';
import BackButton from '../components/BackButton.jsx';

function formatPhone(digits) {
  const d = digits.replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function AuthPhone() {
  const nav = useNavigate();
  const { phone, setPhone } = useAppState();
  const [raw, setRaw] = useState(phone.replace(/\D/g, '') || '4155550199');
  const ready = raw.length === 10;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;
    setPhone(formatPhone(raw));
    nav('/auth/otp');
  };

  return (
    <form onSubmit={onSubmit} style={{
      width: '100%', height: '100%', background: T.paper, color: T.ink,
      fontFamily: T.body, position: 'relative', overflow: 'hidden',
    }}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackButton onClick={() => nav(-1)} />
        <div style={{ fontSize: 14, fontWeight: 600, color: T.dim, marginLeft: 6 }}>Step 1 of 3</div>
      </div>

      <div style={{ padding: '36px 24px 0' }}>
        <Pill bg={T.mint}>sign in · no password</Pill>
        <h1 className="display" style={{ fontSize: 42, lineHeight: 0.98, margin: '16px 0 10px', fontWeight: 900, letterSpacing: -0.03 }}>
          What's your<br/>number, boss?
        </h1>
        <p style={{ fontSize: 15, color: T.graphite, lineHeight: 1.4, margin: 0 }}>
          We'll text you a code. No passwords to forget. No "your account has been breached" emails at 3am.
        </p>
      </div>

      <div style={{ margin: '28px 24px 0' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <div style={{
            background: T.cream, border: `2.5px solid ${T.ink}`, borderRadius: 14,
            padding: '14px 16px', fontWeight: 700, fontSize: 18,
            boxShadow: `3px 3px 0 0 ${T.ink}`,
            display: 'flex', alignItems: 'center', gap: 8, minWidth: 88,
          }}>🇺🇸 <span>+1</span><span style={{ fontSize: 12 }}>▾</span></div>
          <div style={{
            flex: 1, background: T.paper, border: `2.5px solid ${T.ink}`, borderRadius: 14,
            padding: '12px 14px', boxShadow: `3px 3px 0 0 ${T.ink}`,
            display: 'flex', alignItems: 'center',
          }}>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              value={formatPhone(raw)}
              onChange={(e) => setRaw(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="(555) 123-4567"
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontWeight: 700, fontSize: 22, letterSpacing: 1,
                width: '100%', color: T.ink, fontFamily: T.body,
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.dim, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          🔒 We never share your number. Unsubscribe on first text if you change your mind.
        </div>
      </div>

      <div style={{ margin: '24px 24px 0', padding: 16, background: T.cream, border: `2px solid ${T.ink}`, borderRadius: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>why no password?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: T.graphite }}>
          <div>✓ You won't forget it at tax time.</div>
          <div>✓ Phishing is useless against OTP.</div>
          <div>✓ We don't store anything we don't have to.</div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 24, right: 24 }}>
        <ChunkyBtn bg={T.ink} fg={T.paper} size="lg" w="100%" type="submit" disabled={!ready}>
          Send me a code
        </ChunkyBtn>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: T.dim, marginTop: 14, lineHeight: 1.5 }}>
          By continuing, you agree to the Terms & Privacy.<br/>Standard message rates may apply.
        </div>
      </div>
    </form>
  );
}
