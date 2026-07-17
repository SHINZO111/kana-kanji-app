// CharacterDetail page: readings, examples, stroke animation canvas,
// stroke-order number overlay, and the markViewed IndexedDB side effect.

import { expect, test } from '@playwright/test'
import { collectPageErrors, readProgressRecord, readStrokeData } from './helpers'

function detailUrl(char: string): string {
  return `/character/${encodeURIComponent(char)}`
}

test('水: readings, meaning, examples, and animation SVG are all present', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.goto(detailUrl('水'))

  // Readings from KANJIDIC2.
  await expect(page.getByText('スイ')).toBeVisible()
  await expect(page.getByText('みず').first()).toBeVisible()
  await expect(page.getByText('water', { exact: false }).first()).toBeVisible()

  // Metadata badges.
  await expect(page.getByText('Grade 1')).toBeVisible()
  await expect(page.getByText('4 Strokes')).toBeVisible()

  // Example words section with at least one entry.
  await expect(page.getByRole('heading', { name: 'Examples' })).toBeVisible()
  expect(await page.locator('main ul li').count()).toBeGreaterThan(0)

  // HanziWriter rendered an SVG inside the animator canvas.
  await expect(page.getByTestId('stroke-animator-canvas').locator('svg')).toHaveCount(1)

  // Practice link.
  await expect(page.getByRole('link', { name: 'Practice this character' })).toBeVisible()
  expect(errors).toEqual([])
})

for (const char of ['あ', 'ア'] as const) {
  test(`${char}: kana detail shows romaji content and the animation canvas`, async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto(detailUrl(char))

    await expect(page.getByTestId('stroke-animator-canvas').locator('svg')).toHaveCount(1)
    // Kana have no grade badge and no on'yomi, but the dl labels render.
    await expect(page.getByText("On’yomi")).toBeVisible()
    await expect(page.getByText('Meaning')).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('stroke-order number overlay shows one number per stroke', async ({ page }) => {
  for (const char of ['水', 'あ'] as const) {
    const { strokes } = readStrokeData(char)
    await page.goto(detailUrl(char))
    const overlayNumbers = page.getByTestId('stroke-number-overlay').locator('text')
    await expect(overlayNumbers).toHaveCount(strokes.length)
    await expect(overlayNumbers.first()).toHaveText('1')
    await expect(overlayNumbers.last()).toHaveText(String(strokes.length))
  }
})

test('the grid guide shows by default, hides via the toggle, and the choice carries to Practice', async ({ page }) => {
  await page.goto(detailUrl('水'))
  await expect(page.getByTestId('grid-guide')).toBeVisible()

  await page.getByRole('checkbox', { name: 'Show grid' }).uncheck()
  await expect(page.getByTestId('grid-guide')).toHaveCount(0)

  // The preference is persisted (localStorage) and shared with Practice.
  await page.goto('/practice')
  await page.getByRole('button', { name: 'Hiragana (46)' }).click()
  await expect(page.getByTestId('stroke-quiz-canvas').locator('svg')).toHaveCount(1)
  await expect(page.getByTestId('grid-guide')).toHaveCount(0)

  // Re-enabling on Practice brings the grid back there too.
  await page.getByRole('checkbox', { name: 'Show grid' }).check()
  await expect(page.getByTestId('grid-guide')).toBeVisible()
})

test('the Show numbers toggle hides and restores the overlay', async ({ page }) => {
  await page.goto(detailUrl('水'))
  await expect(page.getByTestId('stroke-number-overlay')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Show numbers' }).uncheck()
  await expect(page.getByTestId('stroke-number-overlay')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Show numbers' }).check()
  await expect(page.getByTestId('stroke-number-overlay')).toBeVisible()
})

test('viewing a character records mastery=1 in IndexedDB (markViewed)', async ({ page }) => {
  await page.goto(detailUrl('火'))
  await expect(page.getByTestId('stroke-animator-canvas').locator('svg')).toHaveCount(1)

  await expect
    .poll(async () => {
      const record = await readProgressRecord(page, '火')
      return record?.mastery
    })
    .toBe(1)

  const record = await readProgressRecord(page, '火')
  expect(record).toMatchObject({
    char: '火',
    mastery: 1,
    traceSuccesses: 0,
    traceFails: 0,
  })
  expect(record?.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})
