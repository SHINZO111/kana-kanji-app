// Generates the PWA manifest icons (public/icons/*.png), the apple touch
// icon, and public/favicon.svg from the shared icon design in
// data-pipeline/lib/icon-svg.mjs (see plan Phase 7 "アプリアイコン作り込み").
//
// Rasterization uses @resvg/resvg-js (a headless resvg build) rather than
// hand-rolling a PNG encoder, so the design can use gradients/paths freely.
//
// Re-run with `npm run assets:icons` after editing icon-svg.mjs.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { buildIconSvg } from './lib/icon-svg.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons')

async function renderPng(svg, size) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  return resvg.render().asPng()
}

async function main() {
  await mkdir(ICONS_DIR, { recursive: true })

  // 'any' purpose manifest icons: rounded square, matches the brand mark's
  // general silhouette.
  const roundedSvg = await buildIconSvg({ cornerRadius: 512 * 0.22 })
  // 'maskable' purpose + apple-touch-icon: full-bleed square. The OS (Android
  // adaptive icons, iOS) applies its own corner treatment / mask on top.
  const fullBleedSvg = await buildIconSvg({ cornerRadius: 0 })

  const targets = [
    { file: path.join(ICONS_DIR, 'icon-192.png'), svg: roundedSvg, size: 192 },
    { file: path.join(ICONS_DIR, 'icon-512.png'), svg: roundedSvg, size: 512 },
    { file: path.join(ICONS_DIR, 'icon-maskable-512.png'), svg: fullBleedSvg, size: 512 },
    { file: path.join(PUBLIC_DIR, 'apple-touch-icon.png'), svg: fullBleedSvg, size: 180 },
  ]

  for (const target of targets) {
    const png = await renderPng(target.svg, target.size)
    await writeFile(target.file, png)
    console.log(`[generate-icons] wrote ${path.relative(process.cwd(), target.file)} (${png.length} bytes)`)
  }

  const faviconSvg = await buildIconSvg({ cornerRadius: 512 * 0.22 })
  const faviconPath = path.join(PUBLIC_DIR, 'favicon.svg')
  await writeFile(faviconPath, faviconSvg)
  console.log(`[generate-icons] wrote ${path.relative(process.cwd(), faviconPath)}`)
}

main()
