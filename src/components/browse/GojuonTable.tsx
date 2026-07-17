// Renders hiragana or katakana as the traditional gojūon (五十音) table:
// rows = consonant "dan", columns = vowel "gyō". See lib/gojuon-layout.ts.

import CharacterCell from './CharacterCell'
import { GOJUON_ROWS } from '../../lib/gojuon-layout'
import type { IndexEntry, Mastery } from '../../lib/types'

interface GojuonTableProps {
  /** Already filtered to a single kind (hiragana or katakana). */
  entries: IndexEntry[]
  masteryMap: Map<string, Mastery>
}

export default function GojuonTable({ entries, masteryMap }: GojuonTableProps) {
  const byRomaji = new Map(entries.map((entry) => [entry.romaji, entry]))

  return (
    <div className="mt-6 flex flex-col gap-2">
      {GOJUON_ROWS.map((row) => (
        <div key={row.label} className="grid grid-cols-5 gap-2">
          {row.romaji.map((romaji, colIndex) => {
            if (romaji === null) {
              return <div key={colIndex} aria-hidden="true" />
            }
            const entry = byRomaji.get(romaji)
            if (!entry) {
              return <div key={colIndex} aria-hidden="true" />
            }
            return (
              <CharacterCell
                key={entry.char}
                char={entry.char}
                caption={entry.romaji}
                mastery={masteryMap.get(entry.char) ?? 0}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
