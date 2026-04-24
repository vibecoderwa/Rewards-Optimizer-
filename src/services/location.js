// Unified location API: uses Capacitor Geolocation when running on iOS,
// falls back to the browser's navigator.geolocation on the web (dev).

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

const NATIVE = Capacitor.isNativePlatform();

export async function requestLocationPermission() {
  if (NATIVE) {
    const result = await Geolocation.requestPermissions({ permissions: ['location'] });
    return result.location === 'granted';
  }
  // Browser: permission is requested on first getCurrentPosition call.
  return true;
}

export async function getCurrentLocation() {
  if (NATIVE) {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  }
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation unavailable'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Rough distance in meters between two lat/lon pairs (Haversine).
export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(m) {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  return `${(m / 1609).toFixed(1)} mi`;
}
