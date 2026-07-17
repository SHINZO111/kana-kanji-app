// Spanish (es) UI dictionary. Learning content (readings, meanings, example
// words) stays in English — see credits.meaningsLanguageNote below, shown
// on the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const es: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Inicio',
    browse: 'Explorar',
    practice: 'Practicar',
    progress: 'Progreso',
    credits: 'Créditos',
  },

  language: {
    label: 'Idioma',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Sin ver', 1: 'Visto', 2: 'Practicando', 3: 'Dominado' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Aprende el orden de trazos, las lecturas y el vocabulario del japonés.',
    continuePractice: 'Seguir practicando',
    startPracticing: 'Empezar a practicar',
    todaysReview: 'Repaso de hoy',
    noReview: 'Nada que repasar todavía — practica un conjunto para empezar.',
    statsHeading: 'Tu progreso',
    masteredOf: (mastered, total) => `${mastered} / ${total} caracteres dominados`,
    androidApp: {
      heading: 'Obtén la app de Android',
      description:
        '¿Prefieres una app nativa? Descarga el APK de KANAKANJI e instálalo directamente en tu dispositivo Android.',
      downloadButton: 'Descargar APK (~7.8 MB)',
      unknownSourceNote:
        'Este APK no se distribuye a través de la Play Store, así que Android te pedirá permitir instalar desde este origen — es normal.',
      pwaAlternative:
        '¿Prefieres no instalar nada? Esta app web también funciona sin conexión y puedes añadirla a la pantalla de inicio desde el menú de tu navegador.',
    },
    iosApp: {
      heading: 'Añadir a la pantalla de inicio (iPhone/iPad)',
      description:
        'En iPhone o iPad, instala KANAKANJI como app en tres pasos — funciona totalmente sin conexión.',
      step1: 'Abre este sitio en Safari',
      step2: 'Toca el botón Compartir',
      step3: 'Toca "Añadir a pantalla de inicio"',
    },
  },

  browse: {
    title: 'Explorar caracteres',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Busca por carácter, lectura o significado',
    searchResultsFor: (query) => `Resultados para "${query}"`,
    noSearchResults: 'Ningún carácter coincide con tu búsqueda.',
    allGrades: 'Todos los grados',
    allJlpt: 'Todos los niveles de JLPT',
    sortByStrokeCount: 'Ordenar por número de trazos',
    gradeFilterLabel: 'Grado',
    jlptFilterLabel: 'JLPT (escala antigua)',
    resultCount: (n) => `${n} caracteres`,
  },

  detail: {
    onYomi: 'Lectura on',
    kunYomi: 'Lectura kun',
    meaning: 'Significado',
    examples: 'Ejemplos',
    strokeCount: 'Trazos',
    grade: 'Grado',
    jlpt: 'JLPT (escala antigua)',
    noExamples: 'No hay palabras de ejemplo disponibles.',
    loading: 'Cargando…',
    loadError: 'No se pudo cargar este carácter.',
    practiceThis: 'Practicar este carácter',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `Grado ${grade}`),
  },

  strokeAnimator: {
    play: 'Reproducir',
    pause: 'Pausar',
    loop: 'Repetir',
    speed: 'Velocidad',
    showNumbers: 'Mostrar números',
    showGrid: 'Mostrar cuadrícula',
  },

  practice: {
    title: 'Practicar',
    reviewTitle: 'Repaso de hoy',
    chooseSet: 'Elige un conjunto de práctica',
    backToSets: 'Elegir otro conjunto',
    showOutline: 'Mostrar contorno',
    progressLabel: (index, total) => `Carácter ${index} de ${total}`,
    mistakes: 'Errores',
    setComplete: '¡Conjunto completado!',
    setCompleteBody: 'Buen trabajo — trazaste todos los caracteres de este conjunto.',
    practiceAgain: 'Practicar de nuevo',
    nextCharacter: 'Siguiente carácter',
    reviewEmptyTitle: 'No hay nada que repasar ahora',
    reviewEmptyBody:
      'Los caracteres aparecen aquí después de que los hayas visto o practicado, pero todavía no los domines.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji de 1.º grado (80)',
      grade2: 'Kanji de 2.º grado (160)',
      grade3: 'Kanji de 3.º grado (200)',
      grade4: 'Kanji de 4.º grado (202)',
      grade5: 'Kanji de 5.º grado (193)',
      grade6: 'Kanji de 6.º grado (191)',
      grade8: 'Otros kanji jōyō (1110)',
    },
  },

  progress: {
    title: 'Progreso',
    subtitle: 'Tu dominio en cada conjunto de caracteres.',
    overallHeading: 'General',
    overallMastered: (mastered, total) => `${mastered} / ${total} caracteres dominados`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) =>
      n === 1 ? '1 intento de práctica registrado' : `${n} intentos de práctica registrados`,
    lastPracticed: (date) => `Última práctica: ${date}`,
    neverPracticed: 'Todavía no hay intentos de práctica',
    categoriesHeading: 'Por categoría',
    legendMastered: 'Dominado',
    legendPracticing: 'Practicando',
    legendNotStarted: 'Sin empezar',
    categoryCount: (n) => `${n} caracteres`,
    reviewDueToday: (n) =>
      n === 0
        ? 'No hay nada pendiente de repaso hoy'
        : n === 1
          ? '1 carácter pendiente de repaso hoy'
          : `${n} caracteres pendientes de repaso hoy`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `${mastered} dominados, ${practicing} en práctica, ${notStarted} sin empezar, de un total de ${total}`,
  },

  credits: {
    title: 'Créditos',
    intro:
      'KANAKANJI se basa en los siguientes datos y bibliotecas abiertos. Los textos completos de las licencias están enlazados a continuación.',
    appLicenseHeading: 'Esta aplicación',
    appLicenseNote:
      'El código fuente propio de KANAKANJI no está publicado bajo una licencia de código abierto independiente por el momento. Los datos y bibliotecas abiertos mencionados arriba siguen sujetos a sus licencias originales (enlazadas abajo).',
    meaningsLanguageNote:
      'Los significados de los caracteres provienen de KANJIDIC2/JMdict y se muestran en inglés sin importar el idioma que elijas para la aplicación.',
    entries: {
      animCjk:
        'SVGs de orden de trazos originales, convertidos (mediante data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) en datos de trazos con forma de pincel para los 92 caracteres de hiragana y katakana.',
      hanziWriterDataJp:
        'Datos de orden de trazos para los 2136 kanji jōyō. Extraídos originalmente de tipografías publicadas por Arphic Technology.',
      kanjidic2: 'Lecturas, significados, grado escolar y datos de JLPT (escala antigua) de los kanji.',
      jmdict: 'Vocabulario de ejemplo (palabra, lectura, significado) que se muestra en cada página de detalle de kanji.',
      hanziWriter: 'Motor de animación de orden de trazos y de práctica guiada usado en toda la aplicación.',
    },
  },

  notFound: {
    title: 'Página no encontrada',
    body: 'La página que buscas no existe.',
    backHome: 'Volver al inicio',
  },
}
