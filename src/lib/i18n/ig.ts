// Igbo (ig) UI dictionary, using standard orthography with subdots
// (ọ, ị, ụ). Learning content (readings, meanings, example words) stays in
// English — see credits.meaningsLanguageNote below, shown on the Credits
// page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const ig: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Ụlọ',
    browse: 'Chọgharịa',
    practice: 'Mmega',
    progress: 'Ọganihu',
    credits: 'Ekele',
  },

  language: {
    label: 'Asụsụ',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Ahụbeghị', 1: 'Ahụla', 2: 'Na-emega', 3: 'Amatala nke ọma' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Mụta usoro ide, ọgụgụ na mkpụrụokwu asụsụ Japan.',
    continuePractice: 'Gaa n’ihu na mmega',
    startPracticing: 'Malite mmega',
    todaysReview: 'Ntụlegharị taa',
    noReview: 'Ọ dịbeghị ihe ị ga-atụlegharị — megaa otu setị iji malite.',
    statsHeading: 'Ọganihu gị',
    masteredOf: (mastered, total) => `Amatala mkpụrụedemede ${mastered} / ${total} nke ọma`,
    androidApp: {
      heading: 'Nweta ngwa Android',
      description:
        'Ị masịrị ngwa e wuru maka ekwentị? Budata APK KANAKANJI ma wụnye ya ozugbo na ngwaọrụ Android gị.',
      downloadButton: 'Budata APK (~7.8 MB)',
      unknownSourceNote:
        'A naghị ekesa APK a site na Play Store, ya mere Android ga-arịọ ka i kwe ka e wụnye ngwa site n’ebe a — nke ahụ bụ ihe a na-atụ anya ya.',
      pwaAlternative:
        'Ịchọghị ịwụnye ihe ọ bụla? Ngwa weebụ a na-arụkwa ọrụ nke ọma na-enweghị ịntanetị, i nwekwara ike itinye ya na ihuenyo mmalite site na menu ihe nchọgharị gị.',
      sha256Label: 'SHA-256 (maka nyocha nbudata)',
      copyButton: 'Detuo',
      copiedLabel: 'Edetuola!',
    },
    iosApp: {
      heading: 'Tinye na Ihuenyo Mmalite (iPhone/iPad)',
      description:
        'Na iPhone ma ọ bụ iPad, wụnye KANAKANJI dị ka ngwa n’usoro atọ — ọ na-arụ ọrụ nke ọma na-enweghị ịntanetị.',
      step1: 'Meghee saịtị a na Safari',
      step2: 'Pị bọtịnụ Share',
      step3: 'Pị "Add to Home Screen"',
    },
    share: {
      heading: 'Kesaa KANAKANJI',
      description: 'Gosi enyi gị koodu QR a ka o wee nwee ike ịnyocha ya ma nwalee KANAKANJI kwa.',
      qrAlt: 'Koodu QR na-eduga na ngwa weebụ KANAKANJI',
    },
  },

  browse: {
    title: 'Chọgharịa mkpụrụedemede',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Chọọ site na mkpụrụedemede, ọgụgụ ma ọ bụ nkọwa',
    searchResultsFor: (query) => `Nsonaazụ maka "${query}"`,
    noSearchResults: 'Ọ dịghị mkpụrụedemede dabara na nchọ gị.',
    allGrades: 'Klaasị niile',
    allJlpt: 'Ọkwa JLPT niile',
    sortByStrokeCount: 'Hazie site n’ọnụọgụ ahịrị',
    gradeFilterLabel: 'Klaasị',
    jlptFilterLabel: 'JLPT (usoro ochie)',
    resultCount: (n) => `Mkpụrụedemede ${n}`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Nkọwa',
    examples: 'Ọmụmaatụ',
    strokeCount: 'Ọnụọgụ ahịrị',
    grade: 'Klaasị',
    jlpt: 'JLPT (usoro ochie)',
    noExamples: 'Enweghị okwu ọmụmaatụ.',
    loading: 'Na-ebudata…',
    loadError: 'Enweghị ike ibudata mkpụrụedemede a.',
    practiceThis: 'Megaa mkpụrụedemede a',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `Klaasị ${grade}`),
  },

  strokeAnimator: {
    play: 'Kpọọ',
    pause: 'Kwụsịtụ',
    loop: 'Megharịa',
    speed: 'Ọsọ',
    showNumbers: 'Gosi ọnụọgụ',
    showGrid: 'Gosi ahịrị nduzi',
  },

  practice: {
    title: 'Mmega',
    reviewTitle: 'Ntụlegharị taa',
    chooseSet: 'Họrọ setị mmega',
    backToSets: 'Họrọ setị ọzọ',
    showOutline: 'Gosi ụkpụrụ',
    progressLabel: (index, total) => `Mkpụrụedemede ${index} n’ime ${total}`,
    mistakes: 'Mmejọ',
    setComplete: 'Setị agwụla!',
    setCompleteBody: 'Ị mere nke ọma — i degharịala mkpụrụedemede niile dị na setị a.',
    practiceAgain: 'Megaa ọzọ',
    nextCharacter: 'Mkpụrụedemede ọzọ',
    reviewEmptyTitle: 'Ọ dịghị ihe ị ga-atụlegharị ugbu a',
    reviewEmptyBody:
      'Mkpụrụedemede ị hụrụla ma ọ bụ megaa mana ị matabeghị nke ọma ga-apụta ebe a.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji klaasị 1 (80)',
      grade2: 'Kanji klaasị 2 (160)',
      grade3: 'Kanji klaasị 3 (200)',
      grade4: 'Kanji klaasị 4 (202)',
      grade5: 'Kanji klaasị 5 (193)',
      grade6: 'Kanji klaasị 6 (191)',
      grade8: 'Kanji jōyō ndị ọzọ (1,110)',
    },
  },

  progress: {
    title: 'Ọganihu',
    subtitle: 'Otú i si mata setị mkpụrụedemede ọ bụla.',
    overallHeading: 'Ngụkọta',
    overallMastered: (mastered, total) => `Amatala mkpụrụedemede ${mastered} / ${total} nke ọma`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `Mmega e dekọrọ: ${n}`,
    lastPracticed: (date) => `Mmega ikpeazụ: ${date}`,
    neverPracticed: 'E nwebeghị mmega ọ bụla',
    categoriesHeading: 'Site n’otu',
    legendMastered: 'Amatala nke ọma',
    legendPracticing: 'Na-emega',
    legendNotStarted: 'Amalitebeghị',
    categoryCount: (n) => `Mkpụrụedemede ${n}`,
    reviewDueToday: (n) =>
      n === 0
        ? 'Ọ dịghị ihe ị ga-atụlegharị taa'
        : `Mkpụrụedemede ${n} kwesịrị ntụlegharị taa`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `N’ime ${total}: ${mastered} amatala nke ọma, ${practicing} na-emega, ${notStarted} amalitebeghị`,
  },

  notFound: {
    title: 'Ahụghị ibe ahụ',
    body: 'Ibe ị na-achọ adịghị.',
    backHome: 'Laghachi n’ụlọ',
  },

  credits: {
    title: 'Ekele',
    intro:
      'KANAKANJI na-eji data mepere emepe na ọbá akwụkwọ ndị a. Ederede ikike zuru oke dị na njikọ ndị dị n’okpuru.',
    appLicenseHeading: 'Ngwa a',
    appLicenseNote:
      'E wepụtabeghị koodu isi mmalite nke KANAKANJI n’okpuru ikike open-source dị iche ugbu a. Data mepere emepe na ọbá akwụkwọ ndị e depụtara n’elu ka nọ n’okpuru ikike mbụ ha (njikọ ndị dị n’okpuru).',
    meaningsLanguageNote:
      'Nkọwa mkpụrụedemede si na KANJIDIC2/JMdict, a na-egosipụtakwa ha n’asụsụ Bekee n’agbanyeghị asụsụ ngwa ị họọrọ.',
    entries: {
      animCjk:
        'SVG usoro ide mbụ, nke a gbanwere (site na data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) ka ọ bụrụ data ahịrị yiri brọsh maka mkpụrụedemede hiragana na katakana 92.',
      hanziWriterDataJp:
        'Data usoro ide maka kanji jōyō 2,136. E si na fọntị Arphic Technology wepụtara wepụta ha na mbụ.',
      kanjidic2: 'Data ọgụgụ, nkọwa, klaasị ụlọ akwụkwọ na JLPT (usoro ochie) nke kanji.',
      jmdict: 'Mkpụrụokwu ọmụmaatụ (okwu, ọgụgụ, nkọwa) na-egosi n’ibe nkọwa kanji ọ bụla.',
      hanziWriter: 'Injin ihe ngosi usoro ide na ajụjụ ndegharị a na-eji n’ngwa a niile.',
    },
  },
}
