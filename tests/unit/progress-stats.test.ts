// Unit tests for src/lib/progress-stats.ts (Progress page aggregation)
// and src/lib/format-date.ts, against the real index.json + fake IndexedDB.

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computeProgressStats, PROGRESS_CATEGORY_IDS } from '../../src/lib/progress-stats'
import { setProgress } from '../../src/lib/progress-store'
import { DEFAULT_EASE } from '../../src/lib/srs'
import { formatPracticedDate } from '../../src/lib/format-date'
import type { CharProgress, Mastery } from '../../src/lib/types'

const PUBLIC_DIR = path.resolve(__dirname, '..', '..', 'public')

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      const filePath = path.join(PUBLIC_DIR, url.replace(/^\//, ''))
      return new Response(readFileSync(filePath, 'utf-8'), { status: 200 })
    }),
  )
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 6, 17, 12, 0, 0))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function record(char: string, mastery: Mastery, extras: Partial<CharProgress> = {}): CharProgress {
  return {
    char,
    traceSuccesses: 2,
    traceFails: 1,
    lastPracticed: '2026-07-10T09:00:00.000Z',
    mastery,
    cleanStreak: 0,
    interval: 1,
    ease: DEFAULT_EASE,
    dueDate: '2026-07-17',
    ...extras,
  }
}

describe('computeProgressStats', () => {
  it('category totals cover all 2,228 characters in the expected order', async () => {
    const stats = await computeProgressStats()
    expect(stats.categories.map((c) => c.id)).toEqual([...PROGRESS_CATEGORY_IDS])
    expect(stats.categories.map((c) => c.total)).toEqual([46, 46, 80, 160, 200, 202, 193, 191, 1110])
    expect(stats.overall.total).toBe(2228)
    // Buckets always partition each category.
    for (const c of stats.categories) {
      expect(c.mastered + c.practicing + c.notStarted).toBe(c.total)
    }
  })

  it('assigns records to the right buckets and counts attempts', async () => {
    await setProgress(record('あ', 3)) // hiragana, mastered, 3 attempts
    await setProgress(record('ア', 2)) // katakana, practicing
    await setProgress(record('水', 1)) // grade1, practicing (seen)
    const stats = await computeProgressStats()

    const byId = new Map(stats.categories.map((c) => [c.id, c]))
    expect(byId.get('hiragana')?.mastered).toBeGreaterThanOrEqual(1)
    expect(byId.get('katakana')?.practicing).toBeGreaterThanOrEqual(1)
    expect(byId.get('grade1')?.practicing).toBeGreaterThanOrEqual(1)
    expect(byId.get('hiragana')?.attempts).toBeGreaterThanOrEqual(3)
    expect(stats.overall.mastered).toBeGreaterThanOrEqual(1)
    expect(stats.overall.masteryRate).toBeGreaterThanOrEqual(0)
    expect(stats.overall.masteryRate).toBeLessThanOrEqual(100)
  })

  it('reviewDueToday counts seen+due records; lastPracticed picks the most recent, ignoring blanks', async () => {
    await setProgress(record('火', 2, { dueDate: '2026-07-16' })) // overdue -> due
    await setProgress(record('木', 2, { dueDate: '2027-01-01' })) // future -> not due
    await setProgress(record('金', 1, { lastPracticed: '', dueDate: '2026-07-17' })) // viewed-only, due
    await setProgress(record('土', 2, { lastPracticed: '2026-07-15T00:00:00.000Z' }))
    const stats = await computeProgressStats()

    expect(stats.overall.reviewDueToday).toBeGreaterThanOrEqual(3) // 火 + 金 + earlier due records
    expect(stats.overall.lastPracticed).not.toBe('') // '' records never win
    expect(stats.overall.lastPracticed).not.toBeNull()
  })
})

describe('formatPracticedDate', () => {
  const iso = '2026-07-10T09:00:00.000Z'

  it('formats with the language-matching locale', () => {
    expect(formatPracticedDate(iso, 'en')).toMatch(/Jul/)
    expect(formatPracticedDate(iso, 'es')).toMatch(/jul/i)
    expect(formatPracticedDate(iso, 'zh')).toContain('7月')
  })

  it('defaults to English', () => {
    expect(formatPracticedDate(iso)).toBe(formatPracticedDate(iso, 'en'))
  })
})
