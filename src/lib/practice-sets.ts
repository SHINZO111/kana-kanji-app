// Builds the character lists offered on the Practice page from the
// lightweight public/data/index.json (see plan Phase 3 + Phase 4).

import { loadCharacterIndex } from './character-index'
import { getAllProgress } from './progress-store'
import { isDueToday } from './srs'
import type { Dictionary } from './i18n/types'

export type PracticeSetId =
  | 'hiragana'
  | 'katakana'
  | 'grade1'
  | 'grade2'
  | 'grade3'
  | 'grade4'
  | 'grade5'
  | 'grade6'
  | 'grade8'

function gradeOfSet(setId: PracticeSetId): number | null {
  const match = setId.match(/^grade(\d+)$/)
  return match ? Number(match[1]) : null
}

/**
 * Short category label (no character count), used by the Progress page.
 * Takes the active language's dictionary rather than importing text
 * directly, since this is plain data logic (not a component) and can't call
 * useTranslation() itself — see components/progress/CategoryProgressRow.tsx.
 */
export function practiceSetLabel(setId: PracticeSetId, t: Dictionary): string {
  if (setId === 'hiragana') return t.browse.tabHiragana
  if (setId === 'katakana') return t.browse.tabKatakana
  const grade = gradeOfSet(setId)
  return grade !== null ? t.detail.gradeLabel(grade) : setId
}

/** Returns the ordered list of characters for a practice set. */
export async function loadPracticeSet(setId: PracticeSetId): Promise<string[]> {
  const index = await loadCharacterIndex()

  if (setId === 'hiragana' || setId === 'katakana') {
    return index.filter((entry) => entry.kind === setId).map((entry) => entry.char)
  }

  const grade = gradeOfSet(setId)
  return index
    .filter((entry) => entry.kind === 'kanji' && entry.grade === grade)
    .map((entry) => entry.char)
}

/**
 * "Today's review" set (see Home page + Phase 7 SRS): characters that have
 * been seen (mastery >= 1, set by CharacterDetail's markViewed) AND are due
 * per the SM-2-style schedule in lib/srs.ts (dueDate <= today).
 *
 * Note this deliberately does *not* exclude mastery=3 (mastered)
 * characters — that's the whole point of spaced repetition: a mastered
 * character's dueDate keeps growing on every clean pass, but it still
 * resurfaces once that interval elapses, instead of disappearing from
 * review forever the moment it first hits mastery 3.
 *
 * "Seen but never practiced" characters (mastery=1, dueDate defaulted to
 * today by markViewed/progress-store's migration) are always included,
 * matching pre-Phase-7 behavior.
 */
export async function loadReviewSet(): Promise<string[]> {
  const progress = await getAllProgress()
  return progress.filter((p) => p.mastery > 0 && isDueToday(p.dueDate)).map((p) => p.char)
}
