// Hausa (ha) UI dictionary. Learning content (readings, meanings, example
// words) stays in English — see credits.meaningsLanguageNote below, shown on
// the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const ha: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Gida',
    browse: 'Duba',
    practice: 'Atisaye',
    progress: 'Ci gaba',
    credits: 'Godiya',
  },

  language: {
    label: 'Harshe',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Ba a gani ba', 1: 'An gani', 2: 'Ana atisaye', 3: 'An ƙware' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Koyi yadda ake rubuta haruffan Jafananci, karatunsu da kalmomi.',
    continuePractice: 'Ci gaba da atisaye',
    startPracticing: 'Fara atisaye',
    todaysReview: 'Bita na yau',
    noReview: 'Babu abin bita tukuna — fara da atisayen wani rukuni.',
    statsHeading: 'Ci gabanka',
    masteredOf: (mastered, total) => `An ƙware haruffa ${mastered} / ${total}`,
    androidApp: {
      heading: 'Sami manhajar Android',
      description:
        'Ka fi son manhaja ta asali? Sauke APK na KANAKANJI ka shigar da shi kai tsaye a na’urarka ta Android.',
      downloadButton: 'Sauke APK (~7.8 MB)',
      unknownSourceNote:
        'Ba a rarraba wannan APK ta Play Store ba, don haka Android zai nemi izininka na shigar da manhaja daga wannan tushe — hakan al’ada ce.',
      pwaAlternative:
        'Ba ka son shigar da komai? Wannan manhajar yanar gizo ma tana aiki gaba ɗaya ba tare da intanet ba, kuma ana iya ƙara ta a allon gida daga menu na burauza.',
      sha256Label: 'SHA-256 (don tabbatar da sauke fayil)',
      copyButton: 'Kwafa',
      copiedLabel: 'An kwafa!',
    },
    iosApp: {
      heading: 'Ƙara zuwa allon gida (iPhone/iPad)',
      description:
        'A kan iPhone ko iPad, shigar da KANAKANJI kamar manhaja a matakai uku — tana aiki gaba ɗaya ba tare da intanet ba.',
      step1: 'Buɗe wannan shafin a Safari',
      step2: 'Danna maɓallin Share',
      step3: 'Danna "Add to Home Screen"',
    },
    share: {
      heading: 'Raba KANAKANJI',
      description: 'Nuna wa aboki wannan lambar QR domin ya iya bincika ta ya gwada KANAKANJI shi ma.',
      qrAlt: 'Lambar QR mai kaiwa zuwa manhajar yanar gizo ta KANAKANJI',
    },
  },

  browse: {
    title: 'Duba haruffa',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Nema ta harafi, karatu ko ma’ana',
    searchResultsFor: (query) => `Sakamakon "${query}"`,
    noSearchResults: 'Babu harafin da ya dace da bincikenka.',
    allGrades: 'Duk azuzuwa',
    allJlpt: 'Duk matakan JLPT',
    sortByStrokeCount: 'Jera bisa yawan bugu',
    gradeFilterLabel: 'Aji',
    jlptFilterLabel: 'JLPT (tsohon ma’auni)',
    resultCount: (n) => `Haruffa ${n}`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Ma’ana',
    examples: 'Misalai',
    strokeCount: 'Yawan bugu',
    grade: 'Aji',
    jlpt: 'JLPT (tsohon ma’auni)',
    noExamples: 'Babu kalmomin misali.',
    loading: 'Ana lodawa…',
    loadError: 'Ba a iya loda wannan harafi ba.',
    practiceThis: 'Yi atisayen wannan harafi',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `Aji na ${grade}`),
  },

  strokeAnimator: {
    play: 'Kunna',
    pause: 'Dakata',
    loop: 'Maimaita',
    speed: 'Sauri',
    showNumbers: 'Nuna lambobi',
    showGrid: 'Nuna layukan jagora',
  },

  practice: {
    title: 'Atisaye',
    reviewTitle: 'Bita na yau',
    chooseSet: 'Zaɓi rukunin atisaye',
    backToSets: 'Zaɓi wani rukuni',
    showOutline: 'Nuna zane',
    progressLabel: (index, total) => `Harafi na ${index} cikin ${total}`,
    mistakes: 'Kurakurai',
    setComplete: 'An gama rukunin!',
    setCompleteBody: 'Madalla — ka rubuta duk haruffan wannan rukunin.',
    practiceAgain: 'Sake atisaye',
    nextCharacter: 'Harafi na gaba',
    reviewEmptyTitle: 'Babu abin bita a yanzu',
    reviewEmptyBody:
      'Haruffan da ka gani ko ka yi atisayensu amma ba ka ƙware ba tukuna za su bayyana a nan.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji na aji 1 (80)',
      grade2: 'Kanji na aji 2 (160)',
      grade3: 'Kanji na aji 3 (200)',
      grade4: 'Kanji na aji 4 (202)',
      grade5: 'Kanji na aji 5 (193)',
      grade6: 'Kanji na aji 6 (191)',
      grade8: 'Sauran kanji jōyō (1,110)',
    },
  },

  progress: {
    title: 'Ci gaba',
    subtitle: 'Matakin ƙwarewarka a kowane rukunin haruffa.',
    overallHeading: 'Gaba ɗaya',
    overallMastered: (mastered, total) => `An ƙware haruffa ${mastered} / ${total}`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `An rubuta atisaye ${n}`,
    lastPracticed: (date) => `Atisaye na ƙarshe: ${date}`,
    neverPracticed: 'Ba a yi atisaye ba tukuna',
    categoriesHeading: 'Bisa rukuni',
    legendMastered: 'An ƙware',
    legendPracticing: 'Ana atisaye',
    legendNotStarted: 'Ba a fara ba',
    categoryCount: (n) => `Haruffa ${n}`,
    reviewDueToday: (n) =>
      n === 0 ? 'Babu abin bita a yau' : `Haruffa ${n} na bukatar bita a yau`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `Daga cikin ${total}: an ƙware ${mastered}, ana atisaye ${practicing}, ba a fara ${notStarted} ba`,
  },

  notFound: {
    title: 'Ba a sami shafin ba',
    body: 'Shafin da kake nema babu shi.',
    backHome: 'Koma gida',
  },

  credits: {
    title: 'Godiya',
    intro:
      'KANAKANJI na amfani da waɗannan bayanan buɗe ido da ɗakunan karatu. Cikakken rubutun lasisi na kowanne yana nan a mahaɗan da ke ƙasa.',
    appLicenseHeading: 'Wannan manhaja',
    appLicenseNote:
      'A halin yanzu ba a buga lambar tushen KANAKANJI a ƙarƙashin wani lasisin buɗaɗɗen tushe na daban ba. Bayanan buɗe ido da ɗakunan karatu da ke sama suna nan ƙarƙashin lasisinsu na asali (mahaɗan ƙasa).',
    meaningsLanguageNote:
      'Ma’anonin haruffa daga KANJIDIC2/JMdict suke, kuma ana nuna su da Turanci ko wane harshe ka zaɓa a manhajar.',
    entries: {
      animCjk:
        'Ainihin SVG na tsarin rubutu, waɗanda aka mayar da su (ta data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) bayanan bugun goga na haruffan hiragana da katakana guda 92.',
      hanziWriterDataJp:
        'Bayanan tsarin rubutu na kanji jōyō guda 2,136. Asalinsu an ciro su ne daga fonts da Arphic Technology ta fitar.',
      kanjidic2: 'Bayanan karatu, ma’ana, aji da JLPT (tsohon ma’auni) na kanji.',
      jmdict: 'Kalmomin misali (kalma, karatu, ma’ana) da ake nunawa a shafin kowane kanji.',
      hanziWriter: 'Injin motsin tsarin rubutu da gwajin rubutu da ake amfani da shi a duk manhajar.',
    },
  },
}
