import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { CARDS } from '../data/cards.js';

const AppStateCtx = createContext(null);

// Default: everyone starts with all six cards visible, none "in wallet".
// User picks their cards in Onboarding or Settings.
const DEFAULTS = {
  phone: '',
  otp: '',
  selectedCardIds: [],
  bankConnected: false,
  autoPush: false,
  usualBasket: 100,
  useGooglePlaces: false,
};

async function loadPersisted() {
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    try {
      const { value } = await Preferences.get({ key: `sw:${key}` });
      if (value != null) out[key] = JSON.parse(value);
    } catch { /* ignore */ }
  }
  return out;
}

async function persist(key, value) {
  try {
    await Preferences.set({ key: `sw:${key}`, value: JSON.stringify(value) });
  } catch { /* ignore */ }
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadPersisted().then((s) => { setState(s); setReady(true); });
  }, []);

  const update = (patch) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      for (const [k, v] of Object.entries(patch)) persist(k, v);
      return next;
    });
  };

  const toggleCard = (id) => {
    setState((prev) => {
      const selectedCardIds = prev.selectedCardIds.includes(id)
        ? prev.selectedCardIds.filter((x) => x !== id)
        : [...prev.selectedCardIds, id];
      persist('selectedCardIds', selectedCardIds);
      return { ...prev, selectedCardIds };
    });
  };

  const value = useMemo(() => ({
    ready,
    catalog: CARDS,
    ...state,
    setPhone:         (v) => update({ phone: v }),
    setOtp:           (v) => update({ otp: v }),
    setSelectedCardIds: (v) => update({ selectedCardIds: v }),
    setBankConnected: (v) => update({ bankConnected: v }),
    setAutoPush:      (v) => update({ autoPush: v }),
    setUsualBasket:   (v) => update({ usualBasket: v }),
    setUseGooglePlaces: (v) => update({ useGooglePlaces: v }),
    toggleCard,
  }), [ready, state]);

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
