// Wraps HanziWriter's quiz() for tracing practice. See plan Phase 3.
//
// Callback props are kept in refs so that parent re-renders (which create
// new inline function identities) don't tear down and restart the quiz.

import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'
import type { StrokeData } from 'hanzi-writer'
import { strokeDataLoader } from '../../lib/stroke-data-loader'
import { clearChildren } from '../../lib/dom-utils'
import { STROKE_WRITER_PADDING } from '../../lib/constants'
import GridGuide from './GridGuide'

interface StrokeQuizProps {
  char: string
  size?: number
  showOutline?: boolean
  showGrid?: boolean
  onMistake?: (strokeData: StrokeData) => void
  onCorrectStroke?: (strokeData: StrokeData) => void
  onComplete?: (summary: { character: string; totalMistakes: number }) => void
}

export default function StrokeQuiz({
  char,
  size = 280,
  showOutline = true,
  showGrid = true,
  onMistake,
  onCorrectStroke,
  onComplete,
}: StrokeQuizProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const onMistakeRef = useRef(onMistake)
  const onCorrectStrokeRef = useRef(onCorrectStroke)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onMistakeRef.current = onMistake
  }, [onMistake])
  useEffect(() => {
    onCorrectStrokeRef.current = onCorrectStroke
  }, [onCorrectStroke])
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    clearChildren(container)
    const writer = HanziWriter.create(container, char, {
      width: size,
      height: size,
      padding: STROKE_WRITER_PADDING,
      showOutline,
      charDataLoader: strokeDataLoader,
    })

    writer.quiz({
      onMistake: (strokeData) => onMistakeRef.current?.(strokeData),
      onCorrectStroke: (strokeData) => onCorrectStrokeRef.current?.(strokeData),
      onComplete: (summary) => onCompleteRef.current?.(summary),
    })

    return () => {
      writer.cancelQuiz()
    }
  }, [char, size, showOutline])

  return (
    // Layering (DOM order among positioned siblings): white card background
    // -> GridGuide -> HanziWriter quiz canvas. The grid is pointer-events-none,
    // so tracing input still lands on the quiz canvas untouched.
    <div
      className="relative mx-auto rounded-lg border border-slate-200 bg-white touch-none"
      style={{ width: size, height: size }}
    >
      {showGrid && <GridGuide size={size} />}
      <div
        ref={containerRef}
        data-testid="stroke-quiz-canvas"
        className="relative"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
