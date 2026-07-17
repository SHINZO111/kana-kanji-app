import { useEffect, useState } from 'react'
import CategoryProgressBar from '../components/progress/CategoryProgressBar'
import CategoryProgressRow from '../components/progress/CategoryProgressRow'
import ProgressLegend from '../components/progress/ProgressLegend'
import { useTranslation } from '../lib/i18n/useTranslation'
import { formatPracticedDate } from '../lib/format-date'
import { computeProgressStats, type ProgressStats } from '../lib/progress-stats'

export default function Progress() {
  const { t, language } = useTranslation()
  const [stats, setStats] = useState<ProgressStats | null>(null)

  useEffect(() => {
    let cancelled = false
    computeProgressStats().then((result) => {
      if (!cancelled) setStats(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">{t.progress.title}</h1>
      <p className="mt-1 text-slate-500">{t.progress.subtitle}</p>

      {!stats ? (
        <p className="mt-6 text-slate-500">{t.detail.loading}</p>
      ) : (
        <>
          <section className="mt-6 rounded-lg border border-slate-200 px-5 py-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-medium text-slate-500">{t.progress.overallHeading}</h2>
              <span className="text-2xl font-semibold text-slate-900">
                {t.progress.masteryRate(stats.overall.masteryRate)}
              </span>
            </div>
            <p className="mt-1 text-slate-700">
              {t.progress.overallMastered(stats.overall.mastered, stats.overall.total)}
            </p>
            <div className="mt-3">
              <CategoryProgressBar
                mastered={stats.overall.mastered}
                practicing={stats.overall.practicing}
                notStarted={stats.overall.notStarted}
                total={stats.overall.total}
              />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {t.progress.totalAttempts(stats.overall.attempts)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {stats.overall.lastPracticed
                ? t.progress.lastPracticed(formatPracticedDate(stats.overall.lastPracticed, language))
                : t.progress.neverPracticed}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {t.progress.reviewDueToday(stats.overall.reviewDueToday)}
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-slate-500">{t.progress.categoriesHeading}</h2>
              <ProgressLegend />
            </div>
            <div className="mt-2 divide-y divide-slate-100">
              {stats.categories.map((category) => (
                <CategoryProgressRow key={category.id} stats={category} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
