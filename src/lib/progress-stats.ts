// Aggregates public/data/index.json + progress-store records into the
// category breakdown shown on the Progress page (see plan Phase 5).
// Pure data logic, no React — kept separate so it's independently testable
// and reusable if Home's stats ever need the same breakdown.

import { loadCharacterIndex } from './character-index'
import { getAllProgress } from './progress-store'
import { isDueToday } from './srs'
import type { IndexEntry, Mastery } from './types'
import type { PracticeSetId } from './practice-sets'

/** Category order matches PRACTICE_TEXT.sets (hiragana, katakana, then grade1..grade6, grade8). */
export const PROGRESS_CATEGORY_IDS: readonly PracticeSetId[] = [
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

export interface CategoryStats {
  id: PracticeSetId
  total: number
  /** mastery === 3 */
  mastered: number
  /** mastery === 1 or 2 */
  practicing: number
  /** mastery === 0 (no record, or record with mastery 0) */
  notStarted: number
  /** Sum of traceSuccesses + traceFails for characters in this category. */
  attempts: number
}

export interface ProgressStats {
  categories: CategoryStats[]
  overall: {
    total: number
    mastered: number
    practicing: number
    notStarted: number
    attempts: number
    /** 0-100, rounded. 0 when total is 0. */
    masteryRate: number
    /**
     * Most recent lastPracticed ISO timestamp across all progress records,
     * or null if nothing has a non-empty lastPracticed yet.
     *
     * NOTE: markViewed() writes records with lastPracticed: '' (a character
     * that's been seen but never traced) — those are excluded here rather
     * than sorting first as the "most recent" date.
     */
    lastPracticed: string | null
    /**
     * Count of characters currently due for review (see lib/srs.ts +
     * practice-sets.ts loadReviewSet — same definition: mastery > 0 and
     * dueDate <= today). Shown on the Progress page (Phase 7 SRS).
     */
    reviewDueToday: number
  }
}

function categoryOf(entry: IndexEntry): PracticeSetId | null {
  if (entry.kind === 'hiragana') return 'hiragana'
  if (entry.kind === 'katakana') return 'katakana'
  if (entry.kind === 'kanji' && entry.grade != null) {
    const id = `grade${entry.grade}` as PracticeSetId
    return PROGRESS_CATEGORY_IDS.includes(id) ? id : null
  }
  return null
}

function emptyCategoryStats(id: PracticeSetId): CategoryStats {
  return { id, total: 0, mastered: 0, practicing: 0, notStarted: 0, attempts: 0 }
}

function bucketOf(mastery: Mastery): 'mastered' | 'practicing' | 'notStarted' {
  if (mastery === 3) return 'mastered'
  if (mastery === 1 || mastery === 2) return 'practicing'
  return 'notStarted'
}

export async function computeProgressStats(): Promise<ProgressStats> {
  const [index, progress] = await Promise.all([loadCharacterIndex(), getAllProgress()])
  const recordByChar = new Map(progress.map((record) => [record.char, record]))

  const buckets = new Map<PracticeSetId, CategoryStats>(
    PROGRESS_CATEGORY_IDS.map((id) => [id, emptyCategoryStats(id)]),
  )

  for (const entry of index) {
    const categoryId = categoryOf(entry)
    if (!categoryId) continue
    const stats = buckets.get(categoryId)
    if (!stats) continue

    const record = recordByChar.get(entry.char)
    stats.total += 1
    stats[bucketOf(record?.mastery ?? 0)] += 1
    if (record) stats.attempts += record.traceSuccesses + record.traceFails
  }

  const categories = PROGRESS_CATEGORY_IDS.map((id) => buckets.get(id) as CategoryStats)

  const overall = categories.reduce(
    (acc, c) => ({
      total: acc.total + c.total,
      mastered: acc.mastered + c.mastered,
      practicing: acc.practicing + c.practicing,
      notStarted: acc.notStarted + c.notStarted,
      attempts: acc.attempts + c.attempts,
    }),
    { total: 0, mastered: 0, practicing: 0, notStarted: 0, attempts: 0 },
  )

  const lastPracticed = progress
    .map((record) => record.lastPracticed)
    .filter((date): date is string => date !== '')
    .reduce<string | null>((latest, date) => (latest === null || date > latest ? date : latest), null)

  const reviewDueToday = progress.filter((p) => p.mastery > 0 && isDueToday(p.dueDate)).length

  return {
    categories,
    overall: {
      ...overall,
      masteryRate: overall.total > 0 ? Math.round((overall.mastered / overall.total) * 100) : 0,
      lastPracticed,
      reviewDueToday,
    },
  }
}
