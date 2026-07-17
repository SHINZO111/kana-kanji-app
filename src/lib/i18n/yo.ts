// Yoruba (yo) UI dictionary, using standard orthography with subdots and
// tone marks (ọ, ẹ, ṣ, à/á …). Learning content (readings, meanings,
// example words) stays in English — see credits.meaningsLanguageNote below,
// shown on the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const yo: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Ilé',
    browse: 'Ṣàwárí',
    practice: 'Ìdánrawò',
    progress: 'Ìtẹ̀síwájú',
    credits: 'Ìdúpẹ́',
  },

  language: {
    label: 'Èdè',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Kò tíì rí', 1: 'Ti rí', 2: 'Ń dánrawò', 3: 'Ti mọ̀ dáadáa' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Kọ́ ètò ìlà, kíkà àti àwọn ọ̀rọ̀ èdè Japan.',
    continuePractice: 'Tẹ̀síwájú nínú ìdánrawò',
    startPracticing: 'Bẹ̀rẹ̀ ìdánrawò',
    todaysReview: 'Àtúnyẹ̀wò òní',
    noReview: 'Kò sí ohun àtúnyẹ̀wò síbẹ̀ — dánrawò lórí àkójọ kan láti bẹ̀rẹ̀.',
    statsHeading: 'Ìtẹ̀síwájú rẹ',
    masteredOf: (mastered, total) => `Àmì ${mastered} / ${total} tí o ti mọ̀ dáadáa`,
    androidApp: {
      heading: 'Gba app Android náà',
      description:
        'Ṣé o fẹ́ràn app tó dá dúró? Gba APK KANAKANJI kí o sì fi sórí ẹ̀rọ Android rẹ tààrà.',
      downloadButton: 'Gba APK (~7.8 MB)',
      unknownSourceNote:
        'Wọn kò pín APK yìí nípasẹ̀ Play Store, nítorí náà Android yóò béèrè kí o gba ìfisórí láti orísun yìí láyè — èyí jẹ́ ohun tó yẹ.',
      pwaAlternative:
        'O kò fẹ́ fi ohunkóhun sórí ẹ̀rọ? App wẹ́ẹ̀bù yìí náà ń ṣiṣẹ́ ní kíkún láìsí ìtakùn ayélujára, o sì lè fi kún ojú ìbojú ilé láti inú mẹ́nù aṣàwákiri rẹ.',
    },
    iosApp: {
      heading: 'Fi kún Ojú Ìboju Ilé (iPhone/iPad)',
      description:
        'Lórí iPhone tàbí iPad, fi KANAKANJI sórí ẹ̀rọ rẹ gẹ́gẹ́ bí app ní ìgbésẹ̀ mẹ́ta — ó ń ṣiṣẹ́ ní kíkún láìsí ìtakùn ayélujára.',
      step1: 'Ṣí ojú òpó yìí nínú Safari',
      step2: 'Tẹ bọ́tìnnì Share',
      step3: 'Tẹ "Add to Home Screen"',
    },
  },

  browse: {
    title: 'Ṣàwárí àwọn àmì',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Wá nípa àmì, kíkà tàbí ìtumọ̀',
    searchResultsFor: (query) => `Àbájáde fún "${query}"`,
    noSearchResults: 'Kò sí àmì tó bá ìwádìí rẹ mu.',
    allGrades: 'Gbogbo kíláàsì',
    allJlpt: 'Gbogbo ìpele JLPT',
    sortByStrokeCount: 'Tò nípa iye ìlà',
    gradeFilterLabel: 'Kíláàsì',
    jlptFilterLabel: 'JLPT (òṣùwọ̀n àtijọ́)',
    resultCount: (n) => `Àmì ${n}`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Ìtumọ̀',
    examples: 'Àpẹẹrẹ',
    strokeCount: 'Iye ìlà',
    grade: 'Kíláàsì',
    jlpt: 'JLPT (òṣùwọ̀n àtijọ́)',
    noExamples: 'Kò sí ọ̀rọ̀ àpẹẹrẹ.',
    loading: 'Ń gbé wọlé…',
    loadError: 'A kò lè gbé àmì yìí wọlé.',
    practiceThis: 'Dánrawò lórí àmì yìí',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `Kíláàsì ${grade}`),
  },

  strokeAnimator: {
    play: 'Bẹ̀rẹ̀',
    pause: 'Dúró díẹ̀',
    loop: 'Tún un ṣe',
    speed: 'Ìyára',
    showNumbers: 'Fi nọ́mbà hàn',
    showGrid: 'Fi ìlà ìtọ́sọ́nà hàn',
  },

  practice: {
    title: 'Ìdánrawò',
    reviewTitle: 'Àtúnyẹ̀wò òní',
    chooseSet: 'Yan àkójọ ìdánrawò',
    backToSets: 'Yan àkójọ mìíràn',
    showOutline: 'Fi ìlà ìtọ́sọ́nà hàn',
    progressLabel: (index, total) => `Àmì ${index} nínú ${total}`,
    mistakes: 'Àṣìṣe',
    setComplete: 'Àkójọ ti parí!',
    setCompleteBody: 'Kú iṣẹ́ — o ti tọ gbogbo àmì inú àkójọ yìí.',
    practiceAgain: 'Tún dánrawò',
    nextCharacter: 'Àmì tó kàn',
    reviewEmptyTitle: 'Kò sí ohun àtúnyẹ̀wò báyìí',
    reviewEmptyBody:
      'Àwọn àmì tí o ti rí tàbí dánrawò lé lórí ṣùgbọ́n tí o kò tíì mọ̀ dáadáa yóò hàn níbí.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji kíláàsì 1 (80)',
      grade2: 'Kanji kíláàsì 2 (160)',
      grade3: 'Kanji kíláàsì 3 (200)',
      grade4: 'Kanji kíláàsì 4 (202)',
      grade5: 'Kanji kíláàsì 5 (193)',
      grade6: 'Kanji kíláàsì 6 (191)',
      grade8: 'Àwọn kanji jōyō yòókù (1,110)',
    },
  },

  progress: {
    title: 'Ìtẹ̀síwájú',
    subtitle: 'Bí o ṣe mọ àkójọ àmì kọ̀ọ̀kan dáadáa.',
    overallHeading: 'Àpapọ̀',
    overallMastered: (mastered, total) => `Àmì ${mastered} / ${total} tí o ti mọ̀ dáadáa`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `Ìgbìyànjú ìdánrawò ${n}`,
    lastPracticed: (date) => `Ìdánrawò tó kẹ́yìn: ${date}`,
    neverPracticed: 'Kò tíì sí ìgbìyànjú ìdánrawò',
    categoriesHeading: 'Nípa ẹ̀ka',
    legendMastered: 'Ti mọ̀ dáadáa',
    legendPracticing: 'Ń dánrawò',
    legendNotStarted: 'Kò tíì bẹ̀rẹ̀',
    categoryCount: (n) => `Àmì ${n}`,
    reviewDueToday: (n) =>
      n === 0 ? 'Kò sí àtúnyẹ̀wò lónìí' : `Àmì ${n} ló yẹ fún àtúnyẹ̀wò lónìí`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `Nínú ${total}: ${mastered} ti mọ̀ dáadáa, ${practicing} ń dánrawò, ${notStarted} kò tíì bẹ̀rẹ̀`,
  },

  notFound: {
    title: 'A kò rí ojúewé náà',
    body: 'Ojúewé tí o ń wá kò sí.',
    backHome: 'Padà sí ilé',
  },

  credits: {
    title: 'Ìdúpẹ́',
    intro:
      'KANAKANJI ń lo àwọn dátà gbangba àti àwọn ohun èlò wọ̀nyí. Ọ̀rọ̀ ìwé-àṣẹ ní kíkún wà ní àwọn ìjápọ̀ ìsàlẹ̀.',
    appLicenseHeading: 'App yìí',
    appLicenseNote:
      'Kóòdù orísun KANAKANJI fúnra rẹ̀ kò tíì jáde lábẹ́ ìwé-àṣẹ orísun-ṣíṣí ọ̀tọ̀ báyìí. Àwọn dátà gbangba àti ohun èlò tí a tò sókè ṣì wà lábẹ́ ìwé-àṣẹ ìpilẹ̀ṣẹ̀ wọn (ìjápọ̀ ìsàlẹ̀).',
    meaningsLanguageNote:
      'Ìtumọ̀ àwọn àmì wá láti KANJIDIC2/JMdict, wọ́n sì máa hàn ní èdè Gẹ̀ẹ́sì láìka èdè app tí o yàn sí.',
    entries: {
      animCjk:
        'SVG ètò ìlà ìpilẹ̀ṣẹ̀, tí a yí padà (nípasẹ̀ data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) sí dátà ìlà oníbrọ́ọ̀ṣì fún àmì hiragana àti katakana 92.',
      hanziWriterDataJp:
        'Dátà ètò ìlà fún kanji jōyō 2,136. A kọ́kọ́ yọ wọ́n jáde láti inú àwọn fọ́ntì tí Arphic Technology gbé jáde.',
      kanjidic2: 'Dátà kíkà, ìtumọ̀, kíláàsì ilé-ìwé àti JLPT (òṣùwọ̀n àtijọ́) fún kanji.',
      jmdict: 'Àwọn ọ̀rọ̀ àpẹẹrẹ (ọ̀rọ̀, kíkà, ìtumọ̀) tó ń hàn ní ojúewé kúlẹ̀kúlẹ̀ kanji kọ̀ọ̀kan.',
      hanziWriter: 'Ẹ̀rọ ìṣàfihàn ètò ìlà àti ìdánwò títọ̀ tí gbogbo app ń lò.',
    },
  },
}
