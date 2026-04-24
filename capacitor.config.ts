import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.swipewise.app',
  appName: 'Swipewise',
  webDir: 'dist',
  server: {
    // In dev we point the native shell at the Vite server on our LAN.
    // Leave undefined in production so the bundled /dist is used.
    iosScheme: 'swipewise',
  },
  ios: {
    contentInset: 'always',
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#D4B254',
    },
  },
};

export default config;
