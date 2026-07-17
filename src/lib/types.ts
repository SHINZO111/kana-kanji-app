// Shared data model types for KANAKANJI.
// See plans/web-web-andoroid-sonnet-atomic-clarke.md "データモデル" section.

export type CharacterKind = 'hiragana' | 'katakana' | 'kanji'

export interface ExampleWord {
  word: string
  reading: string
  meaning: string
}

/** Detail data for a single character. */
export interface CharacterData {
  char: string
  kind: CharacterKind
  strokeCount: number
  /** 1-6 = elementary school grade, 8 = other jouyou kanji. null for kana. */
  grade: number | null
  /** KANJIDIC2 legacy 4-level JLPT scale (pre-2010). null when unknown/kana. */
  jlpt: number | null
  onYomi: string[]
  kunYomi: string[]
  meanings: string[]
  /** Only present for kana (e.g. "a", "ka", ...). */
  romaji?: string
  examples: ExampleWord[]
}

/** Lightweight entry used by the Browse/search index (public/data/index.json). */
export interface IndexEntry {
  char: string
  kind: CharacterKind
  grade: number | null
  jlpt: number | null
  strokeCount: number
  /** First meaning only, for compact display (e.g. grid tooltips). */
  meaning: string
  /** Full meanings list, used for search. Empty for kana. */
  meanings: string[]
  /** on'yomi + kun'yomi, normalized (okurigana "." and trailing "-" stripped), for search. Empty for kana. */
  readings: string[]
  /** Only present for kana (e.g. "a", "ka", ...). Used to lay out the gojūon table. */
  romaji?: string
}

export type Mastery = 0 | 1 | 2 | 3

/** Per-character practice progress, stored in IndexedDB keyed by char. */
export interface CharProgress {
  char: string
  traceSuccesses: number
  traceFails: number
  lastPracticed: string
  mastery: Mastery
  /** Consecutive no-mistake quiz completions. Resets to 0 on any mistake. */
  cleanStreak: number
  /**
   * Simplified SM-2 scheduling fields (see lib/srs.ts). Records written
   * before Phase 7 won't have these on disk — progress-store.ts's read path
   * fills in defaults for any record missing them, so every CharProgress
   * returned to the app always has all three populated.
   */
  /** Days until the next review, as of the last graded attempt. */
  interval: number
  /** SM-2 ease factor; multiplies interval growth on each clean pass. */
  ease: number
  /** Local calendar date (YYYY-MM-DD) this character is next due for review. */
  dueDate: string
}

/** HanziWriter-format stroke data (public/data/strokes/{char}.json). */
export interface StrokeData {
  strokes: string[]
  medians: number[][][]
}
