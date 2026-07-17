// Kanji tab: grade/JLPT filters + optional stroke-count sort, over a grid
// of CharacterCell. See CLAUDE.md handoff notes + plan Phase 4.

import { useMemo, useState } from 'react'
import CharacterCell from './CharacterCell'
import { useTranslation } from '../../lib/i18n/useTranslation'
import type { IndexEntry, Mastery } from '../../lib/types'

const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6, 8] as const
const JLPT_OPTIONS = [1, 2, 3, 4] as const

interface KanjiFilterGridProps {
  /** Already filtered to kind === 'kanji'. */
  entries: IndexEntry[]
  masteryMap: Map<string, Mastery>
}

export default function KanjiFilterGrid({ entries, masteryMap }: KanjiFilterGridProps) {
  const { t } = useTranslation()
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all')
  const [jlptFilter, setJlptFilter] = useState<number | 'all'>('all')
  const [sortByStrokes, setSortByStrokes] = useState(false)

  const filtered = useMemo(() => {
    const matches = entries.filter(
      (entry) =>
        (gradeFilter === 'all' || entry.grade === gradeFilter) &&
        (jlptFilter === 'all' || entry.jlpt === jlptFilter),
    )
    if (!sortByStrokes) return matches
    return [...matches].sort((a, b) => a.strokeCount - b.strokeCount)
  }, [entries, gradeFilter, jlptFilter, sortByStrokes])

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1.5 text-slate-600">
          {t.browse.gradeFilterLabel}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-md border border-slate-300 px-2 py-1"
          >
            <option value="all">{t.browse.allGrades}</option>
            {GRADE_OPTIONS.map((grade) => (
              <option key={grade} value={grade}>
                {t.detail.gradeLabel(grade)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-slate-600">
          {t.browse.jlptFilterLabel}
          <select
            value={jlptFilter}
            onChange={(e) => setJlptFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-md border border-slate-300 px-2 py-1"
          >
            <option value="all">{t.browse.allJlpt}</option>
            {JLPT_OPTIONS.map((jlpt) => (
              <option key={jlpt} value={jlpt}>
                {jlpt}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-slate-600">
          <input
            type="checkbox"
            checked={sortByStrokes}
            onChange={(e) => setSortByStrokes(e.target.checked)}
          />
          {t.browse.sortByStrokeCount}
        </label>

        <span className="ml-auto text-slate-400">{t.browse.resultCount(filtered.length)}</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map((entry) => (
          <CharacterCell
            key={entry.char}
            char={entry.char}
            caption={String(entry.strokeCount)}
            mastery={masteryMap.get(entry.char) ?? 0}
          />
        ))}
      </div>
    </div>
  )
}
