import React, { createContext, useContext, useMemo, useState } from 'react';

const CATALOG = [
  { id: 'amex-gold',   brand: 'amex',  name: 'Amex Gold',             fee: '$325/yr' },
  { id: 'chase-csr',   brand: 'chase', name: 'Sapphire Reserve',      fee: '$795/yr' },
  { id: 'savor',       brand: 'savor', name: 'Capital One Savor',     fee: 'No fee'  },
  { id: 'chase-csp',   brand: 'chase', name: 'Sapphire Preferred',    fee: '$95/yr'  },
  { id: 'amex-plat',   brand: 'amex',  name: 'Amex Platinum',         fee: '$695/yr' },
  { id: 'amex-bce',    brand: 'amex',  name: 'Blue Cash Everyday',    fee: 'No fee'  },
  { id: 'chase-fu',    brand: 'chase', name: 'Freedom Unlimited',     fee: 'No fee'  },
  { id: 'savor-one',   brand: 'savor', name: 'SavorOne',              fee: 'No fee'  },
];

const AppStateCtx = createContext(null);

export function AppStateProvider({ children }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedCardIds, setSelectedCardIds] = useState([
    'amex-gold', 'chase-csr', 'savor',
  ]);
  const [bankConnected, setBankConnected] = useState(false);

  const value = useMemo(() => ({
    catalog: CATALOG,
    phone, setPhone,
    otp, setOtp,
    selectedCardIds, setSelectedCardIds,
    toggleCard: (id) =>
      setSelectedCardIds((cur) =>
        cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      ),
    bankConnected, setBankConnected,
  }), [phone, otp, selectedCardIds, bankConnected]);

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
