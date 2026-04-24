import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';
import { ChunkyBtn, Pill, FakeStatus } from '../design/atoms.jsx';
import { useAppState } from '../state/AppState.jsx';
import BackButton from '../components/BackButton.jsx';

const MOCK_CODE = '421906';
const RESEND_SECONDS = 32;

export default function AuthOTP() {
  const nav = useNavigate();
  const { phone, setOtp } = useAppState();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resend, setResend] = useState(RESEND_SECONDS);
  const [err, setErr] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    if (resend <= 0) return;
    const t = setInterval(() => setResend((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resend]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handle = (i, v) => {
    const d = v.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    setErr('');
    if (d && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((x) => x !== '')) verify(next.join(''));
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = (code) => {
    if (code === MOCK_CODE) {
      setOtp(code);
      nav('/onboarding');
    } else {
      setErr('Nope — try 421906 (this is a prototype)');
    }
  };

  const mm = Math.floor(resend / 60);
  const ss = String(resend % 60).padStart(2, '0');

  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper, color: T.ink,
      fontFamily: T.body, position: 'relative', overflow: 'hidden',
    }}>
      <FakeStatus />
      <div style={{ padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackButton onClick={() => nav(-1)} />
        <div style={{ fontSize: 14, fontWeight: 600, color: T.dim, marginLeft: 6 }}>Step 2 of 3</div>
      </div>

      <div style={{ padding: '36px 24px 0' }}>
        <Pill bg={T.sky}>check your texts</Pill>
        <h1 className="display" style={{ fontSize: 44, lineHeight: 0.98, margin: '16px 0 10px', fontWeight: 900, letterSpacing: -0.03 }}>
          Six digits, and<br/>we're in.
        </h1>
        <p style={{ fontSize: 15, color: T.graphite, lineHeight: 1.4, margin: 0 }}>
          Code sent to <b>+1 {phone || '(415) ••• 0199'}</b>. Expires in 5:00.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '40px 24px 0' }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            value={d}
            onChange={(e) => handle(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            style={{
              width: 48, height: 60, background: d ? T.lemon : T.paper,
              border: `2.5px solid ${T.ink}`, borderRadius: 12,
              boxShadow: d ? `3px 3px 0 0 ${T.ink}` : `2px 2px 0 0 ${T.ink}`,
              textAlign: 'center', outline: 'none',
              fontFamily: T.display, fontWeight: 900, fontSize: 32, color: T.ink,
              caretColor: T.ink,
            }}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center', margin: '14px 24px 0', fontSize: 13, color: T.coralDk, minHeight: 18, fontWeight: 700 }}>
        {err}
      </div>

      <div style={{ textAlign: 'center', margin: '14px 24px 0' }}>
        <span style={{ fontSize: 14, color: T.graphite }}>Didn't get it? </span>
        {resend > 0 ? (
          <span style={{ fontSize: 14, fontWeight: 700, color: T.dim }}>Resend in {mm}:{ss}</span>
        ) : (
          <button
            onClick={() => setResend(RESEND_SECONDS)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: T.plumDk, textDecoration: 'underline', fontFamily: T.body, padding: 0 }}
          >Resend now</button>
        )}
      </div>

      <div style={{
        margin: '34px auto 0', width: 220, padding: 16,
        background: T.cream, border: `2px solid ${T.ink}`, borderRadius: 20,
        boxShadow: `4px 4px 0 0 ${T.ink}`,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: T.dim, marginBottom: 8 }}>SWIPEWISE</div>
        <div style={{ fontSize: 14, lineHeight: 1.4, color: T.graphite }}>
          Your code is <b style={{ color: T.ink, background: T.lemon, padding: '2px 6px', borderRadius: 4 }}>{MOCK_CODE}</b>.
          Don't share it with anyone. Not even your dog.
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 24, right: 24 }}>
        <ChunkyBtn
          bg={T.mint} fg={T.ink} size="lg" w="100%"
          onClick={() => verify(digits.join(''))}
          disabled={digits.join('').length !== 6}
        >Verify & continue</ChunkyBtn>
      </div>
    </div>
  );
}
