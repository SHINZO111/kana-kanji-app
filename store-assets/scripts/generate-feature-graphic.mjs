// Generates store-assets/feature-graphic.png (1024x500), the Google Play
// feature graphic, in the app icon's design language (see
// data-pipeline/lib/icon-svg.mjs): the brush "あ" glyph rendered from the
// app's real stroke data, purple->indigo gradient field, soft glow
// highlights, and the vermillion hanko seal accent.
//
// Note: this script renders the glyph itself rather than importing
// buildIconSvg(), because the stroke data format changed (commit 2d4f46a):
// public/data/strokes/3042.json's `strokes` are now filled brush-outline
// paths (HanziWriter format, centerlines live in `medians`), while
// icon-svg.mjs still strokes them as centerlines — which now renders as
// thin double outlines. Here the outlines are *filled*, matching how the
// app itself (HanziWriter) draws them.
//
// Run from the repo root:  node store-assets/scripts/generate-feature-graphic.mjs

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_PATH = path.join(__dirname, '..', 'feature-graphic.png')
const STROKE_JSON_PATH = path.join(__dirname, '..', '..', 'public', 'data', 'strokes', '3042.json')

const W = 1024
const H = 500

// Icon tile geometry: a rounded-square brand mark, vertically centered on
// the left. 360px keeps generous margins (70px top/bottom) so Play's
// occasional edge cropping never touches it.
const TILE = 360
const TILE_X = 78
const TILE_Y = (H - TILE) / 2
const TILE_RADIUS = TILE * 0.22 // same corner-radius ratio as the manifest icons

/**
 * Approximate bounding box of the glyph from every coordinate pair that
 * appears in the path strings (endpoints + bezier control points) — the
 * same approach icon-svg.mjs's precomputed GLYPH_BBOX used, computed live
 * here so it tracks the current data.
 */
function computeBbox(paths) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const d of paths) {
    for (const m of d.matchAll(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g)) {
      const x = Number(m[1])
      const y = Number(m[2])
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  return { minX, minY, maxX, maxY }
}

async function buildFeatureSvg() {
  const { strokes } = JSON.parse(await readFile(STROKE_JSON_PATH, 'utf8'))
  const bbox = computeBbox(strokes)
  const glyphCx = (bbox.minX + bbox.maxX) / 2
  const glyphCy = (bbox.minY + bbox.maxY) / 2
  // Scale the glyph to ~62% of the tile height, mirroring the icon's
  // proportions (260px glyph in a 512px canvas).
  const glyphScale = (TILE * 0.62) / (bbox.maxY - bbox.minY)
  // HanziWriter stroke data is y-up; flip vertically around the glyph
  // center (same scale(1,-1) trick icon-svg.mjs documents).
  const tileCx = TILE_X + TILE / 2
  const tileCy = TILE_Y + TILE / 2
  const glyphTransform = `translate(${tileCx} ${tileCy}) scale(${glyphScale}) scale(1 -1) translate(${-glyphCx} ${-glyphCy})`

  // Hanko seal position: same relative offset as the icon (396/512 of the
  // canvas), scaled to the tile.
  const sealX = TILE_X + (396 / 512) * TILE
  const sealY = TILE_Y + (396 / 512) * TILE
  const sealR = (30 / 512) * TILE

  const textX = TILE_X + TILE + 74

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fgBg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9438ff"/>
      <stop offset="52%" stop-color="#7e14ff"/>
      <stop offset="100%" stop-color="#4c0ba8"/>
    </linearGradient>
    <linearGradient id="tileBg" x1="${TILE_X}" y1="${TILE_Y}" x2="${TILE_X + TILE}" y2="${TILE_Y + TILE}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9438ff"/>
      <stop offset="52%" stop-color="#7e14ff"/>
      <stop offset="100%" stop-color="#4c0ba8"/>
    </linearGradient>
    <radialGradient id="fgGlowLeft" cx="16%" cy="20%" r="52%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fgGlowRight" cx="88%" cy="88%" r="48%">
      <stop offset="0%" stop-color="#47bfff" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#47bfff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="tileGlow" cx="30%" cy="26%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glyphGrad" x1="0" y1="${TILE_Y}" x2="0" y2="${TILE_Y + TILE}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f0e6ff"/>
    </linearGradient>
    <clipPath id="tileClip">
      <rect x="${TILE_X}" y="${TILE_Y}" width="${TILE}" height="${TILE}" rx="${TILE_RADIUS}"/>
    </clipPath>
    <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#1c0345" flood-opacity="0.45"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#fgBg)"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#fgGlowLeft)"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#fgGlowRight)"/>

  <g filter="url(#tileShadow)">
    <rect x="${TILE_X}" y="${TILE_Y}" width="${TILE}" height="${TILE}" rx="${TILE_RADIUS}" fill="url(#tileBg)"/>
  </g>
  <g clip-path="url(#tileClip)">
    <rect x="${TILE_X}" y="${TILE_Y}" width="${TILE}" height="${TILE}" fill="url(#tileGlow)"/>
    <g transform="${glyphTransform}" fill="url(#glyphGrad)">
      ${strokes.map((d) => `<path d="${d}"/>`).join('\n      ')}
    </g>
    <g transform="translate(${sealX} ${sealY}) rotate(-8)">
      <circle r="${sealR}" fill="#e2432e"/>
      <circle r="${sealR - 3.5}" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.85"/>
    </g>
  </g>

  <g font-family="'Segoe UI', 'Noto Sans', Arial, sans-serif" fill="#ffffff">
    <text x="${textX}" y="222" font-size="74" font-weight="700" letter-spacing="1">KANAKANJI</text>
    <text x="${textX}" y="296" font-size="34" font-weight="400" fill="#efe4ff">Kana &amp; kanji stroke practice</text>
    <text x="${textX}" y="376" font-size="27" font-weight="600" fill="#cdb2ff" letter-spacing="0.5">92 kana&#160;&#160;&#183;&#160;&#160;2,136 kanji&#160;&#160;&#183;&#160;&#160;100% offline</text>
  </g>
</svg>`
}

async function main() {
  const svg = await buildFeatureSvg()
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: { loadSystemFonts: true },
  })
  const rendered = resvg.render()
  if (rendered.width !== W || rendered.height !== H) {
    throw new Error(`unexpected output size ${rendered.width}x${rendered.height} (wanted ${W}x${H})`)
  }
  const png = rendered.asPng()
  await writeFile(OUT_PATH, png)
  console.log(
    `[feature-graphic] wrote ${path.relative(process.cwd(), OUT_PATH)} (${rendered.width}x${rendered.height}, ${png.length} bytes)`,
  )
}

main()
