// Japanese (ja) UI dictionary. Learning content (readings, meanings, example
// words) stays in English — see credits.meaningsLanguageNote below, shown on
// the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const ja: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'ホーム',
    browse: '文字一覧',
    practice: '練習',
    progress: '学習記録',
    credits: 'クレジット',
  },

  language: {
    label: '言語',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: '未学習', 1: '閲覧済み', 2: '練習中', 3: '習得済み' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: '日本語の筆順・読み方・語彙を学ぼう。',
    continuePractice: '練習を続ける',
    startPracticing: '練習を始める',
    todaysReview: '今日の復習',
    noReview: 'まだ復習する文字がありません。まずはセットを練習してみましょう。',
    statsHeading: 'あなたの進捗',
    masteredOf: (mastered, total) => `${mastered} / ${total} 文字を習得`,
    androidApp: {
      heading: 'Androidアプリを入手',
      description:
        'ネイティブアプリ派の方は、KANAKANJIのAPKをダウンロードしてAndroid端末に直接インストールできます。',
      downloadButton: 'APKをダウンロード(約7.8MB)',
      unknownSourceNote:
        'このAPKはPlayストア外で配布されているため、インストール時に「提供元不明のアプリ」の許可を求められますが、正常な動作です。',
      pwaAlternative:
        'インストール不要派の方へ:このWebアプリ自体も完全オフラインで動作し、ブラウザのメニューからホーム画面に追加できます。',
      sha256Label: 'SHA-256(整合性検証用)',
      copyButton: 'コピー',
      copiedLabel: 'コピーしました',
    },
    iosApp: {
      heading: 'ホーム画面に追加(iPhone/iPad)',
      description:
        'iPhoneやiPadでは、3ステップでKANAKANJIをアプリのようにホーム画面へ追加できます。完全オフラインで動作します。',
      step1: 'Safariでこのサイトを開く',
      step2: '共有ボタンをタップ',
      step3: '「ホーム画面に追加」をタップ',
    },
    share: {
      heading: 'KANAKANJIをシェア',
      description: 'このQRコードを友だちに見せてスキャンしてもらい、KANAKANJIを試してもらいましょう。',
      qrAlt: 'KANAKANJIのWebアプリにつながるQRコード',
    },
  },

  browse: {
    title: '文字をさがす',
    tabHiragana: 'ひらがな',
    tabKatakana: 'カタカナ',
    tabKanji: '漢字',
    searchPlaceholder: '文字・読み・意味で検索',
    searchResultsFor: (query) => `「${query}」の検索結果`,
    noSearchResults: '該当する文字が見つかりませんでした。',
    allGrades: 'すべての学年',
    allJlpt: 'すべてのJLPTレベル',
    sortByStrokeCount: '画数順に並べ替え',
    gradeFilterLabel: '学年',
    jlptFilterLabel: 'JLPT(旧基準)',
    resultCount: (n) => `${n}文字`,
  },

  detail: {
    onYomi: '音読み',
    kunYomi: '訓読み',
    meaning: '意味',
    examples: '例語',
    strokeCount: '画数',
    grade: '学年',
    jlpt: 'JLPT(旧基準)',
    noExamples: '例語がありません。',
    loading: '読み込み中…',
    loadError: 'この文字を読み込めませんでした。',
    practiceThis: 'この文字を練習する',
    gradeLabel: (grade) => (grade === 8 ? '常用漢字' : `小学${grade}年生`),
  },

  strokeAnimator: {
    play: '再生',
    pause: '一時停止',
    loop: 'ループ',
    speed: '速さ',
    showNumbers: '番号を表示',
    showGrid: '方眼を表示',
  },

  practice: {
    title: '練習',
    reviewTitle: '今日の復習',
    chooseSet: '練習セットを選ぶ',
    backToSets: '別のセットを選ぶ',
    showOutline: 'なぞり線を表示',
    progressLabel: (index, total) => `${total}文字中 ${index}文字目`,
    mistakes: 'ミス',
    setComplete: 'セット完了!',
    setCompleteBody: 'おつかれさま — このセットの文字をすべてなぞり終えました。',
    practiceAgain: 'もう一度練習',
    nextCharacter: '次の文字',
    reviewEmptyTitle: '今は復習する文字がありません',
    reviewEmptyBody: '閲覧・練習したもののまだ習得していない文字が、ここに表示されます。',
    sets: {
      hiragana: 'ひらがな(46)',
      katakana: 'カタカナ(46)',
      grade1: '小1漢字(80)',
      grade2: '小2漢字(160)',
      grade3: '小3漢字(200)',
      grade4: '小4漢字(202)',
      grade5: '小5漢字(193)',
      grade6: '小6漢字(191)',
      grade8: 'その他の常用漢字(1,110)',
    },
  },

  progress: {
    title: '学習記録',
    subtitle: '文字セットごとの習得状況。',
    overallHeading: '全体',
    overallMastered: (mastered, total) => `${mastered} / ${total} 文字を習得`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `練習回数 ${n}回`,
    lastPracticed: (date) => `最終練習日: ${date}`,
    neverPracticed: 'まだ練習していません',
    categoriesHeading: 'カテゴリ別',
    legendMastered: '習得済み',
    legendPracticing: '練習中',
    legendNotStarted: '未学習',
    categoryCount: (n) => `${n}文字`,
    reviewDueToday: (n) => (n === 0 ? '今日の復習はありません' : `今日の復習対象は${n}文字`),
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `全${total}文字中、習得済み${mastered}・練習中${practicing}・未学習${notStarted}`,
  },

  notFound: {
    title: 'ページが見つかりません',
    body: 'お探しのページは存在しません。',
    backHome: 'ホームに戻る',
  },

  credits: {
    title: 'クレジット',
    intro:
      'KANAKANJIは以下のオープンデータとライブラリを利用しています。ライセンス全文は各リンク先をご覧ください。',
    appLicenseHeading: 'このアプリについて',
    appLicenseNote:
      'KANAKANJI自体のソースコードは、現時点では個別のオープンソースライセンスでは公開していません。上記のオープンデータとライブラリは、それぞれ元のライセンス(下記リンク)の下で提供されています。',
    meaningsLanguageNote:
      '文字の意味はKANJIDIC2/JMdict由来のため、アプリの表示言語にかかわらず英語で表示されます。',
    entries: {
      animCjk:
        '筆順の元データSVG。data-pipeline/lib/animcjk-kana-to-hanziwriter.mjsで変換し、ひらがな・カタカナ92文字の筆形ストロークデータとして使用しています。',
      hanziWriterDataJp:
        '常用漢字2,136字の筆順データ。元はArphic Technologyが公開したフォントから抽出されたものです。',
      kanjidic2: '漢字の読み・意味・学年・JLPT(旧基準)のデータ。',
      jmdict: '各漢字の詳細ページに表示される例語(単語・読み・意味)。',
      hanziWriter: 'アプリ全体で使用している筆順アニメーション・なぞり書きクイズのエンジン。',
    },
  },
}
