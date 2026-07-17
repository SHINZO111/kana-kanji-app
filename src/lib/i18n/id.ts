// Indonesian (id) UI dictionary. Learning content (readings, meanings,
// example words) stays in English — see credits.meaningsLanguageNote below,
// shown on the Credits page. See types.ts for field documentation.

import type { Dictionary } from './types'
import { LANGUAGE_NATIVE_NAMES } from './language-names'

export const id: Dictionary = {
  appName: 'KANAKANJI',

  nav: {
    home: 'Beranda',
    browse: 'Jelajah',
    practice: 'Latihan',
    progress: 'Progres',
    credits: 'Kredit',
  },

  language: {
    label: 'Bahasa',
    names: LANGUAGE_NATIVE_NAMES,
  },

  mastery: {
    labels: { 0: 'Belum dilihat', 1: 'Sudah dilihat', 2: 'Sedang berlatih', 3: 'Dikuasai' },
  },

  home: {
    title: 'KANAKANJI',
    subtitle: 'Pelajari urutan goresan, cara baca, dan kosakata bahasa Jepang.',
    continuePractice: 'Lanjutkan latihan',
    startPracticing: 'Mulai latihan',
    todaysReview: 'Ulangan hari ini',
    noReview: 'Belum ada yang perlu diulang — latih satu set untuk memulai.',
    statsHeading: 'Progres kamu',
    masteredOf: (mastered, total) => `${mastered} / ${total} karakter dikuasai`,
    androidApp: {
      heading: 'Dapatkan aplikasi Android',
      description:
        'Lebih suka aplikasi native? Unduh APK KANAKANJI dan pasang langsung di perangkat Android kamu.',
      downloadButton: 'Unduh APK (~7,8 MB)',
      unknownSourceNote:
        'APK ini tidak didistribusikan lewat Play Store, jadi Android akan meminta izin untuk memasang aplikasi dari sumber ini — itu hal yang wajar.',
      pwaAlternative:
        'Tidak ingin memasang apa pun? Aplikasi web ini juga berfungsi penuh secara offline dan bisa ditambahkan ke layar utama lewat menu peramban.',
    },
    iosApp: {
      heading: 'Tambahkan ke Layar Utama (iPhone/iPad)',
      description:
        'Di iPhone atau iPad, pasang KANAKANJI sebagai aplikasi dalam tiga langkah — berfungsi penuh secara offline.',
      step1: 'Buka situs ini di Safari',
      step2: 'Ketuk tombol Bagikan',
      step3: 'Ketuk "Tambah ke Layar Utama"',
    },
    share: {
      heading: 'Bagikan KANAKANJI',
      description: 'Tunjukkan kode QR ini ke teman agar mereka bisa memindainya dan mencoba KANAKANJI juga.',
      qrAlt: 'Kode QR yang mengarah ke aplikasi web KANAKANJI',
    },
  },

  browse: {
    title: 'Jelajahi karakter',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana',
    tabKanji: 'Kanji',
    searchPlaceholder: 'Cari berdasarkan karakter, cara baca, atau arti',
    searchResultsFor: (query) => `Hasil untuk "${query}"`,
    noSearchResults: 'Tidak ada karakter yang cocok dengan pencarianmu.',
    allGrades: 'Semua kelas',
    allJlpt: 'Semua level JLPT',
    sortByStrokeCount: 'Urutkan berdasarkan jumlah goresan',
    gradeFilterLabel: 'Kelas',
    jlptFilterLabel: 'JLPT (skala lama)',
    resultCount: (n) => `${n} karakter`,
  },

  detail: {
    onYomi: 'On’yomi',
    kunYomi: 'Kun’yomi',
    meaning: 'Arti',
    examples: 'Contoh',
    strokeCount: 'Goresan',
    grade: 'Kelas',
    jlpt: 'JLPT (skala lama)',
    noExamples: 'Tidak ada contoh kata.',
    loading: 'Memuat…',
    loadError: 'Karakter ini tidak dapat dimuat.',
    practiceThis: 'Latih karakter ini',
    gradeLabel: (grade) => (grade === 8 ? 'Kanji jōyō' : `Kelas ${grade}`),
  },

  strokeAnimator: {
    play: 'Putar',
    pause: 'Jeda',
    loop: 'Ulang',
    speed: 'Kecepatan',
    showNumbers: 'Tampilkan nomor',
    showGrid: 'Tampilkan kisi',
  },

  practice: {
    title: 'Latihan',
    reviewTitle: 'Ulangan hari ini',
    chooseSet: 'Pilih set latihan',
    backToSets: 'Pilih set lain',
    showOutline: 'Tampilkan garis bantu',
    progressLabel: (index, total) => `Karakter ${index} dari ${total}`,
    mistakes: 'Kesalahan',
    setComplete: 'Set selesai!',
    setCompleteBody: 'Kerja bagus — kamu sudah menebalkan semua karakter di set ini.',
    practiceAgain: 'Latihan lagi',
    nextCharacter: 'Karakter berikutnya',
    reviewEmptyTitle: 'Belum ada yang perlu diulang sekarang',
    reviewEmptyBody:
      'Karakter muncul di sini setelah kamu melihat atau melatihnya tetapi belum menguasainya.',
    sets: {
      hiragana: 'Hiragana (46)',
      katakana: 'Katakana (46)',
      grade1: 'Kanji kelas 1 (80)',
      grade2: 'Kanji kelas 2 (160)',
      grade3: 'Kanji kelas 3 (200)',
      grade4: 'Kanji kelas 4 (202)',
      grade5: 'Kanji kelas 5 (193)',
      grade6: 'Kanji kelas 6 (191)',
      grade8: 'Kanji jōyō lainnya (1.110)',
    },
  },

  progress: {
    title: 'Progres',
    subtitle: 'Tingkat penguasaanmu di setiap set karakter.',
    overallHeading: 'Keseluruhan',
    overallMastered: (mastered, total) => `${mastered} / ${total} karakter dikuasai`,
    masteryRate: (rate) => `${rate}%`,
    totalAttempts: (n) => `${n} percobaan latihan tercatat`,
    lastPracticed: (date) => `Terakhir berlatih ${date}`,
    neverPracticed: 'Belum ada percobaan latihan',
    categoriesHeading: 'Per kategori',
    legendMastered: 'Dikuasai',
    legendPracticing: 'Sedang berlatih',
    legendNotStarted: 'Belum dimulai',
    categoryCount: (n) => `${n} karakter`,
    reviewDueToday: (n) =>
      n === 0
        ? 'Tidak ada yang perlu diulang hari ini'
        : `${n} karakter perlu diulang hari ini`,
    categoryBarLabel: (mastered, practicing, notStarted, total) =>
      `${mastered} dikuasai, ${practicing} sedang dilatih, ${notStarted} belum dimulai, dari total ${total}`,
  },

  notFound: {
    title: 'Halaman tidak ditemukan',
    body: 'Halaman yang kamu cari tidak ada.',
    backHome: 'Kembali ke beranda',
  },

  credits: {
    title: 'Kredit',
    intro:
      'KANAKANJI mengandalkan data terbuka dan pustaka berikut. Teks lisensi lengkap tersedia di tautan di bawah.',
    appLicenseHeading: 'Aplikasi ini',
    appLicenseNote:
      'Kode sumber KANAKANJI sendiri saat ini belum dirilis di bawah lisensi open-source tersendiri. Data terbuka dan pustaka yang tercantum di atas tetap berada di bawah lisensi aslinya (tautan di bawah).',
    meaningsLanguageNote:
      'Arti karakter bersumber dari KANJIDIC2/JMdict dan ditampilkan dalam bahasa Inggris, apa pun bahasa aplikasi yang kamu pilih.',
    entries: {
      animCjk:
        'SVG urutan goresan sumber, dikonversi (lewat data-pipeline/lib/animcjk-kana-to-hanziwriter.mjs) menjadi data goresan berbentuk kuas untuk 92 karakter hiragana dan katakana.',
      hanziWriterDataJp:
        'Data urutan goresan untuk 2.136 kanji jōyō. Awalnya diekstrak dari font yang dirilis oleh Arphic Technology.',
      kanjidic2: 'Data cara baca, arti, kelas sekolah, dan JLPT (skala lama) untuk kanji.',
      jmdict: 'Kosakata contoh (kata, cara baca, arti) yang tampil di halaman detail tiap kanji.',
      hanziWriter: 'Mesin animasi urutan goresan dan kuis menebalkan yang dipakai di seluruh aplikasi.',
    },
  },
}
