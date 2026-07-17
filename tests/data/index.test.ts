// Validates public/data/index.json — the lightweight per-character index
// used by Browse and Practice (see src/lib/character-index.ts).

import { describe, expect, it } from 'vitest'
import type { IndexEntry } from '../../src/lib/types'
import { readJson } from '../helpers/data-files'

const index = readJson<IndexEntry[]>('index.json')

const EXPECTED_TOTAL = 2228
const EXPECTED_KANA = 92
const EXPECTED_KANJI = 2136
const EXPECTED_GRADE_COUNTS: Record<number, number> = {
  1: 80,
  2: 160,
  3: 200,
  4: 202,
  5: 193,
  6: 191,
  8: 1110,
}

describe('public/data/index.json', () => {
  it(`contains exactly ${EXPECTED_TOTAL} entries`, () => {
    expect(index).toHaveLength(EXPECTED_TOTAL)
  })

  it(`contains ${EXPECTED_KANA} kana and ${EXPECTED_KANJI} kanji`, () => {
    const kana = index.filter((e) => e.kind === 'hiragana' || e.kind === 'katakana')
    const kanji = index.filter((e) => e.kind === 'kanji')
    expect(kana).toHaveLength(EXPECTED_KANA)
    expect(kanji).toHaveLength(EXPECTED_KANJI)
    // Every entry is one of the three kinds (no unknown kind slips through).
    expect(kana.length + kanji.length).toBe(index.length)
  })

  it('splits kana evenly: 46 hiragana + 46 katakana', () => {
    expect(index.filter((e) => e.kind === 'hiragana')).toHaveLength(46)
    expect(index.filter((e) => e.kind === 'katakana')).toHaveLength(46)
  })

  it('matches the expected per-grade kanji counts', () => {
    const actual: Record<number, number> = {}
    for (const entry of index) {
      if (entry.kind !== 'kanji') continue
      expect(entry.grade, `kanji ${entry.char} must have a grade`).not.toBeNull()
      actual[entry.grade as number] = (actual[entry.grade as number] ?? 0) + 1
    }
    expect(actual).toEqual(EXPECTED_GRADE_COUNTS)
  })

  it('has no duplicate characters', () => {
    const chars = new Set(index.map((e) => e.char))
    expect(chars.size).toBe(index.length)
  })

  it('every entry has the required fields with valid values', () => {
    const violations: string[] = []
    for (const entry of index) {
      if (typeof entry.char !== 'string' || entry.char.length === 0) {
        violations.push(`bad char: ${JSON.stringify(entry.char)}`)
      }
      if (!['hiragana', 'katakana', 'kanji'].includes(entry.kind)) {
        violations.push(`${entry.char}: bad kind ${String(entry.kind)}`)
      }
      if (!(Number.isInteger(entry.strokeCount) && entry.strokeCount > 0)) {
        violations.push(`${entry.char}: bad strokeCount ${String(entry.strokeCount)}`)
      }
      if (!(entry.grade === null || (Number.isInteger(entry.grade) && entry.grade >= 1))) {
        violations.push(`${entry.char}: bad grade ${String(entry.grade)}`)
      }
      if (!(entry.jlpt === null || (Number.isInteger(entry.jlpt) && entry.jlpt >= 1 && entry.jlpt <= 4))) {
        violations.push(`${entry.char}: bad jlpt ${String(entry.jlpt)}`)
      }
      if (typeof entry.meaning !== 'string') violations.push(`${entry.char}: meaning not a string`)
      if (!Array.isArray(entry.meanings)) violations.push(`${entry.char}: meanings not an array`)
      if (!Array.isArray(entry.readings)) violations.push(`${entry.char}: readings not an array`)
    }
    expect(violations, violations.slice(0, 20).join('; ')).toHaveLength(0)
  })

  it('kana entries have romaji; kanji entries have meanings and readings', () => {
    const violations: string[] = []
    for (const entry of index) {
      if (entry.kind === 'kanji') {
        if (entry.meanings.length === 0) violations.push(`${entry.char}: kanji without meanings`)
        if (entry.readings.length === 0) violations.push(`${entry.char}: kanji without readings`)
      } else if (typeof entry.romaji !== 'string' || entry.romaji.length === 0) {
        violations.push(`${entry.char}: kana without romaji`)
      }
    }
    expect(violations, violations.slice(0, 20).join('; ')).toHaveLength(0)
  })
})
