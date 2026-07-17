// Stacked mastery bar for one category on the Progress page. Segment colors
// match Browse's CharacterCell mastery dots (MASTERY_DOT_CLASSES) so the two
// pages read as one system: emerald = mastered, amber = practicing, slate =
// not started.

import { useTranslation } from '../../lib/i18n/useTranslation'

interface CategoryProgressBarProps {
  mastered: number
  practicing: number
  notStarted: number
  total: number
}

export default function CategoryProgressBar({
  mastered,
  practicing,
  notStarted,
  total,
}: CategoryProgressBarProps) {
  const { t } = useTranslation()
  const widthOf = (n: number) => (total === 0 ? 0 : (n / total) * 100)

  return (
    <div
      role="img"
      aria-label={t.progress.categoryBarLabel(mastered, practicing, notStarted, total)}
      className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
    >
      {mastered > 0 && <span className="h-full bg-emerald-500" style={{ width: `${widthOf(mastered)}%` }} />}
      {practicing > 0 && <span className="h-full bg-amber-400" style={{ width: `${widthOf(practicing)}%` }} />}
      {notStarted > 0 && <span className="h-full bg-slate-200" style={{ width: `${widthOf(notStarted)}%` }} />}
    </div>
  )
}
