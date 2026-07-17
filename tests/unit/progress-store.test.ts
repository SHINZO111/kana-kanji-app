// Unit tests for src/lib/progress-store.ts against a fake IndexedDB
// (see tests/setup.ts). Each test uses its own unique character keys so
// tests stay independent without wiping the shared fake DB.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAllProgress,
  getProgress,
  markViewed,
  recordAttempt,
  setProgress,
} from '../../src/lib/progress-store'
import { DEFAULT_EASE } from '../../src/lib/srs'
import type { CharProgress } from '../../src/lib/types'

const FIXED_NOW = new Date(2026, 6, 17, 12, 0, 0) // 2026-07-17 local
const TODAY = '2026-07-17'

beforeEach(() => {
  // Only fake Date — faking setTimeout/setImmediate would stall
  // fake-indexeddb's internal task queue and deadlock every awaited IDB op.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

/** Writes a raw (possibly corrupt) record, bypassing all sanitization. */
async function writeRaw(record: Record<string, unknown>): Promise<void> {
  await setProgress(record as unknown as CharProgress)
}

describe('recordAttempt', () => {
  it('creates a fresh record on the first clean attempt', () => {
    return recordAttempt('試1', 0).then((result) => {
      expect(result).toMatchObject({
        char: '試1',
        traceSuccesses: 1,
        traceFails: 0,
        cleanStreak: 1,
        mastery: 2,
        interval: 1,
        ease: DEFAULT_EASE,
        dueDate: '2026-07-18',
      })
      expect(result.lastPracticed).toBe(FIXED_NOW.toISOString())
    })
  })

  it('creates a fresh record on the first mistaken attempt (mastery 2, streak 0)', async () => {
    const result = await recordAttempt('試2', 3)
    expect(result).toMatchObject({
      char: '試2',
      traceSuccesses: 0,
      traceFails: 1,
      cleanStreak: 0,
      mastery: 2,
      interval: 0,
      dueDate: TODAY,
    })
    expect(result.ease).toBeCloseTo(DEFAULT_EASE - 0.2)
  })

  it('promotes to mastery 3 after 3 consecutive clean attempts', async () => {
    await recordAttempt('試3', 0)
    const second = await recordAttempt('試3', 0)
    expect(second.mastery).toBe(2)
    expect(second.cleanStreak).toBe(2)
    const third = await recordAttempt('試3', 0)
    expect(third.mastery).toBe(3)
    expect(third.cleanStreak).toBe(3)
  })

  it('a mistake resets the streak but never downgrades mastery 3', async () => {
    await recordAttempt('試4', 0)
    await recordAttempt('試4', 0)
    await recordAttempt('試4', 0) // mastery 3
    const afterMistake = await recordAttempt('試4', 2)
    expect(afterMistake.mastery).toBe(3)
    expect(afterMistake.cleanStreak).toBe(0)
    expect(afterMistake.traceFails).toBe(1)
    // The streak really did reset: two cleans stay at mastery 3 via streak 2.
    const next = await recordAttempt('試4', 0)
    expect(next.cleanStreak).toBe(1)
  })

  it('a mistake before mastery keeps the character at mastery 2', async () => {
    await recordAttempt('試5', 0)
    await recordAttempt('試5', 0)
    const mistake = await recordAttempt('試5', 1)
    expect(mistake.mastery).toBe(2)
    expect(mistake.cleanStreak).toBe(0)
  })

  it('mastery is monotonically non-decreasing over an arbitrary attempt sequence', async () => {
    const outcomes = [1, 0, 0, 2, 0, 0, 0, 5, 0]
    let previous = 0
    for (const mistakes of outcomes) {
      const result = await recordAttempt('試6', mistakes)
      expect(result.mastery).toBeGreaterThanOrEqual(previous)
      previous = result.mastery
    }
    expect(previous).toBe(3)
  })

  it('grows the SRS interval across clean passes (1 -> 3 -> 8)', async () => {
    const first = await recordAttempt('試7', 0)
    const second = await recordAttempt('試7', 0)
    const third = await recordAttempt('試7', 0)
    expect([first.interval, second.interval, third.interval]).toEqual([1, 3, 8])
    expect(third.dueDate).toBe('2026-07-25')
  })
})

describe('markViewed', () => {
  it('bumps a never-seen character to mastery 1 with dueDate today', async () => {
    const result = await markViewed('見1')
    expect(result).toMatchObject({
      char: '見1',
      mastery: 1,
      traceSuccesses: 0,
      traceFails: 0,
      cleanStreak: 0,
      interval: 0,
      ease: DEFAULT_EASE,
      dueDate: TODAY,
      lastPracticed: '',
    })
    expect(await getProgress('見1')).toMatchObject({ mastery: 1 })
  })

  it('never lowers an existing mastery (monotonic)', async () => {
    await recordAttempt('見2', 0) // mastery 2
    const viewed = await markViewed('見2')
    expect(viewed.mastery).toBe(2)
    await recordAttempt('見2', 0)
    await recordAttempt('見2', 0) // mastery 3
    expect((await markViewed('見2')).mastery).toBe(3)
  })

  it('does not touch trace counters or an existing SRS schedule', async () => {
    const practiced = await recordAttempt('見3', 0)
    const viewed = await markViewed('見3')
    expect(viewed.traceSuccesses).toBe(practiced.traceSuccesses)
    expect(viewed.interval).toBe(practiced.interval)
    expect(viewed.dueDate).toBe(practiced.dueDate)
  })

  it('is idempotent', async () => {
    const first = await markViewed('見4')
    const second = await markViewed('見4')
    expect(second).toEqual(first)
  })
})

describe('sanitizeProgress (via the read path)', () => {
  it('fills SRS defaults into pre-Phase-7 records missing interval/ease/dueDate', async () => {
    await writeRaw({
      char: '旧1',
      traceSuccesses: 4,
      traceFails: 1,
      lastPracticed: '2026-01-01T00:00:00.000Z',
      mastery: 2,
      cleanStreak: 2,
      // interval / ease / dueDate absent (old on-disk format)
    })
    const record = await getProgress('旧1')
    expect(record).toMatchObject({
      char: '旧1',
      traceSuccesses: 4,
      mastery: 2,
      interval: 0,
      ease: DEFAULT_EASE,
      dueDate: TODAY,
    })
  })

  it('corrects corrupted values (mastery: 99, dueDate: "garbage", negative/NaN numbers)', async () => {
    await writeRaw({
      char: '壊1',
      traceSuccesses: -5,
      traceFails: Number.NaN,
      lastPracticed: 12345,
      mastery: 99,
      cleanStreak: null,
      interval: -3,
      ease: Number.POSITIVE_INFINITY,
      dueDate: 'garbage',
    })
    const record = await getProgress('壊1')
    expect(record).toEqual({
      char: '壊1',
      traceSuccesses: 0,
      traceFails: 0,
      lastPracticed: '',
      mastery: 0,
      cleanStreak: 0,
      interval: 0,
      ease: DEFAULT_EASE,
      dueDate: TODAY,
    })
  })

  it('rejects impossible calendar dates like 2024-02-30', async () => {
    await writeRaw({ char: '壊2', mastery: 1, dueDate: '2024-02-30' })
    expect((await getProgress('壊2'))?.dueDate).toBe(TODAY)
  })

  it('keeps valid values untouched while fixing only the broken ones', async () => {
    await writeRaw({
      char: '壊3',
      traceSuccesses: 7,
      traceFails: 2,
      lastPracticed: '2026-06-01T10:00:00.000Z',
      mastery: 3,
      cleanStreak: 5,
      interval: 21,
      ease: 2.7,
      dueDate: 'not-a-date',
    })
    const record = await getProgress('壊3')
    expect(record).toMatchObject({
      traceSuccesses: 7,
      traceFails: 2,
      mastery: 3,
      cleanStreak: 5,
      interval: 21,
      ease: 2.7,
      dueDate: TODAY, // only the corrupt field was reset
    })
  })

  it('sanitizes every record returned by getAllProgress', async () => {
    await writeRaw({ char: '壊4', mastery: -1, dueDate: 42 })
    const all = await getAllProgress()
    const record = all.find((r) => r.char === '壊4')
    expect(record).toMatchObject({ mastery: 0, dueDate: TODAY })
    // No record from the store escapes with an invalid mastery.
    for (const r of all) expect([0, 1, 2, 3]).toContain(r.mastery)
  })

  it('recordAttempt recovers gracefully on top of a corrupted record', async () => {
    await writeRaw({ char: '壊5', mastery: 99, interval: -10, ease: 'huh', dueDate: 'garbage' })
    const result = await recordAttempt('壊5', 0)
    expect(result.mastery).toBe(2)
    expect(result.interval).toBe(1) // treated as a first success, not interval * NaN
    expect(result.ease).toBe(DEFAULT_EASE)
    expect(result.dueDate).toBe('2026-07-18')
  })
})
