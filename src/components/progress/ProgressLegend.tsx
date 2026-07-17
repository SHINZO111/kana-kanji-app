// Small legend explaining CategoryProgressBar's three segment colors.
// Shown once above the category list rather than repeated per row.

import { useTranslation } from '../../lib/i18n/useTranslation'

export default function ProgressLegend() {
  const { t } = useTranslation()

  const swatches = [
    { className: 'bg-emerald-500', label: t.progress.legendMastered },
    { className: 'bg-amber-400', label: t.progress.legendPracticing },
    { className: 'bg-slate-200', label: t.progress.legendNotStarted },
  ]

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      {swatches.map((swatch) => (
        <li key={swatch.label} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${swatch.className}`} />
          {swatch.label}
        </li>
      ))}
    </ul>
  )
}
