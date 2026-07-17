// All-page navigation smoke tests: every route renders its main content
// with zero console errors, and unknown URLs hit the NotFound catch-all.

import { expect, test } from '@playwright/test'
import { ROUTES, collectPageErrors } from './helpers'

const EXPECTED_HEADINGS: Record<(typeof ROUTES)[number], string> = {
  '/': 'KANAKANJI',
  '/browse': 'Browse characters',
  '/practice': 'Practice',
  '/progress': 'Progress',
  '/credits': 'Credits',
}

for (const route of ROUTES) {
  test(`${route} renders with no console errors`, async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(EXPECTED_HEADINGS[route])
    await expect(page.getByRole('navigation')).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('nav links reach every page from the home page', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.goto('/')

  const nav = page.getByRole('navigation')
  for (const [label, heading] of [
    ['Browse', 'Browse characters'],
    ['Practice', 'Practice'],
    ['Progress', 'Progress'],
    ['Credits', 'Credits'],
    ['Home', 'KANAKANJI'],
  ] as const) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
  }
  expect(errors).toEqual([])
})

test('home page shows both the Android APK card and the iOS Add-to-Home-Screen card', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Get the Android app' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Add to your Home Screen (iPhone/iPad)' })).toBeVisible()
})

test('unknown URLs render the NotFound page with a working home link', async ({ page }) => {
  await page.goto('/no-such-page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  await page.getByRole('link', { name: 'Back to home' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('KANAKANJI')
})

test('character detail route renders directly by URL', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.goto(`/character/${encodeURIComponent('水')}`)
  await expect(page.getByTestId('stroke-animator-canvas')).toBeVisible()
  await expect(page.getByText('water', { exact: false }).first()).toBeVisible()
  expect(errors).toEqual([])
})
