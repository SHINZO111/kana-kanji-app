// Shared filesystem helpers for the data-validation tests (tests/data).
// Reads public/data/** directly off disk — no dev server involved.

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

export const DATA_DIR = path.resolve(__dirname, '..', '..', 'public', 'data')

export function readJson<T>(...segments: string[]): T {
  const filePath = path.join(DATA_DIR, ...segments)
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T
}

export function listJsonFiles(dir: 'kanji' | 'strokes'): string[] {
  return readdirSync(path.join(DATA_DIR, dir)).filter((f) => f.endsWith('.json'))
}

export function hexToChar(hexFileName: string): string {
  return String.fromCodePoint(parseInt(hexFileName.replace('.json', ''), 16))
}

export function charToHex(char: string): string {
  const codePoint = char.codePointAt(0)
  if (codePoint === undefined) throw new Error('charToHex: empty string')
  return codePoint.toString(16)
}
