import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import StrokeAnimator from '../components/stroke/StrokeAnimator'
import { useCharacterData } from '../hooks/useCharacterData'
import { useTranslation } from '../lib/i18n/useTranslation'
import { markViewed } from '../lib/progress-store'

export default function CharacterDetail() {
  const { t } = useTranslation()
  const { char } = useParams<{ char: string }>()
  const { data, loading, error } = useCharacterData(char)

  // Seeing a character's detail page counts as "seen" (mastery 0 -> 1), so
  // Home's "today's review" can tell unseen characters apart from ones
  // that have been looked at but not yet practiced. See progress-store.ts.
  useEffect(() => {
    if (char) void markViewed(char)
  }, [char])

  if (!char) return null

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col items-center gap-6">
        <StrokeAnimator char={char} />

        {loading && <p className="text-slate-500">{t.detail.loading}</p>}
        {error && <p className="text-red-600">{t.detail.loadError}</p>}

        {data && (
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {data.grade !== null && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  {t.detail.gradeLabel(data.grade)}
                </span>
              )}
              {data.jlpt !== null && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                  {t.detail.jlpt}: {data.jlpt}
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {data.strokeCount} {t.detail.strokeCount}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-left text-slate-700">
              <div>
                <dt className="text-sm text-slate-500">{t.detail.onYomi}</dt>
                <dd lang="ja" className="glyph-ja">
                  {data.onYomi.length ? data.onYomi.join('、') : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">{t.detail.kunYomi}</dt>
                <dd lang="ja" className="glyph-ja">
                  {data.kunYomi.length ? data.kunYomi.join('、') : '—'}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-slate-500">{t.detail.meaning}</dt>
                <dd>{data.meanings.length ? data.meanings.join(', ') : '—'}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <h2 className="text-sm font-medium text-slate-500">{t.detail.examples}</h2>
              {data.examples.length ? (
                <ul className="mt-2 divide-y divide-slate-100">
                  {data.examples.map((example) => (
                    <li key={example.word} className="py-2">
                      <span lang="ja" className="glyph-ja font-medium text-slate-900">
                        {example.word}
                      </span>{' '}
                      <span lang="ja" className="glyph-ja text-slate-500">
                        ({example.reading})
                      </span>
                      <div className="text-sm text-slate-600">{example.meaning}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">{t.detail.noExamples}</p>
              )}
            </div>

            <Link
              to="/practice"
              className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            >
              {t.detail.practiceThis}
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
