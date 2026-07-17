// Converts a KanjiVG stroke-order SVG into HanziWriter's {strokes, medians}
// format. This is the fallback described in the plan's risk table: KanjiVG
// covers hiragana/katakana (hanzi-writer-data-jp does not — see README /
// commit notes), but KanjiVG stores each stroke as a thin open centerline
// path (`fill:none; stroke:#000`), not the closed brush-shaped outline that
// HanziWriter's own kanji data uses. We port the approach from the existing
// open-source converter github.com/Moritz72/KanjiVGToHanziWriterConverter
// (MIT licensed, verified against a real published Anki deck):
//   - reparse each stroke's `d` path into an ordered list of cubic Bezier
//     segments (absolute coordinates)
//   - apply the same affine transform KanjiVG(109x109 viewBox) -> HanziWriter
//     (1024x1024 coordinate space): x' = x*(1024/109), y' = y*(-1024/109)+900
//   - re-serialize the transformed segments as the "strokes" path string
//   - sample `resolution` points evenly across each stroke's parameter space
//     to approximate the "medians" (stroke skeleton used for quiz matching)
//
// Known limitation: because the source is a centerline (not a brush-shaped
// outline), the rendered "strokes" shape is a thin sliver rather than a
// calligraphic brush stroke. Visual polish for kana strokes is out of scope
// for this fallback; quiz matching (which relies on medians) is unaffected.

const SCALE_X = 1024 / 109
const SCALE_Y = -1024 / 109
const SHIFT_X = 0
const SHIFT_Y = 900

function transformPoint([x, y]) {
  return [x * SCALE_X + SHIFT_X, y * SCALE_Y + SHIFT_Y]
}

/**
 * Parses an SVG cubic-bezier-only path `d` string (as used by KanjiVG:
 * a single `M` followed by one or more `C`/`c` commands) into a list of
 * absolute-coordinate cubic segments: { p0, p1, p2, p3 }.
 */
function parsePathToSegments(d) {
  const tokens = d.match(/[MmCc]|-?\d*\.?\d+(?:e-?\d+)?/g)
  if (!tokens) return []

  let i = 0
  const readNum = () => parseFloat(tokens[i++])
  const readPoint = () => [readNum(), readNum()]

  let current = [0, 0]
  const segments = []
  let cmd = null

  while (i < tokens.length) {
    if (/^[MmCc]$/.test(tokens[i])) {
      cmd = tokens[i]
      i++
    }
    if (cmd === 'M') {
      current = readPoint()
    } else if (cmd === 'm') {
      const [dx, dy] = readPoint()
      current = [current[0] + dx, current[1] + dy]
    } else if (cmd === 'C') {
      const p0 = current
      const p1 = readPoint()
      const p2 = readPoint()
      const p3 = readPoint()
      segments.push({ p0, p1, p2, p3 })
      current = p3
    } else if (cmd === 'c') {
      const p0 = current
      const p1 = [current[0] + Number(tokens[i]), current[1] + Number(tokens[i + 1])]
      i += 2
      const p2 = [current[0] + Number(tokens[i]), current[1] + Number(tokens[i + 1])]
      i += 2
      const p3 = [current[0] + Number(tokens[i]), current[1] + Number(tokens[i + 1])]
      i += 2
      segments.push({ p0, p1, p2, p3 })
      current = p3
    } else {
      // Unsupported command in a KanjiVG stroke path; skip the token to
      // avoid an infinite loop rather than throwing away the whole file.
      i++
    }
  }
  return segments
}

function cubicPointAt(seg, t) {
  const mt = 1 - t
  const [x0, y0] = seg.p0
  const [x1, y1] = seg.p1
  const [x2, y2] = seg.p2
  const [x3, y3] = seg.p3
  const x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3
  const y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3
  return [x, y]
}

/** Point at global parameter T in [0,1], distributed evenly across segments by count (not arc length) — matches svgpathtools' default Path.point(T) behavior. */
function pointAtGlobalT(segments, T) {
  const n = segments.length
  if (n === 0) return [0, 0]
  let scaled = T * n
  let segIdx = Math.floor(scaled)
  let localT = scaled - segIdx
  if (segIdx >= n) {
    segIdx = n - 1
    localT = 1
  }
  return cubicPointAt(segments[segIdx], localT)
}

function formatNum(n) {
  const rounded = Math.round(n)
  return String(rounded)
}

function segmentsToPathString(segments) {
  if (segments.length === 0) return ''
  const start = segments[0].p0
  let d = `M${formatNum(start[0])},${formatNum(start[1])}`
  for (const seg of segments) {
    d += `C${formatNum(seg.p1[0])},${formatNum(seg.p1[1])} ${formatNum(seg.p2[0])},${formatNum(seg.p2[1])} ${formatNum(seg.p3[0])},${formatNum(seg.p3[1])}`
  }
  return d
}

function transformSegments(segments) {
  return segments.map((seg) => ({
    p0: transformPoint(seg.p0),
    p1: transformPoint(seg.p1),
    p2: transformPoint(seg.p2),
    p3: transformPoint(seg.p3),
  }))
}

/**
 * Extracts the ordered list of stroke path `d` strings from a KanjiVG SVG
 * document (each stroke is a <path> inside the kvg:StrokePaths_ group).
 */
function extractStrokePathsFromSvg(svgText) {
  const pathRegex = /<path\b[^>]*\bd="([^"]+)"[^>]*\/?>/g
  const matches = [...svgText.matchAll(pathRegex)]
  return matches.map((m) => m[1])
}

/**
 * Converts raw KanjiVG SVG text into HanziWriter-format { strokes, medians }.
 */
export function convertKanjiVgSvgToHanziWriter(svgText, resolution = 5) {
  const rawPaths = extractStrokePathsFromSvg(svgText)
  const strokes = []
  const medians = []

  for (const d of rawPaths) {
    const segments = transformSegments(parsePathToSegments(d))
    if (segments.length === 0) continue

    strokes.push(segmentsToPathString(segments))

    const medianPoints = []
    for (let r = 0; r < resolution; r++) {
      const T = r / (resolution - 1)
      const [x, y] = pointAtGlobalT(segments, T)
      medianPoints.push([Math.round(x), Math.round(y)])
    }
    medians.push(medianPoints)
  }

  return { strokes, medians }
}
