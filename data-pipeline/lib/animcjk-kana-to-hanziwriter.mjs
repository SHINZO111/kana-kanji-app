// Converts animCJK's Japanese kana SVGs (svgsJaKana/) into HanziWriter's
// {strokes, medians} format. This replaces the KanjiVG-based fallback
// (kanjivg-to-hanziwriter.mjs) as the primary kana data source -- see
// plan work item A-1.
//
// Why animCJK instead of KanjiVG: KanjiVG only has open centerline paths
// for kana (thin sliver strokes when rendered -- see
// kanjivg-to-hanziwriter.mjs's doc comment). animCJK's svgsJaKana/
// directory has real brush-shaped *filled* stroke outlines, matching the
// visual quality of this app's kanji data (which itself derives from
// animCJK's svgsJa/ via the hanzi-writer-data-jp package -- animCJK is
// hanzi-writer-data-jp's upstream). Each animCJK stroke also ships a
// simplified "guide" polyline (originally meant to drive animCJK's own
// CSS reveal animation) that closely approximates HanziWriter's own
// "medians" concept: a simplified skeleton polyline used both for the
// draw-in animation and for quiz stroke matching.
//
// Coordinate system: animCJK SVGs use viewBox="0 0 1024 1024" (ordinary
// SVG, y increases downward). HanziWriter's own stroke data instead uses
// a y-UP "font-like" box with bounds x:[0,1024] y:[-124,900] --
// confirmed directly from hanzi-writer's own source
// (node_modules/hanzi-writer/dist/index.esm.js: `CHARACTER_BOUNDS`, and
// `getScalingTransform()`'s baked-in `scale(scale, -1 * scale)` Y-flip).
// This was verified empirically against real shipped data: applying
// x' = x, y' = 900 - y to animCJK's raw svgsJa/27700.svg (kanji 水) path
// and guide points reproduces hanzi-writer-data-jp's actual shipped
// 水.json coordinates almost exactly -- endpoints match exactly; only
// interior cubic-Bezier control points differ slightly, because
// hanzi-writer-data-jp's original pipeline additionally re-fit each cubic
// curve as a quadratic (a lossy simplification we don't replicate, since
// HanziWriter renders cubic curves natively and there's no reason to lose
// precision re-fitting them).
//
// Multi-part strokes: some brush strokes self-intersect when drawn as a
// single filled shape (e.g. あ's looping 3rd stroke, or ぬ's 2nd stroke),
// so animCJK splits their outline into 2-3 fill
// <path id="z{cp}d{N}{letter}"> pieces sharing stroke index N (letters
// 'a', 'b', 'c', ...). For HanziWriter's "strokes" we concatenate every
// piece's path data into one multi-subpath string (renders as their
// union, since SVG fill-rule treats multiple M...Z subpaths in one <path>
// as a single filled region). For "medians" we use only the
// alphabetically-first piece's guide path: the later pieces' guide paths
// are near-identical copies of the first, except for 1-2 intentionally
// off-canvas (negative-coordinate) dummy points -- an animCJK-internal
// trick to stagger the CSS reveal animation across the split fill
// regions -- which would corrupt a real median polyline if included.

const SHIFT_Y = 900

function transformPoint([x, y]) {
  return [Math.round(x), Math.round(SHIFT_Y - y)]
}

/**
 * Parses a generic SVG path `d` string into an ordered list of
 * absolute-coordinate draw commands: { cmd: 'M'|'L'|'C'|'Q'|'Z', points }.
 * Supports the commands actually present in animCJK's kana data (verified
 * across all 92 target characters): M, L, H, V, C, Q, Z, all absolute
 * (uppercase) -- animCJK does not use relative (lowercase) commands, so
 * we deliberately don't implement relative-coordinate handling and throw
 * instead of silently mis-transforming if one is ever encountered.
 */
