// Language-agnostic parts of the Credits page entries: proper nouns
// (project names), license identifiers, and URLs. These are never
// translated. The per-language *description* of each entry lives in each
// dictionary (en.ts / es.ts / zh.ts) at credits.entries[id].

export type CreditEntryId =
  | 'animCjk'
  | 'hanziWriterDataJp'
  | 'kanjidic2'
  | 'jmdict'
  | 'hanziWriter'

export interface CreditEntryMeta {
  id: CreditEntryId
  name: string
  license: string
  url: string
}

/** Order matches the order entries are shown on the Credits page. */
export const CREDIT_ENTRY_META: CreditEntryMeta[] = [
  {
    id: 'animCjk',
    name: 'animCJK',
    license: 'GNU LGPL v3+',
    url: 'https://github.com/parsimonhi/animCJK',
  },
  {
    id: 'hanziWriterDataJp',
    name: 'animCJK / Make Me a Hanzi (via hanzi-writer-data-jp)',
    license: 'Arphic Public License',
    url: 'https://github.com/chanind/hanzi-writer-data-jp',
  },
  {
    id: 'kanjidic2',
    name: 'KANJIDIC2',
    license: 'EDRDG, CC BY-SA 4.0',
    url: 'https://www.edrdg.org/wiki/index.php/KANJIDIC_Project',
  },
  {
    id: 'jmdict',
    name: 'JMdict',
    license: 'EDRDG, CC BY-SA 4.0',
    url: 'https://www.edrdg.org/jmdict/j_jmdict.html',
  },
  {
    id: 'hanziWriter',
    name: 'Hanzi Writer',
    license: 'MIT — David Chanin',
    url: 'https://hanziwriter.org/',
  },
]
