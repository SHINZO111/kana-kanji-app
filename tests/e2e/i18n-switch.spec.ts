// Language switching across the 12 UI languages: full page-by-page checks for
// zh / es / ja / ko, spot checks (Home + Browse) for vi / id / pt / fr /
// ha / yo / ig, and persistence across reload (localStorage + <html lang>).

import { expect, test } from '@playwright/test'

const NAV_LABELS = {
  en: ['Home', 'Browse', 'Practice', 'Progress', 'Credits'],
  zh: ['首页', '浏览', '练习', '进度', '致谢'],
  es: ['Inicio', 'Explorar', 'Practicar', 'Progreso', 'Créditos'],
  ja: ['ホーム', '文字一覧', '練習', '学習記録', 'クレジット'],
  ko: ['홈', '둘러보기', '연습', '진도', '크레딧'],
} as const

const PAGE_HEADINGS = {
  en: { '/browse': 'Browse characters', '/practice': 'Practice', '/progress': 'Progress', '/credits': 'Credits' },
  zh: { '/browse': '浏览文字', '/practice': '练习', '/progress': '学习进度', '/credits': '致谢' },
  es: { '/browse': 'Explorar caracteres', '/practice': 'Practicar', '/progress': 'Progreso', '/credits': 'Créditos' },
  ja: { '/browse': '文字をさがす', '/practice': '練習', '/progress': '学習記録', '/credits': 'クレジット' },
  ko: { '/browse': '문자 둘러보기', '/practice': '연습', '/progress': '진도', '/credits': '크레딧' },
} as const

// Home + Browse spot checks for the remaining languages. homeAndroidHeading is
// the "Get the Android app" card's h2 — a Home-specific, translated string
// (the Home h1 is the language-invariant app name).
const SPOT_CHECKS = {
  vi: { navHome: 'Trang chủ', homeAndroidHeading: 'Tải ứng dụng Android', browseHeading: 'Duyệt ký tự' },
  id: { navHome: 'Beranda', homeAndroidHeading: 'Dapatkan aplikasi Android', browseHeading: 'Jelajahi karakter' },
  pt: { navHome: 'Início', homeAndroidHeading: 'Baixe o app para Android', browseHeading: 'Explorar caracteres' },
  fr: { navHome: 'Accueil', homeAndroidHeading: 'Obtenir l’application Android', browseHeading: 'Parcourir les caractères' },
  ha: { navHome: 'Gida', homeAndroidHeading: 'Sami manhajar Android', browseHeading: 'Duba haruffa' },
  yo: { navHome: 'Ilé', homeAndroidHeading: 'Gba app Android náà', browseHeading: 'Ṣàwárí àwọn àmì' },
  ig: { navHome: 'Ụlọ', homeAndroidHeading: 'Nweta ngwa Android', browseHeading: 'Chọgharịa mkpụrụedemede' },
} as const

// Must match SUPPORTED_LANGUAGES order in src/lib/i18n/index.ts.
const DROPDOWN_NATIVE_NAMES = [
  'English',
  'Español',
  'Français',
  'Hausa',
  'Bahasa Indonesia',
  'Igbo',
  '日本語',
  '한국어',
  'Português',
  'Tiếng Việt',
  'Yorùbá',
  '中文',
] as const

const languageSelect = 'header select'

async function expectNav(page: import('@playwright/test').Page, lang: keyof typeof NAV_LABELS) {
  for (const label of NAV_LABELS[lang]) {
    await expect(page.getByRole('navigation').getByRole('link', { name: label, exact: true })).toBeVisible()
  }
}

test('en -> zh -> es -> ja -> ko -> en updates every page and survives reload', async ({ page }) => {
  await page.goto('/')
  await expectNav(page, 'en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  for (const lang of ['zh', 'es', 'ja', 'ko'] as const) {
    await page.goto('/')
    await page.locator(languageSelect).selectOption(lang)
    await expectNav(page, lang)
    await expect(page.locator('html')).toHaveAttribute('lang', lang)

    // Every page renders in the selected language.
    for (const [route, heading] of Object.entries(PAGE_HEADINGS[lang])) {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
    }

    // The choice persists across a full reload.
    await page.reload()
    await expectNav(page, lang)
    expect(await page.evaluate(() => localStorage.getItem('kana-kanji-language'))).toBe(lang)
  }

  // And back to English.
  await page.goto('/')
  await page.locator(languageSelect).selectOption('en')
  await expectNav(page, 'en')
  await page.goto('/browse')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Browse characters')
})

for (const [lang, texts] of Object.entries(SPOT_CHECKS)) {
  test(`${lang}: Home and Browse render translated strings and survive reload`, async ({ page }) => {
    await page.goto('/')
    await page.locator(languageSelect).selectOption(lang)

    await expect(page.locator('html')).toHaveAttribute('lang', lang)
    await expect(
      page.getByRole('navigation').getByRole('link', { name: texts.navHome, exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: texts.homeAndroidHeading })).toBeVisible()

    await page.goto('/browse')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(texts.browseHeading)

    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(texts.browseHeading)
    expect(await page.evaluate(() => localStorage.getItem('kana-kanji-language'))).toBe(lang)
  })
}

test('the language dropdown always lists all 12 native names', async ({ page }) => {
  await page.goto('/')
  const options = page.locator(`${languageSelect} option`)
  await expect(options).toHaveCount(DROPDOWN_NATIVE_NAMES.length)
  for (const [i, name] of DROPDOWN_NATIVE_NAMES.entries()) {
    await expect(options.nth(i)).toHaveText(name)
  }

  // Native names stay stable even after switching to Chinese.
  await page.locator(languageSelect).selectOption('zh')
  await expect(options.nth(1)).toHaveText('Español')
  await expect(options.nth(10)).toHaveText('Yorùbá')
})

test('character detail and practice UI strings follow the language', async ({ page }) => {
  await page.goto('/')
  await page.locator(languageSelect).selectOption('zh')

  await page.goto(`/character/${encodeURIComponent('水')}`)
  await expect(page.getByText('音读')).toBeVisible()
  await expect(page.getByText('训读')).toBeVisible()
  await expect(page.getByRole('link', { name: '练习这个文字' })).toBeVisible()

  await page.goto('/practice')
  await expect(page.getByText('选择练习组')).toBeVisible()
  await expect(page.getByRole('button', { name: '平假名（46个）' })).toBeVisible()
})
