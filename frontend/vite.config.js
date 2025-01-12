import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      injectRegister: 'auto', // Automatically injects the service worker into your HTML
      manifest: {
        name: 'Campus Grid', // Full app name
        short_name: 'Campus Grid', // Short name displayed under the icon
        description: 'A timetable management a[pp',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Ensures the app runs like a native app (no browser UI)
        start_url: '/',
        icons: [
          {
            src: '/assets/Icon-192x192.png', // Path to the icon in the public folder
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/Icon-512x512.png', // Optional: Add a 512x512 icon
            sizes: '512x512',
            type: 'image/png',
          }
        ],
        screenshots: [
          {
            src: '/assets/background.png',
            sizes: '1366x768',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/assets/background(1).png',
            sizes: '640x640',
            type: 'image/png'
          }
        ],
      },
    }),
  ],
});
