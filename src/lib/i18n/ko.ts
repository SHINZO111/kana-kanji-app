// Korean (ko) UI dictionary. Learning content (readings, meanings, example
// words) stays in English — see credits.meaningsLanguageNote below, shown on
// the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const ko: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: '홈',
    browse: '둘러보기',
    practice: '연습',
    progress: '진도',
    credits: '크레딧',
  },

  language: {
    label: '언어',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: '학습 전', 1: '살펴봄', 2: '연습 중', 3: '마스터' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: '일본어의 필순, 읽는 법, 어휘를 배워 보세요.',
    continuePractice: '연습 이어서 하기',
    startPracticing: '연습 시작하기',
    todaysReview: '오늘의 복습',
    noReview: '아직 복습할 문자가 없어요. 먼저 세트를 하나 연습해 보세요.',
    statsHeading: '내 진도',
    masteredOf: (mastered, total) => `${mastered} / ${total}자 마스터`,
    androidApp: {
      heading: 'Android 앱 받기',
      description:
        '네이티브 앱을 선호하시나요? KANAKANJI APK를 내려받아 Android 기기에 바로 설치할 수 있습니다.',
      downloadButton: 'APK 다운로드 (약 7.8MB)',
      unknownSourceNote:
        '이 APK는 Play 스토어 밖에서 배포되므로, 설치할 때 Android가 이 출처의 앱 설치를 허용해 달라고 요청합니다. 정상적인 과정입니다.',
      pwaAlternative:
        '설치 없이 쓰고 싶다면? 이 웹 앱 자체도 완전한 오프라인 사용을 지원하며, 브라우저 메뉴에서 홈 화면에 추가할 수 있습니다.',
      sha256Label: 'SHA-256 (다운로드 무결성 검증용)',
      copyButton: '복사',
      copiedLabel: '복사됨!',
    },
    iosApp: {
      heading: '홈 화면에 추가 (iPhone/iPad)',
      description: 'iPhone이나 iPad에서는 세 단계로 KANAKANJI를 앱처럼 설치할 수 있어요. 완전한 오프라인으로 동작합니다.',
      step1: 'Safari에서 이 사이트를 엽니다',
      step2: '공유 버튼을 탭합니다',
      step3: '"홈 화면에 추가"를 탭합니다',
    },
    share: {
      heading: 'KANAKANJI 공유하기',
      description: '이 QR 코드를 친구에게 보여주고 스캔해서 KANAKANJI를 함께 사용해 보세요.',
      qrAlt: 'KANAKANJI 웹 앱으로 연결되는 QR 코드',
    },
  },

  browse: {
    title: '문자 둘러보기',
    tabHiragana: '히라가나',
    tabKatakana: '가타카나',
    tabKanji: '한자',
    searchPlaceholder: '문자, 읽는 법, 뜻으로 검색',
    searchResultsFor: (query) => `"${query}" 검색 결과`,
    noSearchResults: '일치하는 문자가 없습니다.',
    allGrades: '모든 학년',
    allJlpt: '모든 JLPT 레벨',
    sortByStrokeCount: '획수순 정렬',
    gradeFilterLabel: '학년',
    jlptFilterLabel: 'JLPT (구 기준)',
    resultCount: (n) => `${n}자`,
  },

  detail: {
    onYomi: '음독',
    kunYomi: '훈독',
    meaning: '뜻',
    examples: '예시 단어',
    strokeCount: '획수',
    grade: '학년',
    jlpt: 'JLPT (구 기준)',
    noExamples: '예시 단어가 없습니다.',
    loading: '불러오는 중…',
    loadError: '이 문자를 불러오지 못했습니다.',
    practiceThis: '이 문자 연습하기',
    gradeLabel: (grade) => (grade === 8 ? '상용한자' : `초등 ${grade}학년`),
  },

  strokeAnimator: {
    play: '재생',
    pause: '일시정지',
    loop: '반복',
    speed: '속도',
    showNumbers: '번호 표시',
    showGrid: '모눈 표시',
  },

  practice: {
    title: '연습',
    reviewTitle: '오늘의 복습',
    chooseSet: '연습 세트 선택',
    backToSets: '다른 세트 선택',
    showOutline: '윤곽선 표시',
    progressLabel: (index, total) => `${total}자 중 ${index}번째`,
    mistakes: '실수',
    setComplete: '세트 완료!',
    setCompleteBody: '수고했어요 — 이 세트의 모든 문자를 따라 썼습니다.',
    practiceAgain: '다시 연습하기',
    nextCharacter: '다음 문자',
    reviewEmptyTitle: '지금은 복습할 문자가 없어요',
    reviewEmptyBody: '보거나 연습했지만 아직 마스터하지 못한 문자가 여기에 표시됩니다.',
    sets: {
      hiragana: '히라가나 (46)',
      katakana: '가타카나 (46)',
      grade1: '초등 1학년 한자 (80)',
      grade2: '초등 2학년 한자 (160)',
      grade3: '초등 3학년 한자 (200)',
      grade4: '초등 4학년 한자 (202)',
      grade5: '초등 5학년 한자 (193)',
      grade6: '초등 6학년 한자 (191)',
      grade8: '기타 상용한자 (1,110)',
    },
  },

  progress: {
    title: '진도',
    subtitle: '문자 세트별 학습 현황입니다.',
    overallHeading: '전체',
    overallMastered: (mastered, total) => `${mastered} / ${total}자 마스터`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `연습 기록 ${n}회`,
    lastPracticed: (date) => `마지막 연습: ${date}`,
    neverPracticed: '아직 연습 기록이 없습니다',
    categoriesHeading: '카테고리별',
    legendMastered: '마스터',
    legendPracticing: '연습 중',
    legendNotStarted: '학습 전',
    categoryCount: (n) => `${n}자`,
    reviewDueToday: (n) =>
      n === 0 ? '오늘 복습할 문자가 없습니다' : `오늘 복습할 문자 ${n}자`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `전체 ${total}자 중 마스터 ${mastered}, 연습 중 ${practicing}, 학습 전 ${notStarted}`,
  },

  notFound: {
    title: '페이지를 찾을 수 없습니다',
    body: '찾으시는 페이지가 존재하지 않습니다.',
    backHome: '홈으로 돌아가기',
  },

  credits: {
    title: '크레딧',
    intro:
      'KANAKANJI는 다음 오픈 데이터와 라이브러리를 사용합니다. 라이선스 전문은 아래 링크에서 확인할 수 있습니다.',
    appLicenseHeading: '이 앱',
    appLicenseNote:
      'KANAKANJI 자체의 소스 코드는 현재 별도의 오픈소스 라이선스로 공개되어 있지 않습니다. 위에 나열된 오픈 데이터와 라이브러리는 각자의 원래 라이선스(아래 링크)를 따릅니다.',
    meaningsLanguageNote:
      '문자의 뜻은 KANJIDIC2/JMdict에서 가져오므로, 선택한 앱 언어와 관계없이 영어로 표시됩니다.',
    entries: {
      animCjk:
        '필순의 원본 SVG 데이터. data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs로 변환해 히라가나·가타카나 92자의 붓 모양 획 데이터로 사용합니다.',
      hanziWriterDataJp:
        '상용한자 2,136자의 필순 데이터. 원래 Arphic Technology가 공개한 폰트에서 추출된 것입니다.',
      kanjidic2: '한자의 읽는 법, 뜻, 학년, JLPT(구 기준) 데이터.',
      jmdict: '각 한자 상세 페이지에 표시되는 예시 단어(단어·읽기·뜻).',
      hanziWriter: '앱 전반에서 사용하는 필순 애니메이션·따라 쓰기 퀴즈 엔진.',
    },
  },
}
