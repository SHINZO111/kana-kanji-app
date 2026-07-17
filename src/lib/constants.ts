// Non-text UI constants that don't belong in the i18n dictionaries (see
// lib/i18n/). Everything that used to live here as English strings has
// moved to lib/i18n/en.ts (+ es.ts / zh.ts) as of Phase 7 — see
// lib/i18n/types.ts for the full text shape and useTranslation() for how
// components read it.

import type { Mastery } from './types'

/** Tailwind class for each mastery level's grid dot color. Not translatable — kept here, not in i18n. */
export const MASTERY_DOT_CLASSES: Record<Mastery, string> = {
  0: 'bg-slate-200',
  1: 'bg-blue-400',
  2: 'bg-amber-400',
  3: 'bg-emerald-500',
}

/**
 * Padding (in px, within the writer's own width/height box) passed to
 * HanziWriter.create() by StrokeAnimator. StrokeNumberOverlay must use the
 * exact same value in its HanziWriter.getScalingTransform() call so its
 * number labels land on the same coordinate space as the rendered strokes.
 */
export const STROKE_WRITER_PADDING = 20
