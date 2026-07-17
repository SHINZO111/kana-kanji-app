// Validates every stroke-data file in public/data/strokes/{hex}.json
// (HanziWriter format, loaded by src/lib/stroke-data-loader.ts).

import { describe, expect, it } from 'vitest'
import type { IndexEntry, StrokeData } from '../../src/lib/types'
import { charToHex, listJsonFiles, readJson } from '../helpers/data-files'

const index = readJson<IndexEntry[]>('index.json')
const strokeFiles = new Set(listJsonFiles('strokes'))

/**
 * Characters whose KANJIDIC2 stroke count (index.json / kanji detail JSON)
 * differs from the hanzi-writer-data-jp stroke data by exactly one stroke.
 * These are well-known counting/variant differences between the two
 * upstream sources (e.g. 牙 is counted as 4 or 5 strokes depending on the
 * glyph tradition), not pipeline bugs. Verified by inspection at test
 * authoring time; any NEW mismatch outside this list fails the test.
 */
const KNOWN_STROKE_COUNT_EXCEPTIONS = new Set([
  '僅', '牙', '璃', '葛', '衷', '謎', '賭', '遜', '遡', '離', '頰', '餅', '餌',
])

describe('public/data/strokes/*.json', () => {
  it('has a stroke file for every character in index.json (and no orphans)', () => {
    const expected = new Set(index.map((e) => `${charToHex(e.char)}.json`))
    const missing = [...expected].filter((f) => !strokeFiles.has(f))
    const orphans = [...strokeFiles].filter((f) => !expected.has(f))
    expect(missing, `missing stroke files: ${missing.join(' ')}`).toHaveLength(0)
    expect(orphans, `orphan stroke files: ${orphans.join(' ')}`).toHaveLength(0)
  })

  it('every file has matching strokes/medians arrays with valid contents', () => {
    const violations: string[] = []

    for (const entry of index) {
      const data = readJson<StrokeData>('strokes', `${charToHex(entry.char)}.json`)

      if (!Array.isArray(data.strokes) || data.strokes.length === 0) {
        violations.push(`${entry.char}: strokes missing/empty`)
        continue
      }
      if (!Array.isArray(data.medians) || data.medians.length !== data.strokes.length) {
        violations.push(
          `${entry.char}: medians length ${data.medians?.length} != strokes length ${data.strokes.length}`,
        )
      }
      for (const [i, stroke] of data.strokes.entries()) {
        if (typeof stroke !== 'string' || !stroke.startsWith('M')) {
          violations.push(`${entry.char}: stroke ${i} is not an SVG path starting with M`)
          break
        }
      }
      for (const [i, median] of (data.medians ?? []).entries()) {
        const pointsValid =
          Array.isArray(median) &&
          median.length >= 2 &&
          median.every((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite))
        if (!pointsValid) {
          violations.push(`${entry.char}: median ${i} lacks >= 2 finite [x, y] points`)
          break
        }
      }
    }

    expect(violations, `${violations.length} violation(s):\n${violations.slice(0, 25).join('\n')}`).toHaveLength(0)
  })

  it('stroke counts agree with index.json (modulo known upstream exceptions)', () => {
    const unexpected: string[] = []
    for (const entry of index) {
      const data = readJson<StrokeData>('strokes', `${charToHex(entry.char)}.json`)
      if (data.strokes.length === entry.strokeCount) continue
      if (KNOWN_STROKE_COUNT_EXCEPTIONS.has(entry.char)) {
        // Known variants differ by exactly one stroke — anything larger
        // would indicate real data corruption even for a known character.
        expect(
          Math.abs(data.strokes.length - entry.strokeCount),
          `${entry.char}: known exception drifted (${entry.strokeCount} vs ${data.strokes.length})`,
        ).toBe(1)
        continue
      }
      unexpected.push(`${entry.char}: index ${entry.strokeCount} vs strokes ${data.strokes.length}`)
    }
    expect(unexpected, `unexpected mismatches:\n${unexpected.join('\n')}`).toHaveLength(0)
  })

  it('all 92 kana use closed brush-shaped outlines (every stroke path ends with Z)', () => {
    // Since commit 2d4f46a the kana stroke data comes from animCJK-derived
    // closed outlines; each stroke path must be a closed shape (ends in Z).
    const violations: string[] = []
    for (const entry of index) {
      if (entry.kind === 'kanji') continue
      const data = readJson<StrokeData>('strokes', `${charToHex(entry.char)}.json`)
      for (const [i, stroke] of data.strokes.entries()) {
        if (!/Z\s*$/i.test(stroke)) violations.push(`${entry.char}: stroke ${i} is not closed`)
      }
    }
    expect(violations, violations.join('; ')).toHaveLength(0)
  })
})
