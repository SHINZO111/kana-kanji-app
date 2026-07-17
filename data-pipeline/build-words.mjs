// Streams JMdict_e.xml (sax) and, for every jōyō kanji, collects up to 5
// example words that (a) contain that kanji in their primary written form
// and (b) carry one of the priority tags news1/ichi1/spec1 (i.e. common,
// everyday vocabulary). Results are merged into the existing
// public/data/kanji/{codepoint}.json files produced by build-kanji.mjs.
//
// JMdict is ~60MB decompressed, so this intentionally never loads the whole
// document into a DOM — it processes one <entry> at a time as sax emits it.
import { createReadStream } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sax from 'sax'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAW_FILE = path.join(__dirname, 'raw', 'JMdict_e.xml')
const KANJI_DIR = path.join(__dirname, '..', 'public', 'data', 'kanji')

const PRIORITY_TAGS = new Set(['news1', 'ichi1', 'spec1'])
const MAX_EXAMPLES = 5

async function loadJouyouCharMap() {
  const files = await readdir(KANJI_DIR)
  const codepointForChar = new Map()
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const codepoint = file.replace('.json', '')
    const char = String.fromCodePoint(parseInt(codepoint, 16))
    codepointForChar.set(char, codepoint)
  }
  return codepointForChar
}

function streamJMdict(jouyouChars, onPriorityWord) {
  return new Promise((resolve, reject) => {
    const parser = sax.createStream(false, { lowercase: true, trim: true })

    let section = null // 'k_ele' | 'r_ele' | 'sense' | null (or '*_ignore' after first block)
    let currentTag = null
    let kebCaptured = false
    let rebCaptured = false
    let keb = null
    let kePriTags = []
    let reb = null
    let firstGloss = null

    function resetEntryState() {
      section = null
      kebCaptured = false
      rebCaptured = false
      keb = null
      kePriTags = []
      reb = null
      firstGloss = null
    }

    parser.on('opentag', (node) => {
      currentTag = node.name
      if (node.name === 'entry') {
        resetEntryState()
      } else if (node.name === 'k_ele') {
        section = kebCaptured ? 'k_ele_ignore' : 'k_ele'
      } else if (node.name === 'r_ele') {
        section = rebCaptured ? 'r_ele_ignore' : 'r_ele'
      } else if (node.name === 'sense') {
        section = 'sense'
      }
    })

    parser.on('text', (text) => {
      if (section === 'k_ele' && currentTag === 'keb') {
        keb = text
      } else if (section === 'k_ele' && currentTag === 'ke_pri') {
        kePriTags.push(text)
      } else if (section === 'r_ele' && currentTag === 'reb') {
        reb = text
      } else if (section === 'sense' && currentTag === 'gloss' && firstGloss === null) {
        firstGloss = text
      }
    })

    parser.on('closetag', (name) => {
      if (name === 'k_ele') {
        kebCaptured = true
        section = null
      } else if (name === 'r_ele') {
        rebCaptured = true
        section = null
      } else if (name === 'sense') {
        if (section === 'sense') section = null
      } else if (name === 'entry') {
        if (keb && reb && firstGloss && kePriTags.some((t) => PRIORITY_TAGS.has(t))) {
          onPriorityWord({ word: keb, reading: reb, meaning: firstGloss })
        }
      }
    })

    parser.on('error', (err) => {
      // JMdict's internal DTD defines many custom entities (&n;, &vt;, ...);
      // sax in non-strict mode already resolves/ignores what it needs to.
      // Any residual errors are logged and parsing continues rather than
      // aborting a 60MB stream over a single malformed fragment.
      console.error('[build-words] parser warning (continuing):', err.message)
      parser._parser.error = null
      parser._parser.resume()
    })

    parser.on('end', resolve)
    parser.on('close', resolve)

    createReadStream(RAW_FILE, { encoding: 'utf-8', highWaterMark: 1024 * 1024 })
      .on('error', reject)
      .pipe(parser)
  })
}

async function main() {
  const codepointForChar = await loadJouyouCharMap()
  const jouyouChars = new Set(codepointForChar.keys())
  console.log(`[build-words] tracking examples for ${jouyouChars.size} jōyō kanji`)

  const examplesByChar = new Map()

  let priorityWordCount = 0
  await streamJMdict(jouyouChars, ({ word, reading, meaning }) => {
    priorityWordCount++
    for (const ch of word) {
      if (!jouyouChars.has(ch)) continue
      let bucket = examplesByChar.get(ch)
      if (!bucket) {
        bucket = []
        examplesByChar.set(ch, bucket)
      }
      if (bucket.length >= MAX_EXAMPLES) continue
      if (bucket.some((e) => e.word === word)) continue
      bucket.push({ word, reading, meaning })
    }
  })

  console.log(`[build-words] scanned ${priorityWordCount} priority-tagged words`)
  console.log(`[build-words] ${examplesByChar.size} jōyō kanji have at least one example`)

  let updated = 0
  for (const [char, examples] of examplesByChar) {
    const codepoint = codepointForChar.get(char)
    const filePath = path.join(KANJI_DIR, `${codepoint}.json`)
    const data = JSON.parse(await readFile(filePath, 'utf-8'))
    data.examples = examples.slice(0, MAX_EXAMPLES)
    await writeFile(filePath, JSON.stringify(data), 'utf-8')
    updated++
  }
  console.log(`[build-words] merged examples into ${updated} kanji files`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
