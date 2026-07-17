// Portuguese (pt, Brazilian-leaning) UI dictionary. Learning content
// (readings, meanings, example words) stays in English — see
// credits.meaningsLanguageNote below, shown on the Credits page. See
// types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const pt: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Início',
    browse: 'Explorar',
    practice: 'Praticar',
    progress: 'Progresso',
    credits: 'Créditos',
  },

  language: {
    label: 'Idioma',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Não visto', 1: 'Visto', 2: 'Praticando', 3: 'Dominado' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Aprenda a ordem dos traços, as leituras e o vocabulário do japonês.',
    continuePractice: 'Continuar praticando',
    startPracticing: 'Começar a praticar',
    todaysReview: 'Revisão de hoje',
    noReview: 'Nada para revisar ainda — pratique um conjunto para começar.',
    statsHeading: 'Seu progresso',
    masteredOf: (mastered, total) => `${mastered} / ${total} caracteres dominados`,
    androidApp: {
      heading: 'Baixe o app para Android',
      description:
        'Prefere um app nativo? Baixe o APK do KANAKANJI e instale diretamente no seu dispositivo Android.',
      downloadButton: 'Baixar APK (~7,8 MB)',
      unknownSourceNote:
        'Este APK não é distribuído pela Play Store, então o Android vai pedir permissão para instalar apps desta origem — isso é esperado.',
      pwaAlternative:
        'Prefere não instalar nada? Este app web também funciona totalmente offline e pode ser adicionado à tela inicial pelo menu do navegador.',
    },
    iosApp: {
      heading: 'Adicionar à Tela de Início (iPhone/iPad)',
      description:
        'No iPhone ou iPad, instale o KANAKANJI como um app em três passos — funciona totalmente offline.',
      step1: 'Abra este site no Safari',
      step2: 'Toque no botão Compartilhar',
      step3: 'Toque em "Adicionar à Tela de Início"',
    },
    share: {
      heading: 'Compartilhar o KANAKANJI',
      description: 'Mostre este código QR para um amigo escanear e experimentar o KANAKANJI também.',
      qrAlt: 'Código QR que leva ao app web do KANAKANJI',
    },
  },

  browse: {
    title: 'Explorar caracteres',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Busque por caractere, leitura ou significado',
    searchResultsFor: (query) => `Resultados para "${query}"`,
    noSearchResults: 'Nenhum caractere corresponde à sua busca.',
    allGrades: 'Todas as séries',
    allJlpt: 'Todos os níveis JLPT',
    sortByStrokeCount: 'Ordenar por número de traços',
    gradeFilterLabel: 'Série',
    jlptFilterLabel: 'JLPT (escala antiga)',
    resultCount: (n) => `${n} caracteres`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Significado',
    examples: 'Exemplos',
    strokeCount: 'Traços',
    grade: 'Série',
    jlpt: 'JLPT (escala antiga)',
    noExamples: 'Nenhuma palavra de exemplo disponível.',
    loading: 'Carregando…',
    loadError: 'Não foi possível carregar este caractere.',
    practiceThis: 'Praticar este caractere',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `${grade}ª série`),
  },

  strokeAnimator: {
    play: 'Reproduzir',
    pause: 'Pausar',
    loop: 'Repetir',
    speed: 'Velocidade',
    showNumbers: 'Mostrar números',
    showGrid: 'Mostrar grade',
  },

  practice: {
    title: 'Praticar',
    reviewTitle: 'Revisão de hoje',
    chooseSet: 'Escolha um conjunto de prática',
    backToSets: 'Escolher outro conjunto',
    showOutline: 'Mostrar contorno',
    progressLabel: (index, total) => `Caractere ${index} de ${total}`,
    mistakes: 'Erros',
    setComplete: 'Conjunto concluído!',
    setCompleteBody: 'Ótimo trabalho — você traçou todos os caracteres deste conjunto.',
    practiceAgain: 'Praticar de novo',
    nextCharacter: 'Próximo caractere',
    reviewEmptyTitle: 'Nada para revisar agora',
    reviewEmptyBody:
      'Os caracteres aparecem aqui depois que você os viu ou praticou, mas ainda não os dominou.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji da 1ª série (80)',
      grade2: 'Kanji da 2ª série (160)',
      grade3: 'Kanji da 3ª série (200)',
      grade4: 'Kanji da 4ª série (202)',
      grade5: 'Kanji da 5ª série (193)',
      grade6: 'Kanji da 6ª série (191)',
      grade8: 'Outros kanji jōyō (1.110)',
    },
  },

  progress: {
    title: 'Progresso',
    subtitle: 'Seu domínio em cada conjunto de caracteres.',
    overallHeading: 'Geral',
    overallMastered: (mastered, total) => `${mastered} / ${total} caracteres dominados`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) =>
      n === 1 ? '1 tentativa de prática registrada' : `${n} tentativas de prática registradas`,
    lastPracticed: (date) => `Última prática: ${date}`,
    neverPracticed: 'Nenhuma tentativa de prática ainda',
    categoriesHeading: 'Por categoria',
    legendMastered: 'Dominado',
    legendPracticing: 'Praticando',
    legendNotStarted: 'Não iniciado',
    categoryCount: (n) => `${n} caracteres`,
    reviewDueToday: (n) =>
      n === 0
        ? 'Nada para revisar hoje'
        : n === 1
          ? '1 caractere para revisar hoje'
          : `${n} caracteres para revisar hoje`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `${mastered} dominados, ${practicing} em prática, ${notStarted} não iniciados, de um total de ${total}`,
  },

  notFound: {
    title: 'Página não encontrada',
    body: 'A página que você procura não existe.',
    backHome: 'Voltar ao início',
  },

  credits: {
    title: 'Créditos',
    intro:
      'O KANAKANJI usa os seguintes dados abertos e bibliotecas. Os textos completos das licenças estão nos links abaixo.',
    appLicenseHeading: 'Este app',
    appLicenseNote:
      'O código-fonte do próprio KANAKANJI ainda não é publicado sob uma licença de código aberto própria. Os dados abertos e as bibliotecas listados acima permanecem sob suas licenças originais (links abaixo).',
    meaningsLanguageNote:
      'Os significados dos caracteres vêm do KANJIDIC2/JMdict e são exibidos em inglês, independentemente do idioma escolhido no app.',
    entries: {
      animCjk:
        'SVGs de ordem dos traços originais, convertidos (via data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) em dados de traços com formato de pincel para os 92 caracteres de hiragana e katakana.',
      hanziWriterDataJp:
        'Dados de ordem dos traços para os 2.136 kanji jōyō. Originalmente extraídos de fontes lançadas pela Arphic Technology.',
      kanjidic2: 'Dados de leituras, significados, série escolar e JLPT (escala antiga) dos kanji.',
      jmdict:
        'Vocabulário de exemplo (palavra, leitura, significado) exibido na página de detalhes de cada kanji.',
      hanziWriter: 'Motor de animação da ordem dos traços e de quiz de traçado usado em todo o app.',
    },
  },
}
