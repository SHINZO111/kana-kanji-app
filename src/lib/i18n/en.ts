// English UI dictionary — the canonical/default language. See types.ts for
// field-by-field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const en: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Home',
    browse: 'Browse',
    practice: 'Practice',
    progress: 'Progress',
    credits: 'Credits',
  },

  language: {
    label: 'Language',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Not seen', 1: 'Seen', 2: 'Practicing', 3: 'Mastered' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Learn Japanese stroke order, readings, and vocabulary.',
    continuePractice: 'Continue practicing',
    startPracticing: 'Start practicing',
    todaysReview: "Today's review",
    noReview: 'Nothing to review yet — practice a set to get started.',
    statsHeading: 'Your progress',
    masteredOf: (mastered, total) => `${mastered} / ${total} characters mastered`,
    androidApp: {
      heading: 'Get the Android app',
      description:
        'Prefer a native app? Download the KANAKANJI APK and install it directly on your Android device.',
      downloadButton: 'Download APK (~7.8 MB)',
      unknownSourceNote:
        "This APK isn't distributed through the Play Store, so Android will ask you to allow installs from this source — that's expected.",
      pwaAlternative:
        'Prefer not to install anything? This web app also works fully offline and can be added to your home screen from your browser menu.',
    },
    iosApp: {
      heading: 'Add to your Home Screen (iPhone/iPad)',
      description:
        'On iPhone or iPad, install KANAKANJI as an app in three steps — it works fully offline.',
      step1: 'Open this site in Safari',
      step2: 'Tap the Share button',
      step3: 'Tap "Add to Home Screen"',
    },
  },

  browse: {
    title: 'Browse characters',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Search by character, reading, or meaning',
    searchResultsFor: (query) => `Results for "${query}"`,
    noSearchResults: 'No characters match your search.',
    allGrades: 'All grades',
    allJlpt: 'All JLPT levels',
    sortByStrokeCount: 'Sort by stroke count',
    gradeFilterLabel: 'Grade',
    jlptFilterLabel: 'JLPT (legacy scale)',
    resultCount: (n) => `${n} characters`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Meaning',
    examples: 'Examples',
    strokeCount: 'Strokes',
    grade: 'Grade',
    jlpt: 'JLPT (legacy scale)',
    noExamples: 'No example words available.',
    loading: 'Loading…',
    loadError: 'Could not load this character.',
    practiceThis: 'Practice this character',
    gradeLabel: (grade) => (grade === 8 ? 'Jouyou kanji' : `Grade ${grade}`),
  },

  strokeAnimator: {
    play: 'Play',
    pause: 'Pause',
    loop: 'Loop',
    speed: 'Speed',
    showNumbers: 'Show numbers',
    showGrid: 'Show grid',
  },

  practice: {
    title: 'Practice',
    reviewTitle: "Today's review",
    chooseSet: 'Choose a practice set',
    backToSets: 'Choose a different set',
    showOutline: 'Show outline',
    progressLabel: (index, total) => `Character ${index} of ${total}`,
    mistakes: 'Mistakes',
    setComplete: 'Set complete!',
    setCompleteBody: 'Great work — you traced every character in this set.',
    practiceAgain: 'Practice again',
    nextCharacter: 'Next character',
    reviewEmptyTitle: 'Nothing to review right now',
    reviewEmptyBody:
      "Characters show up here after you've viewed or practiced them but haven't mastered them yet.",
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Grade 1 kanji (80)',
      grade2: 'Grade 2 kanji (160)',
      grade3: 'Grade 3 kanji (200)',
      grade4: 'Grade 4 kanji (202)',
      grade5: 'Grade 5 kanji (193)',
      grade6: 'Grade 6 kanji (191)',
      grade8: 'Other jouyou kanji (1,110)',
    },
  },

  progress: {
    title: 'Progress',
    subtitle: 'Your mastery across every character set.',
    overallHeading: 'Overall',
    overallMastered: (mastered, total) => `${mastered} / ${total} characters mastered`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => (n === 1 ? '1 practice attempt logged' : `${n} practice attempts logged`),
    lastPracticed: (date) => `Last practiced ${date}`,
    neverPracticed: 'No practice attempts yet',
    categoriesHeading: 'By category',
    legendMastered: 'Mastered',
    legendPracticing: 'Practicing',
    legendNotStarted: 'Not started',
    categoryCount: (n) => `${n} characters`,
    reviewDueToday: (n) =>
      n === 0
        ? 'Nothing due for review today'
        : n === 1
          ? '1 character due for review today'
          : `${n} characters due for review today`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `${mastered} mastered, ${practicing} practicing, ${notStarted} not started, out of ${total}`,
  },

  credits: {
    title: 'Credits',
    intro: 'KANAKANJI relies on the following open data and libraries. Full license texts are linked below.',
    appLicenseHeading: 'This app',
    appLicenseNote:
      "KANAKANJI's own source code is not published under a separate open-source license at this time. The open data and libraries listed above remain under their original licenses (linked below).",
    meaningsLanguageNote:
      'Character meanings are sourced from KANJIDIC2/JMdict and are shown in English regardless of the app language you choose.',
    entries: {
      animCjk:
        'Source stroke-order SVGs, converted (via data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) into brush-shaped stroke data for the 92 hiragana and katakana characters.',
      hanziWriterDataJp:
        'Stroke order data for the 2,136 jōyō kanji. Originally extracted from fonts released by Arphic Technology.',
      kanjidic2: 'Kanji readings, meanings, school grade, and JLPT (legacy scale) data.',
      jmdict: 'Example vocabulary (word, reading, meaning) shown on each kanji detail page.',
      hanziWriter: 'Stroke order animation and trace-quiz engine used throughout the app.',
    },
  },

  notFound: {
    title: 'Page not found',
    body: "The page you're looking for doesn't exist.",
    backHome: 'Back to home',
  },
}
