// Flat grid of search matches, shown in place of the tab's normal layout
// whenever the search box has a non-empty query (searches across all kinds,
// ignoring the active tab).

import CharacterCell from './CharacterCell'
import { useTranslation } from '../../lib/i18n/useTranslation'
import type { IndexEntry, Mastery } from '../../lib/types'

interface SearchResultsGridProps {
  query: string
  results: IndexEntry[]
  masteryMap: Map<string, Mastery>
}

export default function SearchResultsGrid({ query, results, masteryMap }: SearchResultsGridProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-6">
      <p className="text-sm text-slate-500">{t.browse.searchResultsFor(query)}</p>

      {results.length === 0 ? (
        <p className="mt-4 text-slate-500">{t.browse.noSearchResults}</p>
      ) : (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {results.map((entry) => (
            <CharacterCell
              key={entry.char}
              char={entry.char}
              caption={entry.romaji ?? entry.meaning}
              mastery={masteryMap.get(entry.char) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
