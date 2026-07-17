// Unit tests for src/lib/practice-sets.ts: fixed-set building from the
// real index.json (served via a fetch stub) and the SRS-driven review set
// (against fake-indexeddb records written through progress-store).

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadPracticeSet, loadReviewSet, practiceSetLabel } from '../../src/lib/practice-sets'
import type { PracticeSetId } from '../../src/lib/practice-sets'
import { setProgress } from '../../src/lib/progress-store'
import { DEFAULT_EASE } from '../../src/lib/srs'
import { en } from '../../src/lib/i18n/en'
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
  vi.setSystemTime(new Date(2026, 6, 17, 12, 0, 0)) // today = 2026-07-17
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function progressRecord(char: string, mastery: Mastery, dueDate: string): CharProgress {
  return {
    char,
    traceSuccesses: 1,
    traceFails: 0,
    lastPracticed: '2026-07-01T00:00:00.000Z',
    mastery,
    cleanStreak: 1,
    interval: 1,
    ease: DEFAULT_EASE,
    dueDate,
  }
}

describe('loadPracticeSet', () => {
  const EXPECTED_SIZES: Record<PracticeSetId, number> = {
    hiragana: 46,
    katakana: 46,
    grade1: 80,
    grade2: 160,
    grade3: 200,
    grade4: 202,
    grade5: 193,
    grade6: 191,
    grade8: 1110,
  }

  for (const [setId, size] of Object.entries(EXPECTED_SIZES) as [PracticeSetId, number][]) {
    it(`${setId} contains ${size} characters`, async () => {
      const chars = await loadPracticeSet(setId)
      expect(chars).toHaveLength(size)
      expect(new Set(chars).size).toBe(size) // no duplicates
    })
  }

  it('hiragana starts with あ and grade1 contains 水', async () => {
    expect((await loadPracticeSet('hiragana'))[0]).toBe('あ')
    expect(await loadPracticeSet('grade1')).toContain('水')
  })

  it('sets are disjoint across grades', async () => {
    const grade1 = new Set(await loadPracticeSet('grade1'))
    const grade2 = await loadPracticeSet('grade2')
    expect(grade2.some((c) => grade1.has(c))).toBe(false)
  })
})

describe('loadReviewSet', () => {
  // Distinct keys per test — the fake IndexedDB persists across tests in
  // this file, so assertions check membership, not exact equality.
  it('includes seen characters due today or earlier, excludes future ones', async () => {
    await setProgress(progressRecord('復1', 2, '2026-07-17')) // due today
    await setProgress(progressRecord('復2', 2, '2026-07-01')) // overdue
    await setProgress(progressRecord('復3', 2, '2026-08-01')) // future
    const review = await loadReviewSet()
    expect(review).toContain('復1')
    expect(review).toContain('復2')
    expect(review).not.toContain('復3')
  })

  it('excludes mastery 0 records even when their dueDate has arrived', async () => {
    await setProgress(progressRecord('復4', 0, '2026-07-01'))
    expect(await loadReviewSet()).not.toContain('復4')
  })

  it('includes mastered (mastery 3) characters once they fall due — SRS resurfacing', async () => {
    await setProgress(progressRecord('復5', 3, '2026-07-16'))
    await setProgress(progressRecord('復6', 3, '2027-01-01'))
    const review = await loadReviewSet()
    expect(review).toContain('復5')
    expect(review).not.toContain('復6')
  })

  it('includes "seen but never practiced" characters (mastery 1, due today)', async () => {
    await setProgress(progressRecord('復7', 1, '2026-07-17'))
    expect(await loadReviewSet()).toContain('復7')
  })
})

describe('practiceSetLabel', () => {
  it('maps kana sets to the browse tab labels', () => {
    expect(practiceSetLabel('hiragana', en)).toBe(en.browse.tabHiragana)
    expect(practiceSetLabel('katakana', en)).toBe(en.browse.tabKatakana)
  })

  it('maps grade sets through gradeLabel (incl. grade 8 = other jouyou)', () => {
    expect(practiceSetLabel('grade1', en)).toBe('Grade 1')
    expect(practiceSetLabel('grade8', en)).toBe('Jouyou kanji')
  })
})
