// Simplified Chinese (zh) UI dictionary. Learning content (readings,
// meanings, example words) stays in English — see
// credits.meaningsLanguageNote below, shown on the Credits page. See
// types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const zh: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: '首页',
    browse: '浏览',
    practice: '练习',
    progress: '进度',
    credits: '致谢',
  },

  language: {
    label: '语言',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: '未学习', 1: '已浏览', 2: '练习中', 3: '已掌握' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: '学习日语的笔顺、读音和词汇。',
    continuePractice: '继续练习',
    startPracticing: '开始练习',
    todaysReview: '今日复习',
    noReview: '暂无需要复习的内容——先练习一组文字吧。',
    statsHeading: '学习进度',
    masteredOf: (mastered, total) => `已掌握 ${mastered} / ${total} 个文字`,
    androidApp: {
      heading: '获取 Android 应用',
      description: '更喜欢原生应用？下载 KANAKANJI 的 APK 并直接安装到你的 Android 设备。',
      downloadButton: '下载 APK(约 7.8 MB)',
      unknownSourceNote: '此 APK 未通过 Play 商店分发,因此 Android 会提示你允许安装未知来源的应用——这是正常现象。',
      pwaAlternative: '不想安装应用？这个网页应用同样支持完整离线使用,并可以通过浏览器菜单添加到主屏幕。',
    },
    iosApp: {
      heading: '添加到主屏幕(iPhone/iPad)',
      description: '在 iPhone 或 iPad 上,只需三步即可将 KANAKANJI 安装为应用——完全支持离线使用。',
      step1: '在 Safari 中打开此网站',
      step2: '点击分享按钮',
      step3: '点击"添加到主屏幕"',
    },
    share: {
      heading: '分享 KANAKANJI',
      description: '把这个二维码给朋友看,让他们扫码也来试试 KANAKANJI。',
      qrAlt: '指向 KANAKANJI 网页应用的二维码',
    },
  },

  browse: {
    title: '浏览文字',
    tabHiragana: '平假名',
    tabKatakana: '片假名',
    tabKanji: '汉字',
    searchPlaceholder: '按文字、读音或含义搜索',
    searchResultsFor: (query) => `“${query}” 的搜索结果`,
    noSearchResults: '没有找到匹配的文字。',
    allGrades: '全部年级',
    allJlpt: '全部 JLPT 等级',
    sortByStrokeCount: '按笔画数排序',
    gradeFilterLabel: '年级',
    jlptFilterLabel: 'JLPT（旧标准）',
    resultCount: (n) => `共 ${n} 个文字`,
  },

  detail: {
    onYomi: '音读',
    kunYomi: '训读',
    meaning: '含义',
    examples: '例词',
    strokeCount: '笔画数',
    grade: '年级',
    jlpt: 'JLPT（旧标准）',
    noExamples: '暂无例词。',
    loading: '加载中…',
    loadError: '无法加载该文字。',
    practiceThis: '练习这个文字',
    gradeLabel: (grade) => (grade === 8 ? '常用汉字' : `小学${grade}年级`),
  },

  strokeAnimator: {
    play: '播放',
    pause: '暂停',
    loop: '循环',
    speed: '速度',
    showNumbers: '显示笔顺编号',
    showGrid: '显示方格',
  },

  practice: {
    title: '练习',
    reviewTitle: '今日复习',
    chooseSet: '选择练习组',
    backToSets: '选择其他练习组',
    showOutline: '显示轮廓',
    progressLabel: (index, total) => `第 ${index} / ${total} 个文字`,
    mistakes: '错误次数',
    setComplete: '练习组完成！',
    setCompleteBody: '做得好——你已经描摹了这一组中的所有文字。',
    practiceAgain: '再练一次',
    nextCharacter: '下一个文字',
    reviewEmptyTitle: '暂时没有需要复习的内容',
    reviewEmptyBody: '当你浏览或练习过某个文字、但还未完全掌握时，它会出现在这里。',
    sets: {
      hiragana: '平假名（46个）',
      katakana: '片假名（46个）',
      grade1: '小学1年级汉字（80个）',
      grade2: '小学2年级汉字（160个）',
      grade3: '小学3年级汉字（200个）',
      grade4: '小学4年级汉字（202个）',
      grade5: '小学5年级汉字（193个）',
      grade6: '小学6年级汉字（191个）',
      grade8: '其他常用汉字（1,110个）',
    },
  },

  progress: {
    title: '学习进度',
    subtitle: '你在每个文字组中的掌握情况。',
    overallHeading: '总体',
    overallMastered: (mastered, total) => `已掌握 ${mastered} / ${total} 个文字`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `累计练习 ${n} 次`,
    lastPracticed: (date) => `上次练习：${date}`,
    neverPracticed: '还没有练习记录',
    categoriesHeading: '按分类',
    legendMastered: '已掌握',
    legendPracticing: '练习中',
    legendNotStarted: '未开始',
    categoryCount: (n) => `共 ${n} 个文字`,
    reviewDueToday: (n) => (n === 0 ? '今天没有需要复习的内容' : `今天有 ${n} 个文字需要复习`),
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `已掌握 ${mastered} 个，练习中 ${practicing} 个，未开始 ${notStarted} 个，共 ${total} 个`,
  },

  credits: {
    title: '致谢',
    intro: 'KANAKANJI 使用了以下开放数据和开源库，完整许可证文本见下方链接。',
    appLicenseHeading: '本应用',
    appLicenseNote:
      'KANAKANJI 自身的源代码目前未采用独立的开源许可证发布。以上列出的开放数据与开源库仍遵循各自的原始许可证（见下方链接）。',
    meaningsLanguageNote: '文字含义数据来自 KANJIDIC2/JMdict，无论选择哪种应用语言，含义始终以英文显示。',
    entries: {
      animCjk:
        '原始笔顺 SVG 数据，经由 data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs 转换为 92 个平假名与片假名的笔形（非细线骨架）笔画数据。',
      hanziWriterDataJp: '2,136 个常用汉字的笔顺数据，最初提取自 Arphic Technology 发布的字体。',
      kanjidic2: '汉字的读音、含义、学年年级及 JLPT（旧标准）数据。',
      jmdict: '每个汉字详情页展示的例词（词语、读音、含义）数据来源。',
      hanziWriter: '贯穿全应用使用的笔顺动画与描摹练习引擎。',
    },
  },

  notFound: {
    title: '页面未找到',
    body: '你要找的页面不存在。',
    backHome: '返回首页',
  },
}
