import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PhoneFrame from './design/PhoneFrame.jsx';
import { AppStateProvider } from './state/AppState.jsx';

import Landing    from './screens/Landing.jsx';
import AuthPhone  from './screens/AuthPhone.jsx';
import AuthOTP    from './screens/AuthOTP.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Home       from './screens/Home.jsx';
import Cards      from './screens/Cards.jsx';
import Insights   from './screens/Insights.jsx';
import Settings   from './screens/Settings.jsx';
import Push       from './screens/Push.jsx';
import System     from './screens/System.jsx';

export default function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route path="/"              element={<Frame><Landing    /></Frame>} />
        <Route path="/auth/phone"    element={<Frame><AuthPhone  /></Frame>} />
        <Route path="/auth/otp"      element={<Frame><AuthOTP    /></Frame>} />
        <Route path="/onboarding"    element={<Frame><Onboarding /></Frame>} />
        <Route path="/home"          element={<Frame><Home       /></Frame>} />
        <Route path="/cards"         element={<Frame><Cards      /></Frame>} />
        <Route path="/insights"      element={<Frame><Insights   /></Frame>} />
        <Route path="/settings"      element={<Frame><Settings   /></Frame>} />
        <Route path="/push"          element={<Frame dark><Push /></Frame>} />
        <Route path="/system"        element={<Frame><System     /></Frame>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </AppStateProvider>
  );
}

function Frame({ children, dark }) {
  return <PhoneFrame dark={dark}>{children}</PhoneFrame>;
}
