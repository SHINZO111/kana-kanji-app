// Simplified SM-2 style spaced-repetition scheduling (see plan Phase 7
// "簡易SRS"). Deliberately not full SM-2: there's no 0-5 recall grade to
// work with, just a binary clean/mistake signal from StrokeQuiz's mistake
// count (see progress-store.ts recordAttempt). The ease factor still dips
// on a mistake, so characters that are mistake-prone converge to shorter
// review intervals than a character that just had one bad day.

export const DEFAULT_EASE = 2.5
const MIN_EASE = 1.3
const EASE_PENALTY_ON_MISTAKE = 0.2
const FIRST_SUCCESS_INTERVAL_DAYS = 1

export interface SrsFields {
  /** Days until the next review, as of the last graded attempt. */
  interval: number
  /** SM-2 ease factor; multiplies interval growth on each clean pass. */
  ease: number
  /** Local calendar date (YYYY-MM-DD) this character is next due for review. */
  dueDate: string
}

/** Local calendar date (not UTC) as YYYY-MM-DD, so "today" matches the device's own clock/timezone. */
export function todayDateString(): string {
  return dateToDateString(new Date())
}

function dateToDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(dateString: string, days: number): string {
  const [y, m, d] = dateString.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return dateToDateString(date)
}

/**
 * Computes the next interval/ease/dueDate after one graded practice attempt.
 * - Clean (no mistakes): interval grows by the current ease factor (a first
 *   success jumps straight to 1 day, since interval * ease from a starting
 *   interval of 0 would stay 0 forever).
 * - Any mistake: interval resets to 0 (due again today) and ease dips
 *   slightly (floored at MIN_EASE), so a mistake-prone character's next
 *   clean pass still lands on a shorter interval than one that's never
 *   been missed.
 */
export function computeNextSrs(
  current: Pick<SrsFields, 'interval' | 'ease'>,
  isClean: boolean,
): SrsFields {
  if (!isClean) {
    return {
      interval: 0,
      ease: Math.max(MIN_EASE, current.ease - EASE_PENALTY_ON_MISTAKE),
      dueDate: todayDateString(),
    }
  }

  const interval =
    current.interval <= 0 ? FIRST_SUCCESS_INTERVAL_DAYS : Math.round(current.interval * current.ease)

  return {
    interval,
    ease: current.ease,
    dueDate: addDays(todayDateString(), interval),
  }
}

/** True when `dueDate` is today or earlier (i.e. this character is ready for review now). */
export function isDueToday(dueDate: string): boolean {
  return dueDate <= todayDateString()
}

const DUE_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * True when `value` is a syntactically valid `YYYY-MM-DD` string that also
 * round-trips through the Gregorian calendar (rejects e.g. "2024-02-30").
 * Used by progress-store.ts to sanitize CharProgress.dueDate read from
 * IndexedDB, which could be corrupted by a bad write, manual DB edits, or a
 * future storage-format change we haven't migrated for yet.
 */
export function isValidDueDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DUE_DATE_PATTERN.test(value)) return false

  const [, yearStr, monthStr, dayStr] = value.match(DUE_DATE_PATTERN) ?? []
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
