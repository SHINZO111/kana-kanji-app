// Faint calligraphy-practice-book style grid guide: a square frame around
// the character area plus dashed center crosshair lines (十字リーダー), helping
// learners judge stroke placement and balance.
//
// Rendered as an absolutely-positioned SVG *behind* the HanziWriter layer
// (DOM order inside a shared `relative` wrapper — see StrokeAnimator /
// StrokeQuiz), so strokes, outlines, and hints always paint on top of it.
// The frame hugs the character drawing area, i.e. the writer's box minus
// its padding, so the grid matches where HanziWriter actually draws.

import { STROKE_WRITER_PADDING } from '../../lib/constants'

interface GridGuideProps {
  size: number
  /** Must match the `padding` passed to HanziWriter.create() for this canvas. */
  padding?: number
}

/** slate-300 — faint enough not to compete with strokes, outlines, or hints. */
const GUIDE_COLOR = '#cbd5e1'
const GUIDE_OPACITY = 0.5
const CROSS_DASH = '6 5'

export default function GridGuide({ size, padding = STROKE_WRITER_PADDING }: GridGuideProps) {
  const min = padding
  const span = size - padding * 2
  const mid = size / 2

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      data-testid="grid-guide"
    >
      <g stroke={GUIDE_COLOR} strokeOpacity={GUIDE_OPACITY} strokeWidth={1} fill="none">
        <rect x={min} y={min} width={span} height={span} />
        <line x1={min} y1={mid} x2={min + span} y2={mid} strokeDasharray={CROSS_DASH} />
        <line x1={mid} y1={min} x2={mid} y2={min + span} strokeDasharray={CROSS_DASH} />
      </g>
    </svg>
  )
}
