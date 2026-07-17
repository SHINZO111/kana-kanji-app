// Vietnamese (vi) UI dictionary. Learning content (readings, meanings,
// example words) stays in English — see credits.meaningsLanguageNote below,
// shown on the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const vi: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Trang chủ',
    browse: 'Duyệt',
    practice: 'Luyện tập',
    progress: 'Tiến độ',
    credits: 'Ghi công',
  },

  language: {
    label: 'Ngôn ngữ',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Chưa học', 1: 'Đã xem', 2: 'Đang luyện', 3: 'Thành thạo' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Học thứ tự nét, cách đọc và từ vựng tiếng Nhật.',
    continuePractice: 'Tiếp tục luyện tập',
    startPracticing: 'Bắt đầu luyện tập',
    todaysReview: 'Ôn tập hôm nay',
    noReview: 'Chưa có gì để ôn — hãy luyện một bộ để bắt đầu.',
    statsHeading: 'Tiến độ của bạn',
    masteredOf: (mastered, total) => `Đã thành thạo ${mastered} / ${total} ký tự`,
    androidApp: {
      heading: 'Tải ứng dụng Android',
      description:
        'Thích dùng ứng dụng gốc? Hãy tải APK của KANAKANJI và cài trực tiếp lên thiết bị Android của bạn.',
      downloadButton: 'Tải APK (~7,8 MB)',
      unknownSourceNote:
        'APK này không được phân phối qua Play Store, nên Android sẽ yêu cầu bạn cho phép cài đặt ứng dụng từ nguồn này — điều đó là bình thường.',
      pwaAlternative:
        'Không muốn cài gì cả? Ứng dụng web này cũng hoạt động hoàn toàn ngoại tuyến và có thể được thêm vào màn hình chính từ menu trình duyệt.',
    },
    iosApp: {
      heading: 'Thêm vào Màn hình chính (iPhone/iPad)',
      description:
        'Trên iPhone hoặc iPad, hãy cài KANAKANJI như một ứng dụng chỉ trong ba bước — hoạt động hoàn toàn ngoại tuyến.',
      step1: 'Mở trang này trong Safari',
      step2: 'Nhấn vào nút Chia sẻ',
      step3: 'Nhấn "Thêm vào Màn hình chính"',
    },
    share: {
      heading: 'Chia sẻ KANAKANJI',
      description: 'Cho bạn bè xem mã QR này để họ quét và dùng thử KANAKANJI.',
      qrAlt: 'Mã QR dẫn đến ứng dụng web KANAKANJI',
    },
  },

  browse: {
    title: 'Duyệt ký tự',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Tìm theo ký tự, cách đọc hoặc nghĩa',
    searchResultsFor: (query) => `Kết quả cho "${query}"`,
    noSearchResults: 'Không có ký tự nào khớp với tìm kiếm.',
    allGrades: 'Tất cả các lớp',
    allJlpt: 'Tất cả cấp JLPT',
    sortByStrokeCount: 'Sắp xếp theo số nét',
    gradeFilterLabel: 'Lớp',
    jlptFilterLabel: 'JLPT (thang cũ)',
    resultCount: (n) => `${n} ký tự`,
  },

  detail: {
    onYomi: 'Âm on',
    kunYomi: 'Âm kun',
    meaning: 'Nghĩa',
    examples: 'Ví dụ',
    strokeCount: 'Số nét',
    grade: 'Lớp',
    jlpt: 'JLPT (thang cũ)',
    noExamples: 'Không có từ ví dụ.',
    loading: 'Đang tải…',
    loadError: 'Không tải được ký tự này.',
    practiceThis: 'Luyện ký tự này',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji thông dụng' : `Lớp ${grade}`),
  },

  strokeAnimator: {
    play: 'Phát',
    pause: 'Tạm dừng',
    loop: 'Lặp lại',
    speed: 'Tốc độ',
    showNumbers: 'Hiện số thứ tự',
    showGrid: 'Hiện ô lưới',
  },

  practice: {
    title: 'Luyện tập',
    reviewTitle: 'Ôn tập hôm nay',
    chooseSet: 'Chọn bộ luyện tập',
    backToSets: 'Chọn bộ khác',
    showOutline: 'Hiện nét mờ',
    progressLabel: (index, total) => `Ký tự ${index} / ${total}`,
    mistakes: 'Lỗi',
    setComplete: 'Hoàn thành bộ!',
    setCompleteBody: 'Tuyệt vời — bạn đã tô hết mọi ký tự trong bộ này.',
    practiceAgain: 'Luyện lại',
    nextCharacter: 'Ký tự tiếp theo',
    reviewEmptyTitle: 'Hiện chưa có gì để ôn',
    reviewEmptyBody:
      'Các ký tự bạn đã xem hoặc luyện nhưng chưa thành thạo sẽ xuất hiện ở đây.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji lớp 1 (80)',
      grade2: 'Kanji lớp 2 (160)',
      grade3: 'Kanji lớp 3 (200)',
      grade4: 'Kanji lớp 4 (202)',
      grade5: 'Kanji lớp 5 (193)',
      grade6: 'Kanji lớp 6 (191)',
      grade8: 'Kanji thông dụng khác (1.110)',
    },
  },

  progress: {
    title: 'Tiến độ',
    subtitle: 'Mức thành thạo của bạn theo từng bộ ký tự.',
    overallHeading: 'Tổng quan',
    overallMastered: (mastered, total) => `Đã thành thạo ${mastered} / ${total} ký tự`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `Đã ghi nhận ${n} lượt luyện`,
    lastPracticed: (date) => `Luyện lần cuối: ${date}`,
    neverPracticed: 'Chưa có lượt luyện nào',
    categoriesHeading: 'Theo danh mục',
    legendMastered: 'Thành thạo',
    legendPracticing: 'Đang luyện',
    legendNotStarted: 'Chưa bắt đầu',
    categoryCount: (n) => `${n} ký tự`,
    reviewDueToday: (n) =>
      n === 0 ? 'Hôm nay không có gì cần ôn' : `${n} ký tự cần ôn hôm nay`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `${mastered} thành thạo, ${practicing} đang luyện, ${notStarted} chưa bắt đầu, trên tổng ${total}`,
  },

  notFound: {
    title: 'Không tìm thấy trang',
    body: 'Trang bạn tìm không tồn tại.',
    backHome: 'Về trang chủ',
  },

  credits: {
    title: 'Ghi công',
    intro:
      'KANAKANJI sử dụng các nguồn dữ liệu mở và thư viện sau. Toàn văn giấy phép có tại các liên kết bên dưới.',
    appLicenseHeading: 'Ứng dụng này',
    appLicenseNote:
      'Mã nguồn của KANAKANJI hiện chưa được phát hành theo một giấy phép mã nguồn mở riêng. Các dữ liệu mở và thư viện nêu trên vẫn thuộc giấy phép gốc của chúng (liên kết bên dưới).',
    meaningsLanguageNote:
      'Nghĩa của ký tự được lấy từ KANJIDIC2/JMdict và luôn hiển thị bằng tiếng Anh, bất kể ngôn ngữ ứng dụng bạn chọn.',
    entries: {
      animCjk:
        'SVG thứ tự nét gốc, được chuyển đổi (qua data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) thành dữ liệu nét dạng bút lông cho 92 ký tự hiragana và katakana.',
      hanziWriterDataJp:
        'Dữ liệu thứ tự nét cho 2.136 kanji thông dụng. Ban đầu được trích xuất từ các phông chữ do Arphic Technology phát hành.',
      kanjidic2: 'Dữ liệu cách đọc, nghĩa, lớp học và JLPT (thang cũ) của kanji.',
      jmdict: 'Từ vựng ví dụ (từ, cách đọc, nghĩa) hiển thị trên trang chi tiết mỗi kanji.',
      hanziWriter: 'Bộ máy hoạt hình thứ tự nét và luyện tô chữ dùng trong toàn ứng dụng.',
    },
  },
}
