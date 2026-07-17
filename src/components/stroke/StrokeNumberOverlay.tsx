// Absolute-positioned SVG overlay that draws stroke-order numbers (1, 2, 3…)
// near the starting point of each stroke, on top of StrokeAnimator's
// HanziWriter canvas. See plan work item B.
//
// Coordinates: medians[i][0] (a stroke's starting point) lives in
// HanziWriter's internal ~1024x1024 data space. HanziWriter.getScalingTransform
// (a static method, independent of any writer instance) returns the same
// {x, y, scale} used internally by its own Positioner to place strokes, so
// reusing it here guarantees the numbers land exactly on the strokes
// StrokeAnimator renders with the same width/height/padding. Positioner's
// forward mapping (derived from its convertExternalPoint inverse, see
// node_modules/hanzi-writer/dist/index.esm.js) is:
//   screenX = x + scale * dataX
//   screenY = height - y - scale * dataY   (note the y-flip)
import { useEffect, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import type { CharacterJson } from 'hanzi-writer'
import { strokeDataLoader } from '../../lib/stroke-data-loader'
import { STROKE_WRITER_PADDING } from '../../lib/constants'

interface StrokeNumberOverlayProps {
  char: string
  size: number
}

interface LabelPosition {
  x: number
  y: number
}

/** Distance (px) each label is nudged away from the stroke's start point. */
const LABEL_OFFSET_PX = 16
const FALLBACK_OFFSET: LabelPosition = { x: -LABEL_OFFSET_PX * 0.6, y: -LABEL_OFFSET_PX * 0.6 }

function toScreen(dataX: number, dataY: number, ox: number, oy: number, scale: number, size: number) {
  return {
    x: ox + scale * dataX,
    y: size - oy - scale * dataY,
  }
}

/** Places each label at the stroke's start point, nudged away from the
 * stroke's own direction (toward the start, away from the first->second
 * median segment) so it doesn't sit directly on top of the ink. */
function computeLabelPositions(medians: number[][][], size: number): LabelPosition[] {
  const { x: ox, y: oy, scale } = HanziWriter.getScalingTransform(size, size, STROKE_WRITER_PADDING)

  return medians.map((median) => {
    const p0 = median[0]
    const p1 = median[1]
    if (!p0) return { x: size / 2, y: size / 2 }

    const start = toScreen(p0[0], p0[1], ox, oy, scale, size)
    if (!p1) {
      return { x: start.x + FALLBACK_OFFSET.x, y: start.y + FALLBACK_OFFSET.y }
    }

    const end = toScreen(p1[0], p1[1], ox, oy, scale, size)
    const vx = start.x - end.x
    const vy = start.y - end.y
    const length = Math.hypot(vx, vy)
    if (length < 1e-6) {
      return { x: start.x + FALLBACK_OFFSET.x, y: start.y + FALLBACK_OFFSET.y }
    }

    return {
      x: start.x + (vx / length) * LABEL_OFFSET_PX,
      y: start.y + (vy / length) * LABEL_OFFSET_PX,
    }
  })
}

export default function StrokeNumberOverlay({ char, size }: StrokeNumberOverlayProps) {
  const [positions, setPositions] = useState<LabelPosition[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setPositions(null)

    // strokeDataLoader (see lib/stroke-data-loader.ts) always returns a
    // Promise regardless of the onLoad/onError callback params in
    // HanziWriter's CharDataLoaderFn signature — it ignores them and just
    // resolves/rejects the promise, backed by the same in-memory cache
    // StrokeAnimator's own HanziWriter instance uses, so this costs no
    // extra network request.
    const promise = strokeDataLoader(
      char,
      () => {},
      () => {},
    ) as Promise<CharacterJson>

    promise
      .then((data) => {
        if (cancelled || !data?.medians) return
        setPositions(computeLabelPositions(data.medians, size))
      })
      .catch(() => {
        if (!cancelled) setPositions([])
      })

    return () => {
      cancelled = true
    }
  }, [char, size])

  if (!positions || positions.length === 0) return null

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      data-testid="stroke-number-overlay"
    >
      {positions.map((pos, index) => (
        <text
          key={index}
          x={pos.x}
          y={pos.y}
          fontSize={14}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#1d4ed8"
          stroke="white"
          strokeWidth={3}
          style={{ paintOrder: 'stroke' }}
        >
          {index + 1}
        </text>
      ))}
    </svg>
  )
}
