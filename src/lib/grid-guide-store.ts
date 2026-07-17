// Remembers whether the calligraphy-style grid guide (see
// components/stroke/GridGuide.tsx) is shown behind characters. Shared by
// both StrokeAnimator (CharacterDetail) and Practice so toggling it on one
// screen carries over to the other, and persists across visits. localStorage
// (not progress-store's IndexedDB) is deliberate — like last-practice-set.ts,
// this is a tiny local UI preference, not learner progress data.

const STORAGE_KEY = 'kana-kanji:show-grid-guide'

/** Defaults to true (grid shown) when unset or storage is unavailable. */
export function getShowGridGuide(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    // Storage may be unavailable (e.g. private browsing); fall back to the default.
    return true
  }
}

export function setShowGridGuide(value: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // Ignore write failures — this is a non-critical UX nicety.
  }
}
