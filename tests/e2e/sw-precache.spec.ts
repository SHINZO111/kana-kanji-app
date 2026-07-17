// Static inspection of the built service worker (dist/sw.js): the precache
// manifest must include the character data JSON (index, kana, per-kanji
// detail, and all stroke files) or offline practice would silently break.
// See vite.config.ts workbox.globPatterns.

import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { REPO_ROOT } from './helpers'

const SW_PATH = path.join(REPO_ROOT, 'dist', 'sw.js')

test('dist/sw.js exists (built with the PWA plugin)', () => {
  expect(existsSync(SW_PATH), 'run `npm run build` before the E2E suite').toBe(true)
})

test('precache manifest includes index.json, kana.json, kanji and stroke data', () => {
  const sw = readFileSync(SW_PATH, 'utf-8')

  expect(sw).toContain('data/index.json')
  expect(sw).toContain('data/kana.json')

  const strokeEntries = sw.match(/data\/strokes\/[0-9a-f]+\.json/g) ?? []
  const kanjiEntries = sw.match(/data\/kanji\/[0-9a-f]+\.json/g) ?? []

  // 2,228 stroke files (92 kana + 2,136 kanji) and 2,136 kanji detail files.
  expect(new Set(strokeEntries).size).toBe(2228)
  expect(new Set(kanjiEntries).size).toBe(2136)

  // Spot-check specific characters: 水 (6c34) and あ (3042).
  expect(sw).toContain('data/strokes/6c34.json')
  expect(sw).toContain('data/kanji/6c34.json')
  expect(sw).toContain('data/strokes/3042.json')
})

test('precache manifest includes the app shell and PWA icons', () => {
  const sw = readFileSync(SW_PATH, 'utf-8')
  expect(sw).toContain('index.html')
  expect(sw).toMatch(/assets\/[^"']+\.js/)
  expect(sw).toMatch(/assets\/[^"']+\.css/)
  expect(sw).toContain('icons/icon-192.png')
  expect(sw).toContain('manifest.webmanifest')
})

test('precache manifest excludes the Android APK download', () => {
  // public/download/kanakanji.apk (~7.8MB, see data-pipeline/copy-apk.mjs)
  // must never be precached — that would force every web visitor's browser
  // to silently download a multi-MB Android package. See vite.config.ts
  // workbox.globIgnores.
  const sw = readFileSync(SW_PATH, 'utf-8')
  expect(sw).not.toContain('.apk')
  expect(sw).not.toContain('download/kanakanji')
})
