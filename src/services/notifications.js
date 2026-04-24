// Local notifications via Capacitor.  We use these for:
//   (a) testing the push flow from the Settings screen, and
//   (b) "you arrived at X" alerts when the user opts in to auto-push.
// Actual geofence tracking is intentionally lightweight — we poll the user's
// location every N minutes when the app is foregrounded and fire a local
// notification on first arrival.  Proper background geofencing would need
// a third-party plugin; we're keeping it to the free/built-in primitives.

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const NATIVE = Capacitor.isNativePlatform();

export async function requestNotifPermission() {
  if (!NATIVE) return false;
  const res = await LocalNotifications.requestPermissions();
  return res.display === 'granted';
}

export async function fireLocalNotif({ title, body, id = Date.now() % 2147483647 }) {
  if (!NATIVE) {
    // Web fallback: use the in-page Notification API if available.
    if ('Notification' in window) {
      if (Notification.permission === 'default') await Notification.requestPermission();
      if (Notification.permission === 'granted') new Notification(title, { body });
    } else {
      console.log('[notif]', title, body);
    }
    return;
  }
  await LocalNotifications.schedule({
    notifications: [{ id, title, body, schedule: { at: new Date(Date.now() + 500) } }],
  });
}
