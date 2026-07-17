// Browse page: gojūon tables, kanji grade filter, and cross-kind search.

import { expect, test } from '@playwright/test'
import { collectPageErrors } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/browse')
})

test('hiragana and katakana tabs each show all 46 kana (92 total)', async ({ page }) => {
  const cells = page.locator('main a[href^="/character/"]')

  // Hiragana is the default tab.
  await expect(cells).toHaveCount(46)
  await expect(page.locator('main').getByText('あ', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Katakana' }).click()
  await expect(cells).toHaveCount(46)
  await expect(page.locator('main').getByText('ア', { exact: true })).toBeVisible()
})

test('kanji tab with Grade 1 filter shows exactly 80 characters', async ({ page }) => {
  await page.getByRole('button', { name: 'Kanji', exact: true }).click()
  const cells = page.locator('main a[href^="/character/"]')
  await expect(cells).toHaveCount(2136)
  await expect(page.getByText('2136 characters')).toBeVisible()

  // The grade filter is the first select inside the main content.
  await page.locator('main select').first().selectOption('1')
  await expect(cells).toHaveCount(80)
  await expect(page.getByText('80 characters')).toBeVisible()
})

test('searching "water" finds 水 and links to its detail page', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.getByPlaceholder('Search by character, reading, or meaning').fill('water')
  await expect(page.getByText('Results for "water"')).toBeVisible()

  const waterCell = page.locator(`main a[href="/character/${encodeURIComponent('水')}"]`)
  await expect(waterCell).toBeVisible()
  await waterCell.click()
  await expect(page).toHaveURL(/\/character\//)
  await expect(page.getByTestId('stroke-animator-canvas')).toBeVisible()
  expect(errors).toEqual([])
})

test('searching by kana reading みず also finds 水', async ({ page }) => {
  await page.getByPlaceholder('Search by character, reading, or meaning').fill('みず')
  await expect(page.locator(`main a[href="/character/${encodeURIComponent('水')}"]`)).toBeVisible()
})

test('a nonsense query shows the empty state', async ({ page }) => {
  await page.getByPlaceholder('Search by character, reading, or meaning').fill('zzzqqq')
  await expect(page.getByText('No characters match your search.')).toBeVisible()
  await expect(page.locator('main a[href^="/character/"]')).toHaveCount(0)
})
