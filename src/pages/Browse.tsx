import { useEffect, useMemo, useState } from 'react'
import GojuonTable from '../components/browse/GojuonTable'
import KanjiFilterGrid from '../components/browse/KanjiFilterGrid'
import SearchResultsGrid from '../components/browse/SearchResultsGrid'
import { useMasteryMap } from '../hooks/useMasteryMap'
import { loadCharacterIndex, searchCharacterIndex } from '../lib/character-index'
import { useTranslation } from '../lib/i18n/useTranslation'
import type { IndexEntry } from '../lib/types'

type Tab = 'hiragana' | 'katakana' | 'kanji'

export default function Browse() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('hiragana')
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<IndexEntry[] | null>(null)
  const masteryMap = useMasteryMap()

  useEffect(() => {
    let cancelled = false
    loadCharacterIndex().then((entries) => {
      if (!cancelled) setIndex(entries)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const trimmedQuery = query.trim()

  const searchResults = useMemo(() => {
    if (!index || !trimmedQuery) return []
    return searchCharacterIndex(index, trimmedQuery)
  }, [index, trimmedQuery])

  const tabEntries = useMemo(() => {
    if (!index) return []
    return index.filter((entry) => entry.kind === tab)
  }, [index, tab])

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">{t.browse.title}</h1>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.browse.searchPlaceholder}
        className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2"
      />

      <div className="mt-4 flex gap-2">
        {(['hiragana', 'katakana', 'kanji'] as const).map((tabOption) => (
          <button
            key={tabOption}
            type="button"
            onClick={() => setTab(tabOption)}
            className={
              'rounded-md px-3 py-1.5 text-sm ' +
              (tab === tabOption ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700')
            }
          >
            {tabOption === 'hiragana'
              ? t.browse.tabHiragana
              : tabOption === 'katakana'
                ? t.browse.tabKatakana
                : t.browse.tabKanji}
          </button>
        ))}
      </div>

      {!index ? (
        <p className="mt-6 text-slate-500">{t.detail.loading}</p>
      ) : trimmedQuery ? (
        <SearchResultsGrid query={trimmedQuery} results={searchResults} masteryMap={masteryMap} />
      ) : tab === 'kanji' ? (
        <KanjiFilterGrid entries={tabEntries} masteryMap={masteryMap} />
      ) : (
        <GojuonTable entries={tabEntries} masteryMap={masteryMap} />
      )}
    </main>
  )
}
