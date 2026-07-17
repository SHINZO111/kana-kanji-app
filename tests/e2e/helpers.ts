// Shared helpers for the Playwright E2E suite.

import type { Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROUTES = ['/', '/browse', '/practice', '/progress', '/credits'] as const

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export function charToHex(char: string): string {
  const codePoint = char.codePointAt(0)
  if (codePoint === undefined) throw new Error('empty char')
  return codePoint.toString(16)
}

export function readStrokeData(char: string): { strokes: string[]; medians: number[][][] } {
  const file = path.join(REPO_ROOT, 'public', 'data', 'strokes', `${charToHex(char)}.json`)
  return JSON.parse(readFileSync(file, 'utf-8'))
}

/** Collects console errors + uncaught page errors for the page's lifetime. */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console.error: ${message.text()}`)
  })
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`)
  })
  return errors
}

/**
 * Reads one CharProgress record straight out of the app's IndexedDB
 * (database "kana-kanji-progress", store "progress") from inside the page.
 */
export async function readProgressRecord(
  page: Page,
  char: string,
): Promise<Record<string, unknown> | undefined> {
  return page.evaluate(async (key) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kana-kanji-progress')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    try {
      if (!db.objectStoreNames.contains('progress')) return undefined
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('progress', 'readonly')
        const request = tx.objectStore('progress').get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } finally {
      db.close()
    }
  }, char)
}

/**
 * HanziWriter's data->screen transform, mirroring its internal Positioner
 * (see node_modules/hanzi-writer/dist/index.esm.js): the character data
 * space is x in [0, 1024], y in [-124, 900] with y running UPWARD, so
 *   scale   = (size - 2 * padding) / 1024        (square canvas)
 *   xOffset = padding
 *   yOffset = 124 * scale + padding              (-from.y * scale + buffer)
 *   screenX = xOffset + scale * dataX
 *   screenY = size - yOffset - scale * dataY     (y-flip)
 * This is the exact inverse of Positioner.convertExternalPoint, which the
 * quiz uses to map pointer events back into data space.
 */
export function makeDataToScreen(size: number, padding: number) {
  const scale = (size - 2 * padding) / 1024
  const xOffset = padding
  const yOffset = 124 * scale + padding
  return (dataX: number, dataY: number) => ({
    x: xOffset + scale * dataX,
    y: size - yOffset - scale * dataY,
  })
}

/**
 * Traces one stroke on the quiz canvas by dragging the mouse through the
 * stroke's median points (converted from HanziWriter data space to page
 * coordinates).
 */
export async function traceStroke(
  page: Page,
  canvasBox: { x: number; y: number },
  median: number[][],
  size: number,
  padding: number,
): Promise<void> {
  const toScreen = makeDataToScreen(size, padding)
  const points = median.map(([dx, dy]) => {
    const p = toScreen(dx, dy)
    return { x: canvasBox.x + p.x, y: canvasBox.y + p.y }
  })

  await page.mouse.move(points[0].x, points[0].y)
  await page.mouse.down()
  for (const point of points.slice(1)) {
    await page.mouse.move(point.x, point.y, { steps: 6 })
  }
  await page.mouse.up()
}
