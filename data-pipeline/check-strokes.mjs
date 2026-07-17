// Independent verification pass: for every character that should have
// stroke data (92 kana + 2,136 jōyō kanji), confirm public/data/strokes/
// contains a non-empty, structurally valid file. Prints a missing-character
// report (empty if none) so Phase 1's completion criteria can be checked
// without re-running the whole build pipeline.
import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { KANA_TABLE } from './lib/kana-table.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KANJI_DIR = path.join(__dirname, '..', 'public', 'data', 'kanji')
const STROKES_DIR = path.join(__dirname, '..', 'public', 'data', 'strokes')

function toCodepoint(char) {
  return char.codePointAt(0).toString(16)
}

async function expectedChars() {
  const kanjiFiles = await readdir(KANJI_DIR)
  const kanjiChars = kanjiFiles
    .filter((f) => f.endsWith('.json'))
    .map((f) => String.fromCodePoint(parseInt(f.replace('.json', ''), 16)))
  const kanaChars = KANA_TABLE.map((entry) => entry.char)
  return [...kanaChars, ...kanjiChars]
}

async function isValidStrokeFile(filePath) {
  try {
    const raw = await readFile(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data.strokes) && data.strokes.length > 0 && Array.isArray(data.medians) && data.medians.length > 0
  } catch {
    return false
  }
}

async function main() {
  const chars = await expectedChars()
  const missing = []

  for (const char of chars) {
    const filePath = path.join(STROKES_DIR, `${toCodepoint(char)}.json`)
    if (!existsSync(filePath) || !(await isValidStrokeFile(filePath))) {
      missing.push(char)
    }
  }

  console.log(`[check-strokes] checked ${chars.length} characters (92 kana + ${chars.length - 92} kanji)`)
  if (missing.length === 0) {
    console.log('[check-strokes] OK: no missing or invalid stroke files')
  } else {
    console.log(`[check-strokes] MISSING/INVALID (${missing.length}): ${missing.join(' ')}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
