// Populates public/data/strokes/{codepoint}.json for every jōyō kanji and
// every kana character, so the app never needs to hit a CDN at runtime
// (required for Android offline support — see plan).
//
// Kanji: copied from the hanzi-writer-data-jp repo (downloaded as a zip and
// extracted into data-pipeline/raw/, since the published npm package itself
// ships no character data — see commit notes / README for details).
//
// Kana: hanzi-writer-data-jp has no hiragana/katakana data at all (verified:
// both the npm tarball and the GitHub repo's data/ folder 404 for these
// characters). We fetch each kana character's SVG from animCJK's
// svgsJaKana/ directory (real brush-shaped stroke outlines -- the same
// upstream project hanzi-writer-data-jp's own kanji data derives from) and
// convert it with lib/animcjk-kana-to-hanziwriter.mjs. See that file's doc
// comment for the coordinate-system verification and rationale.
//
// KanjiVG (lib/kanjivg-to-hanziwriter.mjs) is kept in the repo as a
// documented fallback (plan work item A-2) in case animCJK ever becomes
// unavailable, but is no longer used for the shipped kana data since it
// only has open centerlines (thin sliver strokes) for kana.
import { createWriteStream, existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { KANA_TABLE } from './lib/kana-table.mjs'
import { convertAnimCjkKanaSvgToHanziWriter } from './lib/animcjk-kana-to-hanziwriter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KANJI_DIR = path.join(__dirname, '..', 'public', 'data', 'kanji')
const STROKES_DIR = path.join(__dirname, '..', 'public', 'data', 'strokes')
const HWD_JP_DATA_DIR = path.join(
  __dirname,
  'raw',
  'hanzi-writer-data-jp-extracted',
  'hanzi-writer-data-jp-master',
  'data',
)
const ANIMCJK_KANA_CACHE_DIR = path.join(__dirname, 'raw', 'animcjk-kana-cache')

const CONCURRENCY = 12

// The 2010 jōyō revision prefers a few glyph variants (2010-era Unicode
// codepoints) that predate hanzi-writer-data-jp's underlying font/data
// sources. Each has a visually near-identical common-form variant that IS
// present in the dataset; we substitute those rather than leaving these
// four characters with no stroke animation at all.
const VARIANT_FALLBACK = {
  '𠮟': '叱', // U+20B9F -> U+53F1
  '剝': '剥', // U+525D  -> U+5265
  '塡': '填', // U+5861  -> U+586B
  '頰': '頬', // U+9830  -> U+9832
}

function toCodepoint(char) {
  return char.codePointAt(0).toString(16)
}

async function runWithConcurrency(items, worker, concurrency) {
  const results = []
  let index = 0
  async function next() {
    while (index < items.length) {
      const current = index++
      results[current] = await worker(items[current], current)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, next))
  return results
}

async function copyKanjiStrokes() {
  const kanjiFiles = await readdir(KANJI_DIR)
  const chars = kanjiFiles
    .filter((f) => f.endsWith('.json'))
    .map((f) => String.fromCodePoint(parseInt(f.replace('.json', ''), 16)))

  const missing = []
  let copied = 0

  let substituted = 0
  for (const char of chars) {
    const sourceChar = VARIANT_FALLBACK[char] ?? char
    const srcPath = path.join(HWD_JP_DATA_DIR, `${sourceChar}.json`)
    const destPath = path.join(STROKES_DIR, `${toCodepoint(char)}.json`)
    if (!existsSync(srcPath)) {
      missing.push(char)
      continue
    }
    const raw = await readFile(srcPath, 'utf-8')
    await writeFile(destPath, raw, 'utf-8')
    copied++
    if (sourceChar !== char) substituted++
  }

  console.log(`[build-strokes] kanji: copied ${copied}/${chars.length} from hanzi-writer-data-jp` + (substituted > 0 ? ` (${substituted} via 2010-glyph-variant fallback)` : ''))
  if (missing.length > 0) {
    console.log(`[build-strokes] kanji: missing from hanzi-writer-data-jp (${missing.length}): ${missing.join(' ')}`)
  }
  return missing
}

async function fetchAnimCjkKanaSvg(char) {
  const codepointDecimal = char.codePointAt(0)
  const cachePath = path.join(ANIMCJK_KANA_CACHE_DIR, `${codepointDecimal}.svg`)
  if (existsSync(cachePath)) {
    return readFile(cachePath, 'utf-8')
  }
  const url = `https://raw.githubusercontent.com/parsimonhi/animCJK/master/svgsJaKana/${codepointDecimal}.svg`
  const res = await fetch(url)
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  await mkdir(ANIMCJK_KANA_CACHE_DIR, { recursive: true })
  await pipeline(Readable.fromWeb(res.body), createWriteStream(cachePath))
  return readFile(cachePath, 'utf-8')
}

async function buildKanaStrokes() {
  const kanaChars = KANA_TABLE.map((entry) => entry.char)
  let converted = 0
  const missing = []

  await runWithConcurrency(
    kanaChars,
    async (char) => {
      try {
        const svgText = await fetchAnimCjkKanaSvg(char)
        const data = convertAnimCjkKanaSvgToHanziWriter(svgText)
        if (data.strokes.length === 0) {
          missing.push(char)
          return
        }
        const destPath = path.join(STROKES_DIR, `${toCodepoint(char)}.json`)
        await writeFile(destPath, JSON.stringify(data), 'utf-8')
        converted++
      } catch (err) {
        console.error(`[build-strokes] kana: failed for ${char}: ${err.message}`)
        missing.push(char)
      }
    },
    CONCURRENCY,
  )

  console.log(`[build-strokes] kana: converted ${converted}/${kanaChars.length} via animCJK`)
  if (missing.length > 0) {
    console.log(`[build-strokes] kana: missing (${missing.length}): ${missing.join(' ')}`)
  }
  return missing
}

async function main() {
  await mkdir(STROKES_DIR, { recursive: true })
  // --kana-only: regenerate kana stroke files without touching the 2,136
  // kanji stroke files at all (not even a no-op rewrite of identical
  // content) -- used when only the kana data source/converter changes.
  const kanaOnly = process.argv.includes('--kana-only')

  const missingKanji = []
  if (!kanaOnly) {
    if (!existsSync(HWD_JP_DATA_DIR)) {
      throw new Error(
        `hanzi-writer-data-jp data not found at ${HWD_JP_DATA_DIR}. Download+extract the repo zip first (see README).`,
      )
    }
    missingKanji.push(...(await copyKanjiStrokes()))
  }
  const missingKana = await buildKanaStrokes()

  const totalMissing = missingKanji.length + missingKana.length
  if (totalMissing > 0) {
    console.log(`[build-strokes] TOTAL MISSING: ${totalMissing} (see check-strokes.mjs for a full report)`)
  } else {
    console.log('[build-strokes] all stroke files generated successfully')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
