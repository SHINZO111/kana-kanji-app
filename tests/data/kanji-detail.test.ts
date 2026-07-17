// Validates every per-character detail file in public/data/kanji/{hex}.json
// (loaded by src/hooks/useCharacterData.ts).

import { describe, expect, it } from 'vitest'
import type { CharacterData } from '../../src/lib/types'
import { hexToChar, listJsonFiles, readJson } from '../helpers/data-files'

const files = listJsonFiles('kanji')

describe('public/data/kanji/*.json', () => {
  it('contains exactly 2136 files (jouyou kanji)', () => {
    expect(files).toHaveLength(2136)
  })

  it('every file is structurally valid and self-consistent', () => {
    const violations: string[] = []

    for (const file of files) {
      const data = readJson<CharacterData>('kanji', file)
      const expectedChar = hexToChar(file)

      if (data.char !== expectedChar) {
        violations.push(`${file}: char "${data.char}" does not match filename (${expectedChar})`)
      }
      if (data.kind !== 'kanji') violations.push(`${file}: kind is ${String(data.kind)}`)
      if (!(Number.isInteger(data.strokeCount) && data.strokeCount > 0)) {
        violations.push(`${file}: strokeCount ${String(data.strokeCount)} is not a positive integer`)
      }
      if (!Array.isArray(data.onYomi) || !Array.isArray(data.kunYomi)) {
        violations.push(`${file}: onYomi/kunYomi missing or not arrays`)
      } else if (data.onYomi.length === 0 && data.kunYomi.length === 0) {
        violations.push(`${file} (${data.char}): both onYomi and kunYomi are empty`)
      }
      if (!Array.isArray(data.meanings) || data.meanings.length === 0) {
        violations.push(`${file} (${data.char}): meanings is empty`)
      }
      if (!Array.isArray(data.examples)) {
        violations.push(`${file} (${data.char}): examples is not an array`)
      } else {
        for (const example of data.examples) {
          if (
            typeof example.word !== 'string' ||
            typeof example.reading !== 'string' ||
            typeof example.meaning !== 'string'
          ) {
            violations.push(`${file} (${data.char}): malformed example ${JSON.stringify(example)}`)
            break
          }
        }
      }
    }

    expect(violations, `${violations.length} violation(s):\n${violations.slice(0, 25).join('\n')}`).toHaveLength(0)
  })

  it('kanji detail files exactly cover the kanji listed in index.json', () => {
    const index = readJson<{ char: string; kind: string }[]>('index.json')
    const indexKanji = new Set(index.filter((e) => e.kind === 'kanji').map((e) => e.char))
    const fileChars = new Set(files.map(hexToChar))
    const missingFiles = [...indexKanji].filter((c) => !fileChars.has(c))
    const orphanFiles = [...fileChars].filter((c) => !indexKanji.has(c))
    expect(missingFiles, `kanji in index without detail file: ${missingFiles.join(' ')}`).toHaveLength(0)
    expect(orphanFiles, `detail files not in index: ${orphanFiles.join(' ')}`).toHaveLength(0)
  })
})
