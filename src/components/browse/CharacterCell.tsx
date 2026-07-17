// A single tappable character cell used throughout Browse: gojūon table,
// kanji grid, and search results. Shows the character plus a mastery color
// dot (see lib/constants.ts MASTERY_DOT_CLASSES) and links to its detail page.

import { Link } from 'react-router-dom'
import { MASTERY_DOT_CLASSES } from '../../lib/constants'
import { useTranslation } from '../../lib/i18n/useTranslation'
import type { Mastery } from '../../lib/types'

interface CharacterCellProps {
  char: string
  mastery: Mastery
  /** Small caption under the character, e.g. romaji or stroke count. */
  caption?: string
}

export default function CharacterCell({ char, mastery, caption }: CharacterCellProps) {
  const { t } = useTranslation()
  const masteryLabel = t.mastery.labels[mastery]

  return (
    <Link
      to={`/character/${encodeURIComponent(char)}`}
      className="group relative flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-3 text-center hover:border-slate-900 hover:shadow-sm"
    >
      <span
        title={masteryLabel}
        aria-label={masteryLabel}
        className={`absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full ${MASTERY_DOT_CLASSES[mastery]}`}
      />
      <span lang="ja" className="glyph-ja text-2xl leading-none text-slate-900">
        {char}
      </span>
      {caption && <span className="text-[11px] text-slate-400">{caption}</span>}
    </Link>
  )
}
