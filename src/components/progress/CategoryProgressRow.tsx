// One row of the Progress page's category breakdown: label, mastered/total
// count, the stacked bar, and total practice attempts for that category.

import CategoryProgressBar from './CategoryProgressBar'
import { practiceSetLabel } from '../../lib/practice-sets'
import { useTranslation } from '../../lib/i18n/useTranslation'
import type { CategoryStats } from '../../lib/progress-stats'

interface CategoryProgressRowProps {
  stats: CategoryStats
}

export default function CategoryProgressRow({ stats }: CategoryProgressRowProps) {
  const { t } = useTranslation()
  const label = practiceSetLabel(stats.id, t)

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-slate-900">{label}</span>
        <span className="text-slate-500">
          {stats.mastered} / {stats.total}
        </span>
      </div>
      <div className="mt-2">
        <CategoryProgressBar
          mastered={stats.mastered}
          practicing={stats.practicing}
          notStarted={stats.notStarted}
          total={stats.total}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-400">
        {t.progress.categoryCount(stats.total)} · {t.progress.totalAttempts(stats.attempts)}
      </p>
    </div>
  )
}
