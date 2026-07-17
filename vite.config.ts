import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // SW stays disabled in dev by default (devOptions.enabled is unset) —
      // intentional per plan Phase 5, so `npm run dev` never serves stale
      // cached data while iterating.
      // injectRegister is off because registration must be conditional on
      // platform (see src/lib/register-sw.ts) — the Capacitor Android build
      // ships every file inside the APK, so a service worker adds nothing
      // there and only risks stale-cache bugs across APK updates. Web/PWA
      // builds still register normally.
      injectRegister: false,
      manifest: {
        name: 'KANAKANJI',
        short_name: 'KANAKANJI',
        description: 'Learn Japanese kana and kanji: stroke order, readings, and example words.',
        theme_color: '#7e14ff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache everything the app needs for full offline use, including
        // public/data/**/*.json — that's the kana/kanji index, per-character
        // detail JSON, AND the ~2,228 stroke JSON files (~6.2MB) copied into
        // public/data/strokes/ by `npm run data:strokes`. Without `json`
        // here, the default glob (js/css/html only) would silently leave
        // every character's data uncached and offline mode would only work
        // for the app shell, not for actual practice/lookup.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,woff,woff2}'],
        // Individual data files are a few KB each (per-character JSON), so
        // this only needs to comfortably clear the largest single file, not
        // the ~7.5MB combined total — the total is bounded by how many
        // files match globPatterns, not by this setting.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // The Android APK (public/download/kanakanji.apk, ~7.8MB, copied in
        // by `npm run sync:apk`) is a download link's target, not app data —
        // globPatterns' extension whitelist above already excludes .apk, but
        // this is an explicit belt-and-suspenders exclusion so a future
        // globPatterns edit can never accidentally make every web visitor's
        // browser silently precache a multi-MB Android package.
        globIgnores: ['download/**'],
      },
    }),
  ],
})
