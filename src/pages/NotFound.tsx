// Catch-all route (App.tsx `*`) for unmatched URLs — e.g. a stale bookmark
// to a deleted character, or a typo'd path. See plan work item D-4.

import { Link } from 'react-router-dom'
import { useTranslation } from '../lib/i18n/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">{t.notFound.title}</h1>
      <p className="mt-2 text-slate-600">{t.notFound.body}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        {t.notFound.backHome}
      </Link>
    </main>
  )
}
