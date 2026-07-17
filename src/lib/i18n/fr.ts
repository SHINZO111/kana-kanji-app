// French (fr) UI dictionary. Learning content (readings, meanings, example
// words) stays in English — see credits.meaningsLanguageNote below, shown on
// the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const fr: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Accueil',
    browse: 'Parcourir',
    practice: 'Entraînement',
    progress: 'Progression',
    credits: 'Crédits',
  },

  language: {
    label: 'Langue',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Jamais vu', 1: 'Vu', 2: 'En cours', 3: 'Maîtrisé' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Apprenez l’ordre des traits, les lectures et le vocabulaire japonais.',
    continuePractice: 'Reprendre l’entraînement',
    startPracticing: 'Commencer l’entraînement',
    todaysReview: 'Révision du jour',
    noReview: 'Rien à réviser pour l’instant — entraînez-vous sur une série pour commencer.',
    statsHeading: 'Votre progression',
    masteredOf: (mastered, total) => `${mastered} / ${total} caractères maîtrisés`,
    androidApp: {
      heading: 'Obtenir l’application Android',
      description:
        'Vous préférez une application native ? Téléchargez l’APK de KANAKANJI et installez-le directement sur votre appareil Android.',
      downloadButton: 'Télécharger l’APK (~7,8 Mo)',
      unknownSourceNote:
        'Cet APK n’est pas distribué via le Play Store : Android vous demandera donc d’autoriser l’installation depuis cette source — c’est normal.',
      pwaAlternative:
        'Vous préférez ne rien installer ? Cette application web fonctionne aussi entièrement hors ligne et peut être ajoutée à l’écran d’accueil depuis le menu de votre navigateur.',
    },
    iosApp: {
      heading: 'Ajouter à l’écran d’accueil (iPhone/iPad)',
      description:
        'Sur iPhone ou iPad, installez KANAKANJI comme application en trois étapes — elle fonctionne entièrement hors ligne.',
      step1: 'Ouvrez ce site dans Safari',
      step2: 'Appuyez sur le bouton Partager',
      step3: 'Appuyez sur « Sur l’écran d’accueil »',
    },
    share: {
      heading: 'Partager KANAKANJI',
      description: 'Montrez ce code QR à un ami pour qu’il puisse le scanner et essayer KANAKANJI aussi.',
      qrAlt: 'Code QR renvoyant vers l’application web KANAKANJI',
    },
  },

  browse: {
    title: 'Parcourir les caractères',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Rechercher par caractère, lecture ou sens',
    searchResultsFor: (query) => `Résultats pour « ${query} »`,
    noSearchResults: 'Aucun caractère ne correspond à votre recherche.',
    allGrades: 'Toutes les années',
    allJlpt: 'Tous les niveaux JLPT',
    sortByStrokeCount: 'Trier par nombre de traits',
    gradeFilterLabel: 'Année',
    jlptFilterLabel: 'JLPT (ancienne échelle)',
    resultCount: (n) => `${n} caractères`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Sens',
    examples: 'Exemples',
    strokeCount: 'Traits',
    grade: 'Année',
    jlpt: 'JLPT (ancienne échelle)',
    noExamples: 'Aucun mot d’exemple disponible.',
    loading: 'Chargement…',
    loadError: 'Impossible de charger ce caractère.',
    practiceThis: 'S’entraîner sur ce caractère',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `Année ${grade}`),
  },

  strokeAnimator: {
    play: 'Lecture',
    pause: 'Pause',
    loop: 'Boucle',
    speed: 'Vitesse',
    showNumbers: 'Afficher les numéros',
    showGrid: 'Afficher le quadrillage',
  },

  practice: {
    title: 'Entraînement',
    reviewTitle: 'Révision du jour',
    chooseSet: 'Choisissez une série d’entraînement',
    backToSets: 'Choisir une autre série',
    showOutline: 'Afficher le contour',
    progressLabel: (index, total) => `Caractère ${index} sur ${total}`,
    mistakes: 'Erreurs',
    setComplete: 'Série terminée !',
    setCompleteBody: 'Bravo — vous avez tracé tous les caractères de cette série.',
    practiceAgain: 'Recommencer',
    nextCharacter: 'Caractère suivant',
    reviewEmptyTitle: 'Rien à réviser pour le moment',
    reviewEmptyBody:
      'Les caractères apparaissent ici une fois que vous les avez vus ou travaillés, tant qu’ils ne sont pas encore maîtrisés.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji de 1re année (80)',
      grade2: 'Kanji de 2e année (160)',
      grade3: 'Kanji de 3e année (200)',
      grade4: 'Kanji de 4e année (202)',
      grade5: 'Kanji de 5e année (193)',
      grade6: 'Kanji de 6e année (191)',
      grade8: 'Autres kanji jōyō (1 110)',
    },
  },

  progress: {
    title: 'Progression',
    subtitle: 'Votre maîtrise de chaque série de caractères.',
    overallHeading: 'Vue d’ensemble',
    overallMastered: (mastered, total) => `${mastered} / ${total} caractères maîtrisés`,
    masteryRate: (rate) => `${rate} %`,
    totalAttempts: (n) =>
      n === 1
        ? '1 tentative d’entraînement enregistrée'
        : `${n} tentatives d’entraînement enregistrées`,
    lastPracticed: (date) => `Dernier entraînement : ${date}`,
    neverPracticed: 'Aucune tentative d’entraînement pour l’instant',
    categoriesHeading: 'Par catégorie',
    legendMastered: 'Maîtrisé',
    legendPracticing: 'En cours',
    legendNotStarted: 'Pas commencé',
    categoryCount: (n) => `${n} caractères`,
    reviewDueToday: (n) =>
      n === 0
        ? 'Rien à réviser aujourd’hui'
        : n === 1
          ? '1 caractère à réviser aujourd’hui'
          : `${n} caractères à réviser aujourd’hui`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `${mastered} maîtrisés, ${practicing} en cours, ${notStarted} pas commencés, sur ${total}`,
  },

  notFound: {
    title: 'Page introuvable',
    body: 'La page que vous cherchez n’existe pas.',
    backHome: 'Retour à l’accueil',
  },

  credits: {
    title: 'Crédits',
    intro:
      'KANAKANJI s’appuie sur les données ouvertes et bibliothèques suivantes. Le texte complet des licences est accessible via les liens ci-dessous.',
    appLicenseHeading: 'Cette application',
    appLicenseNote:
      'Le code source de KANAKANJI n’est pas publié sous une licence open source distincte pour le moment. Les données ouvertes et bibliothèques listées ci-dessus restent soumises à leurs licences d’origine (liens ci-dessous).',
    meaningsLanguageNote:
      'Les sens des caractères proviennent de KANJIDIC2/JMdict et s’affichent en anglais, quelle que soit la langue choisie pour l’application.',
    entries: {
      animCjk:
        'SVG d’ordre des traits d’origine, convertis (via data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) en données de traits « pinceau » pour les 92 hiragana et katakana.',
      hanziWriterDataJp:
        'Données d’ordre des traits pour les 2 136 kanji jōyō. Extraites à l’origine de polices publiées par Arphic Technology.',
      kanjidic2:
        'Données de lectures, de sens, d’année scolaire et de JLPT (ancienne échelle) des kanji.',
      jmdict:
        'Vocabulaire d’exemple (mot, lecture, sens) affiché sur la page de détail de chaque kanji.',
      hanziWriter:
        'Moteur d’animation de l’ordre des traits et de quiz de traçage utilisé dans toute l’application.',
    },
  },
}
