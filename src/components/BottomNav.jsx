import React from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../design/tokens.js';

const ITEMS = [
  { id: 'home',     l: 'Home',     i: '⌂', path: '/home' },
  { id: 'cards',    l: 'Cards',    i: '▭', path: '/cards' },
  { id: 'insights', l: 'Insights', i: '◎', path: '/insights' },
  { id: 'settings', l: 'Settings', i: '⚙︎', path: '/settings' },
];

export default function BottomNav({ active }) {
  const nav = useNavigate();
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: T.paper, borderTop: `2px solid ${T.ink}`,
      display: 'flex', padding: '10px 0 24px',
      fontFamily: T.body,
    }}>
      {ITEMS.map((x) => (
        <button
          key={x.id}
          onClick={() => nav(x.path)}
          style={{
            flex: 1, textAlign: 'center',
            color: x.id === active ? T.ink : T.dim,
            fontWeight: x.id === active ? 800 : 600,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: T.body, padding: '4px 0',
          }}
        >
          <div style={{ fontSize: 20 }}>{x.i}</div>
          <div style={{ fontSize: 11, marginTop: 2 }}>{x.l}</div>
        </button>
      ))}
    </div>
  );
}
