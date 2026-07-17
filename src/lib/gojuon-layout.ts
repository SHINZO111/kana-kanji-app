// Standard gojūon (五十音) table layout, expressed as the romaji values
// produced by data-pipeline/lib/kana-table.mjs. `null` marks a gap cell
// (e.g. the ya/yu/yo row has no "yi"/"ye" column). Browse looks up each
// slot's actual character by romaji from the IndexEntry list, so this
// layout works for both hiragana and katakana.

export const GOJUON_COLUMNS = ['a', 'i', 'u', 'e', 'o'] as const

export const GOJUON_ROWS: { label: string; romaji: (string | null)[] }[] = [
  { label: 'a', romaji: ['a', 'i', 'u', 'e', 'o'] },
  { label: 'ka', romaji: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { label: 'sa', romaji: ['sa', 'shi', 'su', 'se', 'so'] },
  { label: 'ta', romaji: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { label: 'na', romaji: ['na', 'ni', 'nu', 'ne', 'no'] },
  { label: 'ha', romaji: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { label: 'ma', romaji: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { label: 'ya', romaji: ['ya', null, 'yu', null, 'yo'] },
  { label: 'ra', romaji: ['ra', 'ri', 'ru', 're', 'ro'] },
  { label: 'wa', romaji: ['wa', null, null, null, 'wo'] },
  { label: 'n', romaji: ['n', null, null, null, null] },
]
