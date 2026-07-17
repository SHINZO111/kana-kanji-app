// Unit tests for the search helpers in src/lib/character-index.ts.
// matchesQuery/searchCharacterIndex are pure; loadCharacterIndex is
// exercised against a stubbed fetch serving the real public/data files.

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  loadCharacterIndex,
  matchesQuery,
  searchCharacterIndex,
} from '../../src/lib/character-index'
import type { IndexEntry } from '../../src/lib/types'

const PUBLIC_DIR = path.resolve(__dirname, '..', '..', 'public')

function entry(overrides: Partial<IndexEntry>): IndexEntry {
  return {
    char: '水',
    kind: 'kanji',
    grade: 1,
    jlpt: 4,
    strokeCount: 4,
    meaning: 'water',
    meanings: ['water'],
    readings: ['スイ', 'みず'],
    ...overrides,
  }
}

/** Serves public/** files through global fetch for loadCharacterIndex. */
function stubFetchFromPublicDir(): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      const filePath = path.join(PUBLIC_DIR, url.replace(/^\//, ''))
      const body = readFileSync(filePath, 'utf-8')
      return new Response(body, { status: 200 })
    }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('matchesQuery', () => {
  const water = entry({})
  const kana = entry({
    char: 'あ',
    kind: 'hiragana',
    grade: null,
    jlpt: null,
    strokeCount: 3,
    meaning: '',
    meanings: [],
    readings: [],
    romaji: 'a',
  })

  it('matches by the character itself', () => {
    expect(matchesQuery(water, '水')).toBe(true)
    expect(matchesQuery(water, '火')).toBe(false)
  })

  it('matches by kana reading', () => {
    expect(matchesQuery(water, 'みず')).toBe(true)
    expect(matchesQuery(water, 'スイ')).toBe(true)
    expect(matchesQuery(water, 'かわ')).toBe(false)
  })

  it('matches by English meaning, case-insensitively', () => {
    expect(matchesQuery(water, 'water')).toBe(true)
    expect(matchesQuery(water, 'WATER')).toBe(true)
    expect(matchesQuery(water, 'Wat')).toBe(true)
    expect(matchesQuery(water, 'fire')).toBe(false)
  })

  it('matches kana by romaji', () => {
    expect(matchesQuery(kana, 'a')).toBe(true)
    expect(matchesQuery(kana, 'z')).toBe(false)
  })

  it('an empty query matches everything', () => {
    expect(matchesQuery(water, '')).toBe(true)
  })
})

describe('searchCharacterIndex', () => {
  const entries = [
    entry({}),
    entry({ char: '火', meaning: 'fire', meanings: ['fire'], readings: ['カ', 'ひ'] }),
    entry({ char: '木', meaning: 'tree', meanings: ['tree', 'wood'], readings: ['モク', 'き'] }),
  ]

  it('returns only matching entries', () => {
    const results = searchCharacterIndex(entries, 'water')
    expect(results.map((e) => e.char)).toEqual(['水'])
  })

  it('matches any of the full meanings, not just the display meaning', () => {
    expect(searchCharacterIndex(entries, 'wood').map((e) => e.char)).toEqual(['木'])
  })

  it('returns everything for a blank/whitespace query', () => {
    expect(searchCharacterIndex(entries, '')).toHaveLength(3)
    expect(searchCharacterIndex(entries, '   ')).toHaveLength(3)
  })

  it('trims surrounding whitespace before matching', () => {
    expect(searchCharacterIndex(entries, '  fire  ').map((e) => e.char)).toEqual(['火'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(searchCharacterIndex(entries, 'zzz-no-such-thing')).toHaveLength(0)
  })
})

describe('loadCharacterIndex (against real public/data/index.json)', () => {
  it('loads all 2228 entries and caches the fetch', async () => {
    stubFetchFromPublicDir()
    const first = await loadCharacterIndex()
    expect(first).toHaveLength(2228)

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>
    const callsAfterFirst = fetchMock.mock.calls.length
    const second = await loadCharacterIndex()
    expect(second).toBe(first) // same cached array
    expect(fetchMock.mock.calls.length).toBe(callsAfterFirst) // no re-fetch
  })

  it('searching the real index for "water" includes 水', async () => {
    stubFetchFromPublicDir()
    const index = await loadCharacterIndex()
    const results = searchCharacterIndex(index, 'water')
    expect(results.map((e) => e.char)).toContain('水')
  })
})
