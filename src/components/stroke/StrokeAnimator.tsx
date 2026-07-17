// Wraps HanziWriter's animateCharacter() with play/pause/speed/loop controls.
// See plan Phase 2.

import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import { strokeDataLoader } from '../../lib/stroke-data-loader'
import { useTranslation } from '../../lib/i18n/useTranslation'
import { clearChildren } from '../../lib/dom-utils'
import { STROKE_WRITER_PADDING } from '../../lib/constants'
import { getShowGridGuide, setShowGridGuide } from '../../lib/grid-guide-store'
import GridGuide from './GridGuide'
import StrokeNumberOverlay from './StrokeNumberOverlay'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const

interface StrokeAnimatorProps {
  char: string
  size?: number
}

export default function StrokeAnimator({ char, size = 280 }: StrokeAnimatorProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const loopRef = useRef(false)
  // Guards against onComplete's loop recursion (and any resulting setState)
  // firing after the writer backing it has been torn down — e.g. the user
  // navigates away, or char/size/speed changes and recreates the writer,
  // while a looped animation is still in flight. Without this, a stale
  // animateCharacter -> onComplete -> runAnimation chain keeps calling a
  // detached HanziWriter forever, burning CPU/battery in the background.
  const cancelledRef = useRef(false)

  const [speed, setSpeed] = useState<number>(1)
  const [loop, setLoop] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showNumbers, setShowNumbers] = useState(true)
  const [showGrid, setShowGrid] = useState(getShowGridGuide)

  const handleToggleGrid = (checked: boolean) => {
    setShowGrid(checked)
    setShowGridGuide(checked)
  }

  useEffect(() => {
    loopRef.current = loop
  }, [loop])

  // Recreate the writer whenever the character, size, or speed changes.
  // strokeAnimationSpeed is a create-time option in HanziWriter, so speed
  // changes rebuild the instance rather than mutating it live.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    cancelledRef.current = false
    clearChildren(container)
    const writer = HanziWriter.create(container, char, {
      width: size,
      height: size,
      padding: STROKE_WRITER_PADDING,
      showOutline: true,
      strokeAnimationSpeed: speed,
      delayBetweenStrokes: 300,
      charDataLoader: strokeDataLoader,
    })
    writerRef.current = writer
    setIsPlaying(false)
    setHasStarted(false)

    return () => {
      cancelledRef.current = true
      writer.pauseAnimation()
      writerRef.current = null
    }
  }, [char, size, speed])

  const handleTogglePlay = () => {
    const writer = writerRef.current
    if (!writer) return

    if (isPlaying) {
      writer.pauseAnimation()
      setIsPlaying(false)
      return
    }

    if (hasStarted) {
      writer.resumeAnimation()
      setIsPlaying(true)
      return
    }

    setHasStarted(true)
    setIsPlaying(true)

    const runAnimation = () => {
      writer.animateCharacter({
        onComplete: () => {
          if (cancelledRef.current) return
          if (loopRef.current) {
            runAnimation()
          } else {
            setIsPlaying(false)
            setHasStarted(false)
          }
        },
      })
    }
    runAnimation()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Layering (DOM order among positioned siblings): white card background
          -> GridGuide -> HanziWriter canvas -> stroke-number overlay. */}
      <div
        className="relative rounded-lg border border-slate-200 bg-white"
        style={{ width: size, height: size }}
      >
        {showGrid && <GridGuide size={size} />}
        <div
          ref={containerRef}
          data-testid="stroke-animator-canvas"
          className="relative"
          style={{ width: size, height: size }}
        />
        {showNumbers && <StrokeNumberOverlay char={char} size={size} />}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
        >
          {isPlaying ? t.strokeAnimator.pause : t.strokeAnimator.play}
        </button>

        <label className="flex items-center gap-1.5 text-slate-600">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          {t.strokeAnimator.loop}
        </label>

        <label className="flex items-center gap-1.5 text-slate-600">
          <input
            type="checkbox"
            checked={showNumbers}
            onChange={(e) => setShowNumbers(e.target.checked)}
          />
          {t.strokeAnimator.showNumbers}
        </label>

        <label className="flex items-center gap-1.5 text-slate-600">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => handleToggleGrid(e.target.checked)}
          />
          {t.strokeAnimator.showGrid}
        </label>

        <label className="flex items-center gap-1.5 text-slate-600">
          {t.strokeAnimator.speed}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-md border border-slate-300 px-2 py-1"
          >
            {SPEED_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
