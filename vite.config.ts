import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Regletas - Aprende Jugando',
        short_name: 'Regletas',
        description: 'Aprende matemáticas con regletas de colores',
        theme_color: '#6C5CE7',
        background_color: '#F8F9FF',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['education', 'kids'],
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
