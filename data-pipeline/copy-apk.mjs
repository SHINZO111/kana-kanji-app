// Copies the signed release APK from the Android build output into
// public/download/ so the web landing page (Home.tsx) can link to it, and
// writes a SHA-256 checksum file alongside it so users can verify the
// download's integrity (see Home.tsx's Sha256Row, which fetches this file
// at runtime rather than a hardcoded hash so it can never drift from the
// actual APK bytes).
//
// The APK is a build artifact (not committed — see .gitignore's
// public/download/ entry), so this must run after `./gradlew assembleRelease`
// and before `npm run build` for the download link to actually work.
//
// Usage: npm run sync:apk

import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(__dirname, '..')

const SRC = path.join(REPO_ROOT, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
const DEST_DIR = path.join(REPO_ROOT, 'public', 'download')
const DEST = path.join(DEST_DIR, 'kanakanji.apk')
const CHECKSUM_DEST = path.join(DEST_DIR, 'kanakanji.apk.sha256')

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

async function main() {
  let srcStat
  try {
    srcStat = await stat(SRC)
  } catch {
    console.error(`[sync:apk] Not found: ${path.relative(REPO_ROOT, SRC)}`)
    console.error('[sync:apk] Build the signed release APK first:')
    console.error('[sync:apk]   cd android && ./gradlew assembleRelease')
    process.exitCode = 1
    return
  }

  await mkdir(DEST_DIR, { recursive: true })
  await copyFile(SRC, DEST)

  const mb = (srcStat.size / (1024 * 1024)).toFixed(2)
  console.log(`[sync:apk] copied ${path.relative(REPO_ROOT, SRC)} -> ${path.relative(REPO_ROOT, DEST)} (${mb} MB)`)

  // sha256sum-compatible format: "<hash>  <filename>" (two spaces), so the
  // file also works directly with `sha256sum -c kanakanji.apk.sha256`.
  const hash = await sha256File(DEST)
  await writeFile(CHECKSUM_DEST, `${hash}  kanakanji.apk\n`)
  console.log(`[sync:apk] wrote ${path.relative(REPO_ROOT, CHECKSUM_DEST)} (${hash})`)
}

main()
