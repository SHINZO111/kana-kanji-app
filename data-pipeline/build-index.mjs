// Builds public/data/index.json: a lightweight combined index of every
// character (92 kana + 2,136 jōyō kanji) for the Browse/search screens.
// Must run after build-kana.mjs and build-kanji.mjs (build-words.mjs may
// run before or after — examples aren't part of IndexEntry).
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KANJI_DIR = path.join(__dirname, '..', 'public', 'data', 'kanji')
const KANA_FILE = path.join(__dirname, '..', 'public', 'data', 'kana.json')
const OUT_FILE = path.join(__dirname, '..', 'public', 'data', 'index.json')

// KANJIDIC2 kun'yomi (and occasionally on'yomi) use "." to mark the
// okurigana boundary (e.g. "しか.る") and a trailing "-" for bound forms
// (e.g. "みず-"). Strip both so search can match on the plain reading.
function normalizeReading(reading) {
  return reading.replace(/[.-]/g, '')
}

function toIndexEntry(character) {
  const readings = [...(character.onYomi ?? []), ...(character.kunYomi ?? [])].map(normalizeReading)
  return {
    char: character.char,
    kind: character.kind,
    grade: character.grade,
    jlpt: character.jlpt,
    strokeCount: character.strokeCount,
    meaning: character.meanings?.[0] ?? '',
    meanings: character.meanings ?? [],
    readings,
    romaji: character.romaji,
  }
}

async function main() {
  const kana = JSON.parse(await readFile(KANA_FILE, 'utf-8'))

  const kanjiFiles = (await readdir(KANJI_DIR)).filter((f) => f.endsWith('.json')).sort()
  const kanji = []
  for (const file of kanjiFiles) {
    const data = JSON.parse(await readFile(path.join(KANJI_DIR, file), 'utf-8'))
    kanji.push(data)
  }

  const index = [...kana, ...kanji].map(toIndexEntry)
  await writeFile(OUT_FILE, JSON.stringify(index), 'utf-8')
  console.log(`[build-index] wrote ${index.length} entries (${kana.length} kana + ${kanji.length} kanji) to ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
