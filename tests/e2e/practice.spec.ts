// Practice page: real stroke tracing against HanziWriter's quiz, driven by
// synthesizing pointer paths from the medians in public/data/strokes/.
// Canvas size 280 and padding 20 mirror StrokeQuiz's defaults
// (src/components/stroke/StrokeQuiz.tsx + src/lib/constants.ts).

import { expect, test } from '@playwright/test'
import { readProgressRecord, readStrokeData, traceStroke } from './helpers'

const QUIZ_SIZE = 280
const QUIZ_PADDING = 20

async function getQuizCanvasBox(page: import('@playwright/test').Page) {
  const canvas = page.getByTestId('stroke-quiz-canvas')
  await expect(canvas.locator('svg')).toHaveCount(1)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('quiz canvas has no bounding box')
  return box
}

test.beforeEach(async ({ page }) => {
  await page.goto('/practice')
  await expect(page.getByText('Choose a practice set')).toBeVisible()
})

test('the set chooser lists all 9 practice sets', async ({ page }) => {
  for (const label of [
    'Hiragana (46)',
    'Katakana (46)',
    'Grade 1 kanji (80)',
    'Grade 2 kanji (160)',
    'Grade 3 kanji (200)',
    'Grade 4 kanji (202)',
    'Grade 5 kanji (193)',
    'Grade 6 kanji (191)',
    'Other jouyou kanji (1,110)',
  ]) {
    await expect(page.getByRole('button', { name: label })).toBeVisible()
  }
})

test('tracing あ correctly advances to the next character and records progress', async ({
  page,
}) => {
  const { medians } = readStrokeData('あ') // first character of the hiragana set

  await page.getByRole('button', { name: 'Hiragana (46)' }).click()
  await expect(page.getByText('Character 1 of 46')).toBeVisible()
  const box = await getQuizCanvasBox(page)

  for (const median of medians) {
    await traceStroke(page, box, median, QUIZ_SIZE, QUIZ_PADDING)
  }

  // All strokes accepted with zero mistakes -> auto-advance after 700ms.
  await expect(page.getByText('Character 2 of 46')).toBeVisible({ timeout: 5_000 })
  await expect(page.getByText('Mistakes: 0')).toBeVisible()

  // recordAttempt persisted a clean completion for あ.
  await expect
    .poll(async () => (await readProgressRecord(page, 'あ'))?.traceSuccesses)
    .toBe(1)
  const record = await readProgressRecord(page, 'あ')
  expect(record).toMatchObject({
    char: 'あ',
    traceSuccesses: 1,
    traceFails: 0,
    cleanStreak: 1,
    mastery: 2,
    interval: 1,
  })
})

test('a wrong stroke increments the Mistakes counter', async ({ page }) => {
  const { medians } = readStrokeData('あ')

  await page.getByRole('button', { name: 'Hiragana (46)' }).click()
  await expect(page.getByText('Character 1 of 46')).toBeVisible()
  const box = await getQuizCanvasBox(page)

  await expect(page.getByText('Mistakes: 0')).toBeVisible()

  // Trace stroke 1's median BACKWARDS — wrong direction = graded as a
  // mistake by HanziWriter regardless of the shape being right.
  const reversed = [...medians[0]].reverse()
  await traceStroke(page, box, reversed, QUIZ_SIZE, QUIZ_PADDING)

  await expect(page.getByText('Mistakes: 1')).toBeVisible({ timeout: 5_000 })
})

test('completing a character with a mistake records a fail (streak reset)', async ({ page }) => {
  const { medians } = readStrokeData('あ')

  await page.getByRole('button', { name: 'Hiragana (46)' }).click()
  await expect(page.getByText('Character 1 of 46')).toBeVisible()
  const box = await getQuizCanvasBox(page)

  // One wrong stroke first...
  await traceStroke(page, box, [...medians[0]].reverse(), QUIZ_SIZE, QUIZ_PADDING)
  await expect(page.getByText('Mistakes: 1')).toBeVisible({ timeout: 5_000 })

  // ...then finish the character correctly.
  for (const median of medians) {
    await traceStroke(page, box, median, QUIZ_SIZE, QUIZ_PADDING)
  }
  await expect(page.getByText('Character 2 of 46')).toBeVisible({ timeout: 5_000 })

  await expect
    .poll(async () => (await readProgressRecord(page, 'あ'))?.traceFails)
    .toBe(1)
  const record = await readProgressRecord(page, 'あ')
  expect(record).toMatchObject({ traceFails: 1, cleanStreak: 0, interval: 0 })
})

test('the review set is empty for a fresh profile', async ({ page }) => {
  await page.goto('/practice?mode=review')
  await expect(page.getByText('Nothing to review right now')).toBeVisible()
  await page.getByRole('button', { name: 'Choose a different set' }).click()
  await expect(page.getByText('Choose a practice set')).toBeVisible()
})

test('after viewing a character it appears in the review flow', async ({ page }) => {
  await page.goto(`/character/${encodeURIComponent('あ')}`)
  await expect
    .poll(async () => (await readProgressRecord(page, 'あ'))?.mastery)
    .toBe(1)

  await page.goto('/practice?mode=review')
  await expect(page.getByText("Today's review")).toBeVisible()
  await expect(page.getByText('Character 1 of 1')).toBeVisible()
  await expect(page.getByTestId('stroke-quiz-canvas').locator('svg')).toHaveCount(1)
})
