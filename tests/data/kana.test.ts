// Validates public/data/kana.json (all 92 kana detail records, loaded
// whole by src/hooks/useCharacterData.ts) and its consistency with the
// gojūon table layout used by Browse (src/lib/gojuon-layout.ts).

import { describe, expect, it } from 'vitest'
import type { CharacterData } from '../../src/lib/types'
import { GOJUON_ROWS } from '../../src/lib/gojuon-layout'
import { readJson } from '../helpers/data-files'

const kana = readJson<CharacterData[]>('kana.json')
const hiragana = kana.filter((k) => k.kind === 'hiragana')
const katakana = kana.filter((k) => k.kind === 'katakana')

describe('public/data/kana.json', () => {
  it('contains exactly 92 kana: 46 hiragana + 46 katakana', () => {
    expect(kana).toHaveLength(92)
    expect(hiragana).toHaveLength(46)
    expect(katakana).toHaveLength(46)
  })

  it('every kana has a non-empty romaji and a positive strokeCount', () => {
    const violations: string[] = []
    for (const entry of kana) {
      if (typeof entry.romaji !== 'string' || entry.romaji.length === 0) {
        violations.push(`${entry.char}: missing romaji`)
      }
      if (!(Number.isInteger(entry.strokeCount) && entry.strokeCount > 0)) {
        violations.push(`${entry.char}: bad strokeCount ${String(entry.strokeCount)}`)
      }
      if (entry.grade !== null) violations.push(`${entry.char}: kana grade should be null`)
    }
    expect(violations, violations.join('; ')).toHaveLength(0)
  })

  it('has no duplicate romaji within a kind', () => {
    for (const list of [hiragana, katakana]) {
      const romaji = list.map((k) => k.romaji)
      expect(new Set(romaji).size).toBe(romaji.length)
    }
  })

  it('covers every non-null slot of the gojūon table for both kinds', () => {
    const expectedRomaji = GOJUON_ROWS.flatMap((row) => row.romaji).filter(
      (r): r is string => r !== null,
    )
    expect(expectedRomaji).toHaveLength(46)

    for (const [kindName, list] of [
      ['hiragana', hiragana],
      ['katakana', katakana],
    ] as const) {
      const byRomaji = new Set(list.map((k) => k.romaji))
      const missing = expectedRomaji.filter((r) => !byRomaji.has(r))
      expect(missing, `${kindName} missing gojūon slots: ${missing.join(' ')}`).toHaveLength(0)
    }
  })

  it('matches the kana entries in index.json exactly', () => {
    const index = readJson<{ char: string; kind: string; romaji?: string }[]>('index.json')
    const indexKana = index.filter((e) => e.kind !== 'kanji')
    expect(indexKana).toHaveLength(92)
    const kanaChars = new Set(kana.map((k) => k.char))
    const missing = indexKana.filter((e) => !kanaChars.has(e.char)).map((e) => e.char)
    expect(missing, `index kana missing from kana.json: ${missing.join(' ')}`).toHaveLength(0)
    // Romaji agree between the two files.
    const romajiByChar = new Map(kana.map((k) => [k.char, k.romaji]))
    const disagreements = indexKana.filter((e) => romajiByChar.get(e.char) !== e.romaji)
    expect(disagreements.map((e) => e.char).join(' ')).toBe('')
  })
})
