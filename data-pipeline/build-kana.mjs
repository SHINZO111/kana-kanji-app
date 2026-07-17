// Builds public/data/kana.json from the hand-written kana table.
// All 92 kana are bundled into a single file (unlike kanji, which are split
// one-file-per-character) since the full set is tiny and used together in
// the Browse gojūon layout.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { KANA_TABLE } from './lib/kana-table.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_FILE = path.join(__dirname, '..', 'public', 'data', 'kana.json')

function toCharacterData({ char, romaji, strokeCount, kind }) {
  return {
    char,
    kind,
    strokeCount,
    grade: null,
    jlpt: null,
    onYomi: [],
    kunYomi: [],
    meanings: [],
    romaji,
    examples: [],
  }
}

async function main() {
  const data = KANA_TABLE.map(toCharacterData)
  await mkdir(path.dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(data), 'utf-8')
  console.log(`[build-kana] wrote ${data.length} kana entries to ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
