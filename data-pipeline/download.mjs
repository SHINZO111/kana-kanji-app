// Downloads and decompresses KANJIDIC2 and JMdict_e from EDRDG into
// data-pipeline/raw/. This folder is gitignored — rerun this script any
// time the raw data needs to be refreshed.
import { createWriteStream } from 'node:fs'
import { mkdir, stat } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import { createGunzip } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAW_DIR = path.join(__dirname, 'raw')

const SOURCES = [
  {
    name: 'KANJIDIC2',
    url: 'http://www.edrdg.org/kanjidic/kanjidic2.xml.gz',
    outFile: path.join(RAW_DIR, 'kanjidic2.xml'),
  },
  {
    name: 'JMdict_e',
    url: 'http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz',
    outFile: path.join(RAW_DIR, 'JMdict_e.xml'),
  },
]

async function alreadyDownloaded(file) {
  try {
    const s = await stat(file)
    return s.size > 0
  } catch {
    return false
  }
}

async function downloadAndDecompress({ name, url, outFile }) {
  if (await alreadyDownloaded(outFile)) {
    console.log(`[download] ${name}: already present at ${outFile}, skipping`)
    return
  }
  console.log(`[download] ${name}: fetching ${url}`)
  const res = await fetch(url)
  if (!res.ok || !res.body) {
    throw new Error(`[download] ${name}: HTTP ${res.status} fetching ${url}`)
  }
  const gunzip = createGunzip()
  const out = createWriteStream(outFile)
  // res.body is a web ReadableStream; Node's stream.pipeline needs a Node
  // readable, so wrap it.
  const { Readable } = await import('node:stream')
  const nodeReadable = Readable.fromWeb(res.body)
  await pipeline(nodeReadable, gunzip, out)
  console.log(`[download] ${name}: saved to ${outFile}`)
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true })
  for (const source of SOURCES) {
    await downloadAndDecompress(source)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
