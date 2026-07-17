// Remembers which practice set the user last started, so Home's "Continue
// practicing" link can jump straight back into it. localStorage (not
// progress-store's IndexedDB) is deliberate here: this is a tiny, purely
// local UI preference, not learner progress data.

import type { PracticeSetId } from './practice-sets'

const STORAGE_KEY = 'kana-kanji:last-practice-set'

const VALID_SET_IDS: readonly PracticeSetId[] = [
  'hiragana',
  'katakana',
  'grade1',
  'grade2',
  'grade3',
  'grade4',
  'grade5',
  'grade6',
  'grade8',
]

export function getLastPracticeSetId(): PracticeSetId | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return VALID_SET_IDS.includes(value as PracticeSetId) ? (value as PracticeSetId) : null
  } catch {
    // Storage may be unavailable (e.g. private browsing); treat as "no last set".
    return null
  }
}

export function setLastPracticeSetId(setId: PracticeSetId): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, setId)
  } catch {
    // Ignore write failures — this is a non-critical UX nicety.
  }
}
