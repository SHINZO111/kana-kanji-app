import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import StrokeQuiz from '../components/stroke/StrokeQuiz'
import { loadPracticeSet, loadReviewSet } from '../lib/practice-sets'
import type { PracticeSetId } from '../lib/practice-sets'
import { setLastPracticeSetId } from '../lib/last-practice-set'
import { getShowGridGuide, setShowGridGuide } from '../lib/grid-guide-store'
import { recordAttempt } from '../lib/progress-store'
import { useTranslation } from '../lib/i18n/useTranslation'

const NEXT_CHARACTER_DELAY_MS = 700

/** 'review' is a dynamic, per-user set (see Home's "Today's review"), not one of the fixed sets below. */
type ActiveSet = PracticeSetId | 'review'

const SET_IDS: readonly PracticeSetId[] = [
  'hiragana',
  'katakana',
  'grade1',
  'grade2',
  'grade3',
  'grade4',
  'grade5',
  'grade6',
  'grade8',
]

export default function Practice() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const setOptions = useMemo(
    () => SET_IDS.map((id) => ({ id, label: t.practice.sets[id] })),
    [t],
  )
  const setIdLookup = useMemo(() => new Set<PracticeSetId>(SET_IDS), [])
  const [setId, setSetId] = useState<ActiveSet | null>(null)
  const [characters, setCharacters] = useState<string[]>([])
  const [loadingSet, setLoadingSet] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [round, setRound] = useState(0)
  const [showOutline, setShowOutline] = useState(true)
  const [showGrid, setShowGrid] = useState(getShowGridGuide)
  const [mistakesThisChar, setMistakesThisChar] = useState(0)

  const handleToggleGrid = (checked: boolean) => {
    setShowGrid(checked)
    setShowGridGuide(checked)
  }

  // One-shot: honor ?mode=review or ?set=<id> from Home's links/query params
  // on initial mount only. Ignores later query-string changes intentionally.
  useEffect(() => {
    if (searchParams.get('mode') === 'review') {
      setSetId('review')
      return
    }
    const requestedSet = searchParams.get('set')
    if (requestedSet && setIdLookup.has(requestedSet as PracticeSetId)) {
      chooseSet(requestedSet as PracticeSetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!setId) return
    let cancelled = false
    setLoadingSet(true)
    const load = setId === 'review' ? loadReviewSet() : loadPracticeSet(setId)
    load.then((chars) => {
      if (cancelled) return
      setCharacters(chars)
      setCurrentIndex(0)
      setMistakesThisChar(0)
      setLoadingSet(false)
    })
    return () => {
      cancelled = true
    }
  }, [setId])

  const currentChar = characters[currentIndex]
  const isSetComplete = characters.length > 0 && currentIndex >= characters.length
  const isEmptyReview = setId === 'review' && !loadingSet && characters.length === 0

  function chooseSet(id: PracticeSetId) {
    setLastPracticeSetId(id)
    setSetId(id)
  }

  const handleChooseDifferentSet = () => {
    setSetId(null)
    setCharacters([])
    setCurrentIndex(0)
  }

  const handlePracticeAgain = () => {
    setCurrentIndex(0)
    setMistakesThisChar(0)
    setRound((r) => r + 1)
  }

  const handleMistake = () => setMistakesThisChar((m) => m + 1)

  const handleComplete = (summary: { character: string; totalMistakes: number }) => {
    void recordAttempt(summary.character, summary.totalMistakes)
    window.setTimeout(() => {
      setCurrentIndex((i) => i + 1)
      setMistakesThisChar(0)
    }, NEXT_CHARACTER_DELAY_MS)
  }

  if (!setId) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">{t.practice.title}</h1>
        <p className="mt-2 text-slate-500">{t.practice.chooseSet}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {setOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => chooseSet(opt.id)}
              className="rounded-md border border-slate-300 px-3 py-3 text-sm text-slate-700 hover:border-slate-900 hover:text-slate-900"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </main>
    )
  }

  if (loadingSet) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 text-center text-slate-500">
        {t.detail.loading}
      </main>
    )
  }

  if (isEmptyReview) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{t.practice.reviewEmptyTitle}</h1>
        <p className="mt-2 text-slate-600">{t.practice.reviewEmptyBody}</p>
        <button
          type="button"
          onClick={handleChooseDifferentSet}
          className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          {t.practice.backToSets}
        </button>
      </main>
    )
  }

  if (isSetComplete) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{t.practice.setComplete}</h1>
        <p className="mt-2 text-slate-600">{t.practice.setCompleteBody}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={handlePracticeAgain}
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            {t.practice.practiceAgain}
          </button>
          <button
            type="button"
            onClick={handleChooseDifferentSet}
            className="rounded-md border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50"
          >
            {t.practice.backToSets}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {setId === 'review' ? t.practice.reviewTitle : t.practice.title}
        </h1>
        <button
          type="button"
          onClick={handleChooseDifferentSet}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          {t.practice.backToSets}
        </button>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        {t.practice.progressLabel(currentIndex + 1, characters.length)}
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {currentChar && (
          <StrokeQuiz
            key={`${setId}-${round}-${currentIndex}`}
            char={currentChar}
            showOutline={showOutline}
            showGrid={showGrid}
            onMistake={handleMistake}
            onComplete={handleComplete}
          />
        )}

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={showOutline}
              onChange={(e) => setShowOutline(e.target.checked)}
            />
            {t.practice.showOutline}
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => handleToggleGrid(e.target.checked)}
            />
            {t.strokeAnimator.showGrid}
          </label>
          <span>
            {t.practice.mistakes}: {mistakesThisChar}
          </span>
        </div>
      </div>
    </main>
  )
}
