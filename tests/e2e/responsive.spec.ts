// Mobile viewport (375x667): no page may overflow horizontally.

import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 375, height: 667 } })

const PAGES: { name: string; setup: (page: import('@playwright/test').Page) => Promise<void> }[] = [
  { name: 'home', setup: (page) => page.goto('/') },
  { name: 'browse (hiragana)', setup: (page) => page.goto('/browse') },
  {
    name: 'browse (kanji grid)',
    setup: async (page) => {
      await page.goto('/browse')
      await page.getByRole('button', { name: 'Kanji', exact: true }).click()
      await expect(page.locator('main a[href^="/character/"]').first()).toBeVisible()
    },
  },
  { name: 'character detail (水)', setup: (page) => page.goto(`/character/${encodeURIComponent('水')}`) },
  { name: 'character detail (あ)', setup: (page) => page.goto(`/character/${encodeURIComponent('あ')}`) },
  { name: 'practice chooser', setup: (page) => page.goto('/practice') },
  {
    name: 'practice quiz',
    setup: async (page) => {
      await page.goto('/practice')
      await page.getByRole('button', { name: 'Hiragana (46)' }).click()
      await expect(page.getByTestId('stroke-quiz-canvas').locator('svg')).toHaveCount(1)
    },
  },
  { name: 'progress', setup: (page) => page.goto('/progress') },
  { name: 'credits', setup: (page) => page.goto('/credits') },
  { name: 'not found', setup: (page) => page.goto('/no-such-page') },
]

for (const { name, setup } of PAGES) {
  test(`${name} has no horizontal scroll at 375px`, async ({ page }) => {
    await setup(page)
    // Let fonts/layout settle before measuring.
    await page.waitForLoadState('networkidle')

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth, `scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`).toBeLessThanOrEqual(
      clientWidth,
    )
  })
}
