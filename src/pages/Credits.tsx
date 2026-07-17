import { CREDIT_ENTRY_META } from '../lib/i18n'
import { useTranslation } from '../lib/i18n/useTranslation'

export default function Credits() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">{t.credits.title}</h1>
      <p className="mt-2 text-slate-500">{t.credits.intro}</p>
      <p className="mt-1 text-sm text-slate-400">{t.credits.meaningsLanguageNote}</p>

      <ul className="mt-6 space-y-4 text-left text-slate-700">
        {CREDIT_ENTRY_META.map((entry) => (
          <li key={entry.id} className="rounded-lg border border-slate-200 px-4 py-3">
            <p className="font-medium text-slate-900">
              {entry.name} <span className="font-normal text-slate-500">— {entry.license}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">{t.credits.entries[entry.id]}</p>
            <a
              className="mt-1 inline-block text-sm underline"
              href={entry.url}
              target="_blank"
              rel="noreferrer"
            >
              {entry.url.replace(/^https?:\/\//, '')}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-medium text-slate-900">{t.credits.appLicenseHeading}</h2>
        <p className="mt-1 text-sm text-slate-600">{t.credits.appLicenseNote}</p>
      </div>
    </main>
  )
}
