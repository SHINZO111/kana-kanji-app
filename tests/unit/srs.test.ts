// Unit tests for the simplified SM-2 scheduler in src/lib/srs.ts.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_EASE,
  computeNextSrs,
  isDueToday,
  isValidDueDate,
  todayDateString,
} from '../../src/lib/srs'

// Fixed local time so todayDateString()/addDays are deterministic.
const FIXED_NOW = new Date(2026, 6, 17, 12, 0, 0) // 2026-07-17 local

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('todayDateString', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(todayDateString()).toBe('2026-07-17')
  })

  it('zero-pads month and day', () => {
    vi.setSystemTime(new Date(2026, 0, 5))
    expect(todayDateString()).toBe('2026-01-05')
  })
})

describe('computeNextSrs — clean passes', () => {
  it('progresses 0 -> 1 -> 3 -> 8 days at the default ease (2.5)', () => {
    let state = { interval: 0, ease: DEFAULT_EASE }
    const intervals: number[] = []
    for (let i = 0; i < 3; i++) {
      const next = computeNextSrs(state, true)
      intervals.push(next.interval)
      state = { interval: next.interval, ease: next.ease }
    }
    // 0 -> 1 (first success), 1 * 2.5 = 2.5 -> round 3, 3 * 2.5 = 7.5 -> round 8
    expect(intervals).toEqual([1, 3, 8])
  })

  it('keeps ease unchanged on a clean pass', () => {
    const next = computeNextSrs({ interval: 3, ease: 2.1 }, true)
    expect(next.ease).toBe(2.1)
  })

  it('sets dueDate = today + interval', () => {
    const next = computeNextSrs({ interval: 3, ease: 2.5 }, true)
    expect(next.interval).toBe(8)
    expect(next.dueDate).toBe('2026-07-25')
  })

  it('a first success from interval 0 is due tomorrow', () => {
    const next = computeNextSrs({ interval: 0, ease: DEFAULT_EASE }, true)
    expect(next.dueDate).toBe('2026-07-18')
  })

  it('dueDate arithmetic rolls over month boundaries', () => {
    vi.setSystemTime(new Date(2026, 6, 30)) // 2026-07-30
    const next = computeNextSrs({ interval: 1, ease: 2.5 }, true) // interval 3
    expect(next.dueDate).toBe('2026-08-02')
  })
})

describe('computeNextSrs — mistakes', () => {
  it('resets the interval to 0 and makes the character due today', () => {
    const next = computeNextSrs({ interval: 8, ease: 2.5 }, false)
    expect(next.interval).toBe(0)
    expect(next.dueDate).toBe('2026-07-17')
  })

  it('dips ease by 0.2 per mistake', () => {
    const next = computeNextSrs({ interval: 8, ease: 2.5 }, false)
    expect(next.ease).toBeCloseTo(2.3)
  })

  it('never lets ease drop below the 1.3 floor', () => {
    let state = { interval: 5, ease: DEFAULT_EASE }
    for (let i = 0; i < 20; i++) {
      const next = computeNextSrs(state, false)
      state = { interval: next.interval, ease: next.ease }
    }
    expect(state.ease).toBe(1.3)
  })

  it('a mistake-prone character grows more slowly after recovery', () => {
    const afterMistake = computeNextSrs({ interval: 8, ease: 2.5 }, false)
    // Recover: two clean passes from the post-mistake state.
    const first = computeNextSrs(afterMistake, true) // interval 1
    const second = computeNextSrs(first, true) // 1 * 2.3 = 2.3 -> round 2
    expect(second.interval).toBe(2)
    // Versus a never-missed character at the same step: 1 * 2.5 -> 3.
    expect(computeNextSrs({ interval: 1, ease: 2.5 }, true).interval).toBe(3)
  })
})

describe('isDueToday', () => {
  it('is true for today and past dates, false for future dates', () => {
    expect(isDueToday('2026-07-17')).toBe(true)
    expect(isDueToday('2026-07-16')).toBe(true)
    expect(isDueToday('2020-01-01')).toBe(true)
    expect(isDueToday('2026-07-18')).toBe(false)
  })
})

describe('isValidDueDate', () => {
  it('accepts real YYYY-MM-DD dates', () => {
    expect(isValidDueDate('2026-07-17')).toBe(true)
    expect(isValidDueDate('2024-02-29')).toBe(true) // leap day
  })

  it('rejects malformed or impossible dates and non-strings', () => {
    expect(isValidDueDate('garbage')).toBe(false)
    expect(isValidDueDate('2026-7-17')).toBe(false)
    expect(isValidDueDate('2026-13-01')).toBe(false)
    expect(isValidDueDate('2023-02-29')).toBe(false) // not a leap year
    expect(isValidDueDate('2024-02-30')).toBe(false)
    expect(isValidDueDate('')).toBe(false)
    expect(isValidDueDate(null)).toBe(false)
    expect(isValidDueDate(20260717)).toBe(false)
    expect(isValidDueDate(new Date())).toBe(false)
  })
})
