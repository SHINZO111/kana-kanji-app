// Parses KANJIDIC2 XML and extracts the 2,136 jōyō kanji (grade 1-6 =
// elementary school, grade 8 = remaining jōyō taught in secondary school).
// Writes one JSON file per character under public/data/kanji/{codepoint}.json
// (codepoint = lowercase hex UCS codepoint, matching KANJIDIC2's cp_value).
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAW_FILE = path.join(__dirname, 'raw', 'kanjidic2.xml')
const OUT_DIR = path.join(__dirname, '..', 'public', 'data', 'kanji')

const JOUYOU_GRADES = new Set([1, 2, 3, 4, 5, 6, 8])

function asArray(value) {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

function toCodepoint(character) {
  const cpValues = asArray(character.codepoint?.cp_value)
  const ucs = cpValues.find((v) => v['@_cp_type'] === 'ucs')
  if (!ucs) throw new Error(`missing ucs codepoint for ${character.literal}`)
  const text = typeof ucs === 'object' ? ucs['#text'] : ucs
  return String(text).toLowerCase()
}

function extractReadings(character, type) {
  const rmgroups = asArray(character.reading_meaning?.rmgroup)
  const readings = new Set()
  for (const group of rmgroups) {
    for (const reading of asArray(group.reading)) {
      if (typeof reading === 'object' && reading['@_r_type'] === type) {
        readings.add(reading['#text'])
      }
    }
  }
  return [...readings]
}

function extractMeanings(character) {
  const rmgroups = asArray(character.reading_meaning?.rmgroup)
  const meanings = []
  for (const group of rmgroups) {
    for (const meaning of asArray(group.meaning)) {
      if (typeof meaning === 'string') {
        meanings.push(meaning)
      }
      // meanings with m_lang attribute (non-English) are objects; skip them.
    }
  }
  return meanings
}

function toCharacterData(character) {
  const grade = character.misc?.grade ?? null
  const jlpt = character.misc?.jlpt ?? null
  const strokeCounts = asArray(character.misc?.stroke_count)
  const strokeCount = Number(strokeCounts[0] ?? 0)

  return {
    char: character.literal,
    kind: 'kanji',
    strokeCount,
    grade: grade === null ? null : Number(grade),
    jlpt: jlpt === null ? null : Number(jlpt),
    onYomi: extractReadings(character, 'ja_on'),
    kunYomi: extractReadings(character, 'ja_kun'),
    meanings: extractMeanings(character),
    examples: [],
  }
}

async function main() {
  const xml = await readFile(RAW_FILE, 'utf-8')
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
  })
  const doc = parser.parse(xml)
  const characters = asArray(doc.kanjidic2.character)
  console.log(`[build-kanji] parsed ${characters.length} total characters from KANJIDIC2`)

  const jouyou = characters.filter((c) => JOUYOU_GRADES.has(Number(c.misc?.grade)))
  console.log(`[build-kanji] filtered to ${jouyou.length} jōyō kanji (grade 1-6, 8)`)

  await mkdir(OUT_DIR, { recursive: true })
  const codepoints = []
  for (const character of jouyou) {
    const data = toCharacterData(character)
    const codepoint = toCodepoint(character)
    codepoints.push(codepoint)
    await writeFile(path.join(OUT_DIR, `${codepoint}.json`), JSON.stringify(data), 'utf-8')
  }

  console.log(`[build-kanji] wrote ${codepoints.length} kanji JSON files to ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
