// Shared shape for every language dictionary (see en.ts / es.ts / zh.ts).
// This is the single source of truth for "what UI text exists in the app" —
// adding a new user-facing string means adding a field here first, which
// forces every language file to implement it (TS will error on any
// dictionary missing a field).
//
// Deliberately excludes learning content (character readings, meanings,
// example words) — that data comes from public/data/**/*.json (KANJIDIC2 /
// JMdict, English-only) and is not part of the UI's i18n surface. See
// CREDITS_ENTRY_META in credit-meta.ts + Dictionary['credits']['entries']
// for the one place a content note about that is shown to the user.

import type { Mastery } from '../types'
import type { PracticeSetId } from '../practice-sets'
import type { CreditEntryId } from './credit-meta'

export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'ha'
  | 'id'
  | 'ig'
  | 'ja'
  | 'ko'
  | 'pt'
  | 'vi'
  | 'yo'
  | 'zh'

export interface Dictionary {
  appName: string

  nav: {
    home: string
    browse: string
    practice: string
    progress: string
    credits: string
  }

  language: {
    label: string
    names: Record<Language, string>
  }

  mastery: {
    labels: Record<Mastery, string>
  }

  home: {
    title: string
    subtitle: string
    continuePractice: string
    startPracticing: string
    todaysReview: string
    noReview: string
    statsHeading: string
    masteredOf: (mastered: number, total: number) => string
    /** Web-only "download the Android app" card — hidden inside the Capacitor native shell (see Home.tsx). */
    androidApp: {
      heading: string
      description: string
      downloadButton: string
      unknownSourceNote: string
      pwaAlternative: string
    }
    /** Web-only iOS/iPadOS "Add to Home Screen" PWA install guide — hidden inside the Capacitor native shell (see Home.tsx). */
    iosApp: {
      heading: string
      description: string
      step1: string
      step2: string
      step3: string
    }
  }

  browse: {
    title: string
    tabHiragana: string
    tabKatakana: string
    tabKanji: string
    searchPlaceholder: string
    searchResultsFor: (query: string) => string
    noSearchResults: string
    allGrades: string
    allJlpt: string
    sortByStrokeCount: string
    gradeFilterLabel: string
    jlptFilterLabel: string
    resultCount: (n: number) => string
  }

  detail: {
    onYomi: string
    kunYomi: string
    meaning: string
    examples: string
    strokeCount: string
    grade: string
    jlpt: string
    noExamples: string
    loading: string
    loadError: string
    practiceThis: string
    /** e.g. "Grade 1" / "Grado 1" / "小学1年级". grade 8 = other jouyou kanji, handled internally. */
    gradeLabel: (grade: number) => string
  }

  strokeAnimator: {
    play: string
    pause: string
    loop: string
    speed: string
    showNumbers: string
    /** "Show grid" toggle for the calligraphy-style grid guide. Shared by StrokeAnimator (CharacterDetail) and Practice. */
    showGrid: string
  }

  practice: {
    title: string
    reviewTitle: string
    chooseSet: string
    backToSets: string
    showOutline: string
    progressLabel: (index: number, total: number) => string
    mistakes: string
    setComplete: string
    setCompleteBody: string
    practiceAgain: string
    nextCharacter: string
    reviewEmptyTitle: string
    reviewEmptyBody: string
    sets: Record<PracticeSetId, string>
  }

  progress: {
    title: string
    subtitle: string
    overallHeading: string
    overallMastered: (mastered: number, total: number) => string
    masteryRate: (rate: number) => string
    totalAttempts: (n: number) => string
    lastPracticed: (date: string) => string
    neverPracticed: string
    categoriesHeading: string
    legendMastered: string
    legendPracticing: string
    legendNotStarted: string
    categoryCount: (n: number) => string
    reviewDueToday: (n: number) => string
    /** aria-label for CategoryProgressBar's stacked mastery bar (role="img"). */
    categoryBarLabel: (mastered: number, practicing: number, notStarted: number, total: number) => string
  }

  notFound: {
    title: string
    body: string
    backHome: string
  }

  credits: {
    title: string
    intro: string
    appLicenseHeading: string
    appLicenseNote: string
    meaningsLanguageNote: string
    /** Translated description text, keyed by CreditEntryId (name/license/url stay language-agnostic — see credit-meta.ts). */
    entries: Record<CreditEntryId, string>
  }
}