export function parsePath(d) {
  const tokens = d.match(/[MLCQZHV]|-?\d*\.?\d+(?:e-?\d+)?/g)
  if (!tokens) return []

  let i = 0
  const readNum = () => {
    const n = parseFloat(tokens[i])
    i++
    return n
  }

  let cmd = null
  let current = [0, 0]
  const commands = []

  while (i < tokens.length) {
    if (/^[MLCQZHV]$/.test(tokens[i])) {
      cmd = tokens[i]
      i++
    } else if (cmd === null) {
      throw new Error(`animcjk path parse error: number before any command in "${d}"`)
    }

    switch (cmd) {
      case 'M':
        current = [readNum(), readNum()]
        commands.push({ cmd: 'M', points: [current] })
        cmd = 'L' // subsequent implicit coordinate pairs after M are lineto
        break
      case 'L':
        current = [readNum(), readNum()]
        commands.push({ cmd: 'L', points: [current] })
        break
      case 'H':
        current = [readNum(), current[1]]
        commands.push({ cmd: 'L', points: [current] })
        break
      case 'V':
        current = [current[0], readNum()]
        commands.push({ cmd: 'L', points: [current] })
        break
      case 'C': {
        const p1 = [readNum(), readNum()]
        const p2 = [readNum(), readNum()]
        const p3 = [readNum(), readNum()]
        current = p3
        commands.push({ cmd: 'C', points: [p1, p2, p3] })
        break
      }
      case 'Q': {
        const p1 = [readNum(), readNum()]
        const p2 = [readNum(), readNum()]
        current = p2
        commands.push({ cmd: 'Q', points: [p1, p2] })
        break
      }
      case 'Z':
        commands.push({ cmd: 'Z', points: [] })
        break
      default:
        throw new Error(`animcjk path parse error: unsupported command "${cmd}" in "${d}"`)
    }
  }
  return commands
}

function transformCommands(commands) {
  return commands.map((c) => ({ cmd: c.cmd, points: c.points.map(transformPoint) }))
}

function commandsToPathString(commands) {
  let d = ''
  for (const c of commands) {
    if (c.cmd === 'Z') {
      d += 'Z'
    } else {
      d += c.cmd + c.points.map(([x, y]) => `${x},${y}`).join(' ')
    }
  }
  return d
}

/** Sorts variant-letter groups so '' (unlettered) sorts before 'a', 'b', ... */
function byLetter(a, b) {
  if (a.letter < b.letter) return -1
  if (a.letter > b.letter) return 1
  return 0
}

/**
 * Converts raw animCJK kana SVG text into HanziWriter-format
 * { strokes, medians }.
 */
export function convertAnimCjkKanaSvgToHanziWriter(svgText) {
  const fillMatches = [...svgText.matchAll(/<path\s+id="z\d+d(\d+)([a-z]?)"\s+d="([^"]+)"/g)]
  const guideMatches = [
    ...svgText.matchAll(/<path[^>]*\sclip-path="url\(#z\d+c(\d+)([a-z]?)\)"[^>]*\sd="([^"]+)"/g),
  ]

  const fillByN = new Map()
  for (const [, n, letter, d] of fillMatches) {
    const key = parseInt(n, 10)
    if (!fillByN.has(key)) fillByN.set(key, [])
    fillByN.get(key).push({ letter, d })
  }

  const guideByN = new Map()
  for (const [, n, letter, d] of guideMatches) {
    const key = parseInt(n, 10)
    if (!guideByN.has(key)) guideByN.set(key, [])
    guideByN.get(key).push({ letter, d })
  }

  const strokeNumbers = [...fillByN.keys()].sort((a, b) => a - b)
  const strokes = []
  const medians = []

  for (const n of strokeNumbers) {
    const fillParts = [...fillByN.get(n)].sort(byLetter)
    const mergedPath = fillParts
      .map((part) => commandsToPathString(transformCommands(parsePath(part.d))))
      .join('')
    strokes.push(mergedPath)

    const guideParts = guideByN.get(n)
    if (!guideParts || guideParts.length === 0) {
      throw new Error(`animcjk kana: no guide/median path found for stroke ${n}`)
    }
    const primaryGuide = [...guideParts].sort(byLetter)[0]
    const guideCommands = transformCommands(parsePath(primaryGuide.d))
    const medianPoints = guideCommands
      .filter((c) => c.cmd !== 'Z')
      .map((c) => c.points[c.points.length - 1])
    medians.push(medianPoints)
  }

  return { strokes, medians }
}
