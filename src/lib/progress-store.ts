// Progress storage backed by IndexedDB (via idb-keyval).
// Kept behind a small interface so a future cloud-sync backend can be
// swapped in without touching call sites (see plan Phase 7).

import { createStore, get, set, values } from 'idb-keyval'
import type { CharProgress, Mastery } from './types'
import { DEFAULT_EASE, computeNextSrs, isValidDueDate, todayDateString } from './srs'

const store = createStore('kana-kanji-progress', 'progress')

const VALID_MASTERY_VALUES: readonly Mastery[] = [0, 1, 2, 3]

function isValidMastery(value: unknown): value is Mastery {
  return typeof value === 'number' && VALID_MASTERY_VALUES.includes(value as Mastery)
}

/** Finite, non-negative number — used for counters and SRS interval/ease. */
function isValidNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

/**
 * Normalizes a CharProgress record read from IndexedDB: fills in fields
 * missing from records written before Phase 7's SRS fields existed, *and*
 * falls back to a safe default for any field that's present but corrupted
 * (e.g. a `mastery: 99` or `dueDate: "garbage"` written by a bug, a manual
 * DB edit, or a future storage-format change we haven't migrated for yet).
 * Every CharProgress the rest of the app sees has gone through here, so
 * nothing downstream needs to re-validate these fields.
 *
 * A record with no (or an invalid) dueDate is treated as due today — it
 * hasn't been meaningfully scheduled, so it's safe (and matches
 * pre-Phase-7 behavior) to surface it as a review candidate immediately
 * rather than hiding it until some arbitrary future date.
 */
function sanitizeProgress(progress: CharProgress): CharProgress {
  return {
    ...progress,
    traceSuccesses: isValidNonNegativeNumber(progress.traceSuccesses) ? progress.traceSuccesses : 0,
    traceFails: isValidNonNegativeNumber(progress.traceFails) ? progress.traceFails : 0,
    lastPracticed: typeof progress.lastPracticed === 'string' ? progress.lastPracticed : '',
    mastery: isValidMastery(progress.mastery) ? progress.mastery : 0,
    cleanStreak: isValidNonNegativeNumber(progress.cleanStreak) ? progress.cleanStreak : 0,
    interval: isValidNonNegativeNumber(progress.interval) ? progress.interval : 0,
    ease: isValidNonNegativeNumber(progress.ease) ? progress.ease : DEFAULT_EASE,
    dueDate: isValidDueDate(progress.dueDate) ? progress.dueDate : todayDateString(),
  }
}

export async function getProgress(char: string): Promise<CharProgress | undefined> {
  const record = await get<CharProgress>(char, store)
  return record ? sanitizeProgress(record) : undefined
}

export async function getAllProgress(): Promise<CharProgress[]> {
  const records = await values<CharProgress>(store)
  return records.map(sanitizeProgress)
}

export async function setProgress(progress: CharProgress): Promise<void> {
  await set(progress.char, progress, store)
}

/**
 * Records the outcome of one completed StrokeQuiz run (see
 * components/stroke/StrokeQuiz.tsx `onComplete`) and updates mastery + the
 * SRS schedule (see lib/srs.ts).
 *
 * Rule (per plan Phase 3): 3 consecutive no-mistake completions promotes a
 * character to mastery=3. A completion with any mistakes resets the streak
 * but does not downgrade a character that has already reached mastery=3.
 * Mastered characters keep getting scheduled for review, though — that's
 * the point of Phase 7's SRS: dueDate keeps growing on every clean pass
 * regardless of mastery, so even "mastered" characters resurface once their
 * interval elapses (see practice-sets.ts loadReviewSet).
 */
export async function recordAttempt(char: string, totalMistakes: number): Promise<CharProgress> {
  const existing = await getProgress(char)
  const isClean = totalMistakes === 0

  const traceSuccesses = (existing?.traceSuccesses ?? 0) + (isClean ? 1 : 0)
  const traceFails = (existing?.traceFails ?? 0) + (isClean ? 0 : 1)
  const cleanStreak = isClean ? (existing?.cleanStreak ?? 0) + 1 : 0

  const mastery = nextMastery(existing?.mastery ?? 0, cleanStreak, isClean)

  const srs = computeNextSrs(
    { interval: existing?.interval ?? 0, ease: existing?.ease ?? DEFAULT_EASE },
    isClean,
  )

  const updated: CharProgress = {
    char,
    traceSuccesses,
    traceFails,
    lastPracticed: new Date().toISOString(),
    mastery,
    cleanStreak,
    ...srs,
  }
  await setProgress(updated)
  return updated
}

function nextMastery(current: Mastery, cleanStreak: number, isClean: boolean): Mastery {
  if (cleanStreak >= 3) return 3
  // Any completed attempt (clean or not) counts as active practice.
  if (isClean || current < 2) return (Math.max(current, 2) as Mastery)
  return current
}

/**
 * Called when CharacterDetail displays a character. Bumps mastery from
 * 0 (never seen) to 1 (seen) so Home's "today's review" can tell "never
 * seen" apart from "seen but not yet practiced" (see CLAUDE.md handoff
 * notes). Mastery is monotonic here — never lowers an existing value, and
 * never touches trace counters or an existing SRS schedule (only
 * recordAttempt does that). A brand-new record gets dueDate = today, so
 * "seen but never practiced" characters are review candidates right away
 * (see practice-sets.ts loadReviewSet) — same as pre-Phase-7 behavior.
 */
export async function markViewed(char: string): Promise<CharProgress> {
  const existing = await getProgress(char)
  if (existing && existing.mastery > 0) return existing

  const updated: CharProgress = {
    char,
    traceSuccesses: existing?.traceSuccesses ?? 0,
    traceFails: existing?.traceFails ?? 0,
    lastPracticed: existing?.lastPracticed ?? '',
    mastery: 1,
    cleanStreak: existing?.cleanStreak ?? 0,
    interval: existing?.interval ?? 0,
    ease: existing?.ease ?? DEFAULT_EASE,
    dueDate: existing?.dueDate ?? todayDateString(),
  }
  await setProgress(updated)
  return updated
}
