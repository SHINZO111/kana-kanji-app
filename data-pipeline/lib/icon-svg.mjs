// Builds the KANAKANJI app icon as an SVG string, at any size/corner-radius
// combination. Used by generate-icons.mjs (rasterized to PNG via
// @resvg/resvg-js) and to write public/favicon.svg directly.
//
// Design: a brush-stroke rendering of hiragana "あ" (the first kana most
// learners meet) on a purple->indigo gradient field that echoes the accent
// colors already used in the hand-drawn brand mark, plus a small vermillion
// "hanko" (seal) accent in the corner — a common finishing touch on
// Japanese calligraphy pieces. The "あ" glyph is the *real* brush-outline
// stroke data for this character (public/data/strokes/3042.json, HanziWriter
// format: `strokes` are closed filled outline paths, centerlines live in
// `medians`), the same data the app itself animates — so the mark reads as
// "handwritten brush stroke" rather than "letter in a box".
//
// Keep the rendering approach visually consistent with
// store-assets/scripts/generate-feature-graphic.mjs, which fills the same
// outline paths.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STROKE_JSON_PATH = path.join(__dirname, '..', '..', 'public', 'data', 'strokes', '3042.json')

const CANVAS = 512
const CANVAS_CENTER = CANVAS / 2
// Glyph height ~260px within the 512 canvas keeps the glyph inside the
// maskable safe zone (center 80%, i.e. radius 204.8 from center) with
// comfortable margin. The outline paths already include the brush width,
// so no extra stroke-width allowance is needed.
const GLYPH_HEIGHT = 260

const SEAL_CENTER = { x: 396, y: 396 }
const SEAL_RADIUS = 30

// Bounding box over every coordinate pair in the path strings (endpoints +
// bezier control points, native 1024-space). Computed live from the current
// data — same approach as generate-feature-graphic.mjs — so it tracks any
// future stroke-data regeneration instead of relying on stale constants.
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

let strokePathsPromise

async function loadStrokePaths() {
  if (!strokePathsPromise) {
    strokePathsPromise = readFile(STROKE_JSON_PATH, 'utf8').then((raw) => JSON.parse(raw).strokes)
  }
  return strokePathsPromise
}

/**
 * @param {object} opts
 * @param {number} opts.cornerRadius - px, in the 512 canvas coordinate space. 0 for full-bleed (maskable / iOS, which apply their own mask).
 * @returns {Promise<string>} standalone SVG document string, viewBox 0 0 512 512.
 */
export async function buildIconSvg({ cornerRadius }) {
  const strokes = await loadStrokePaths()
  const bbox = computeBbox(strokes)
  const glyphCenter = {
    x: (bbox.minX + bbox.maxX) / 2,
    y: (bbox.minY + bbox.maxY) / 2,
  }
  const glyphScale = GLYPH_HEIGHT / (bbox.maxY - bbox.minY)

  // HanziWriter stroke data is y-up relative to SVG's y-down space —
  // HanziWriter's own renderer flips it internally. `scale(1 -1)` (applied
  // around the glyph's own center, via the surrounding translate pair)
  // reproduces that flip here so "あ" actually looks like "あ".
  const glyphTransform = `translate(${CANVAS_CENTER} ${CANVAS_CENTER}) scale(${glyphScale}) scale(1 -1) translate(${-glyphCenter.x} ${-glyphCenter.y})`

  const backgroundShape =
    cornerRadius > 0
      ? `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" rx="${cornerRadius}" fill="url(#bgGrad)"/>`
      : `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" fill="url(#bgGrad)"/>`

  const glowShape =
    cornerRadius > 0
      ? `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" rx="${cornerRadius}"/>`
      : `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="${CANVAS}" y2="${CANVAS}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9438ff"/>
      <stop offset="52%" stop-color="#7e14ff"/>
      <stop offset="100%" stop-color="#4c0ba8"/>
    </linearGradient>
    <radialGradient id="glowTopLeft" cx="27%" cy="24%" r="46%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBottomRight" cx="82%" cy="86%" r="42%">
      <stop offset="0%" stop-color="#47bfff" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#47bfff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glyphGrad" x1="0" y1="0" x2="0" y2="${CANVAS}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f0e6ff"/>
    </linearGradient>
    <clipPath id="bgClip">${glowShape}</clipPath>
  </defs>

  ${backgroundShape}
  <g clip-path="url(#bgClip)">
    <rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" fill="url(#glowTopLeft)"/>
    <rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" fill="url(#glowBottomRight)"/>
  </g>

  <g transform="${glyphTransform}" fill="url(#glyphGrad)">
    ${strokes.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <g transform="translate(${SEAL_CENTER.x} ${SEAL_CENTER.y}) rotate(-8)">
    <circle r="${SEAL_RADIUS}" fill="#e2432e"/>
    <circle r="${SEAL_RADIUS - 5}" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.85"/>
  </g>
</svg>`
}
