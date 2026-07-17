// Generates a single static HTML page that inline-renders every kana
// character's stroke data (public/data/strokes/*.json) as SVG, for a
// manual visual sanity check after regenerating kana strokes (plan work
// item A, step 4). Not part of the app build -- run manually:
//   node data-pipeline/preview-kana.mjs
// then open the printed path in a browser.
//
// Reproduces HanziWriter's own coordinate transform (see
// node_modules/hanzi-writer/dist/index.esm.js: CHARACTER_BOUNDS +
// Positioner) so what's shown here matches what the app actually renders.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { KANA_TABLE } from './lib/kana-table.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STROKES_DIR = path.join(__dirname, '..', 'public', 'data', 'strokes')
const OUT_DIR = path.join(__dirname, 'raw')
const OUT_PATH = path.join(OUT_DIR, 'kana-preview.html')

// Mirrors hanzi-writer's CHARACTER_BOUNDS (x:[0,1024], y:[-124,900]) and
// Positioner/getScalingTransform math for a square width=height box.
const SIZE = 150
const PADDING = 12
const BOX = 1024
const FROM_Y = -124
const scale = (SIZE - 2 * PADDING) / BOX
const xOffset = PADDING
const yOffset = -1 * FROM_Y * scale + PADDING
const transform = `translate(${xOffset}, ${SIZE - yOffset}) scale(${scale}, ${-scale})`

function toCodepointHex(char) {
  return char.codePointAt(0).toString(16)
}

async function renderCell({ char, romaji, kind }) {
  const hex = toCodepointHex(char)
  const jsonPath = path.join(STROKES_DIR, `${hex}.json`)
  let data
  try {
    data = JSON.parse(await readFile(jsonPath, 'utf-8'))
  } catch (err) {
    return `<div class="cell cell-missing"><div class="char">${char}</div><div class="label">${romaji} — MISSING (${err.message})</div></div>`
  }

  const strokePaths = data.strokes
    .map((d, i) => `<path d="${d}" fill="var(--stroke-color)" fill-opacity="${0.55 + (i % 2) * 0.15}"/>`)
    .join('')

  return `
    <div class="cell">
      <svg class="glyph" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
        <rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="#fff" stroke="#e2e8f0"/>
        <g transform="${transform}">${strokePaths}</g>
      </svg>
      <div class="label">${char} <span class="romaji">${romaji}</span> <span class="kind">${kind}</span></div>
      <div class="meta">${data.strokes.length} strokes</div>
    </div>`
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const cells = await Promise.all(KANA_TABLE.map(renderCell))

  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Kana stroke preview (${KANA_TABLE.length} characters)</title>
<style>
  :root { --stroke-color: #1e293b; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
  h1 { font-size: 18px; color: #0f172a; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-top: 16px; }
  .cell { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; text-align: center; }
  .cell-missing { background: #fee2e2; }
  .glyph { display: block; margin: 0 auto; }
  .label { margin-top: 4px; font-size: 13px; color: #334155; }
  .romaji { color: #64748b; }
  .kind { font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-left: 4px; }
  .meta { font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>
  <h1>Kana stroke preview — ${KANA_TABLE.length} characters (animCJK-derived, brush-shaped outlines)</h1>
  <div class="grid">${cells.join('')}</div>
</body>
</html>`

  await writeFile(OUT_PATH, html, 'utf-8')
  console.log(`[preview-kana] wrote ${OUT_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
