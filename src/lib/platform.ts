// Lightweight iOS/iPadOS device detection, used only to decide which
// install-guide card (Android APK vs. iOS "Add to Home Screen") to show
// first on the Home page. Not used for any gating — both cards always render.

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIPhoneOrIPod = /iPhone|iPod/.test(ua)
  // iPadOS 13+ reports as "Macintosh" in the UA string (desktop-class Safari),
  // but exposes multi-touch — real desktop Macs don't — so that's how we
  // tell an iPad apart from an actual Mac.
  const isIPad = /iPad/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
  return isIPhoneOrIPod || isIPad
}
