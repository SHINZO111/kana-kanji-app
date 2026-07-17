import { Capacitor } from '@capacitor/core'
import { registerSW } from 'virtual:pwa-register'

/**
 * Registers the PWA service worker, except inside the Capacitor native
 * shell. The Android build bundles every asset (JS/CSS/HTML plus all
 * public/data/**\/*.json, including the ~2,228 stroke files) directly into
 * the APK, so there is nothing for a service worker to cache offline that
 * isn't already local. Registering it there would only add a second,
 * redundant cache layer that can go stale across app updates (a known
 * failure mode for PWA service workers wrapped in native WebViews: the SW
 * can keep serving assets from a previous APK version instead of the
 * freshly installed one). The web build still registers normally so
 * browser/PWA installs keep full offline support.
 */
export function registerServiceWorker(): void {
  if (Capacitor.isNativePlatform()) return
  registerSW({ immediate: true })
}
