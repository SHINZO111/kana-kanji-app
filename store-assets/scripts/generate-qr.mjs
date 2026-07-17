// Generates distribution QR codes for the KANAKANJI landing page.
//
// Outputs (store-assets/qr/):
//   kanakanji-qr.svg          — plain QR, vector (print-ready at any size)
//   kanakanji-qr.png          — plain QR, 1024x1024
//   kanakanji-qr-branded.png  — QR with the app icon centered, 1024x1024
//                               (error correction H tolerates the covered center)
//
// Also copies the branded PNG to public/qr.png, which the Home page's
// "Share KANAKANJI" card (src/pages/Home.tsx) serves directly — keeping it
// regeneratable here instead of a one-off manual copy.
//
// Run: node store-assets/scripts/generate-qr.mjs

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import { Resvg } from '@resvg/resvg-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(__dirname, '..', '..')
const OUT_DIR = path.join(REPO_ROOT, 'store-assets', 'qr')
const ICON_PATH = path.join(REPO_ROOT, 'public', 'icons', 'icon-192.png')
const PUBLIC_QR_PATH = path.join(REPO_ROOT, 'public', 'qr.png')

const URL = 'https://kanakanji.pages.dev'
const SIZE = 1024

async function renderPng(svg, outFile) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: SIZE } }).render().asPng()
  await writeFile(outFile, png)
  return png.length
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  // Plain QR (medium error correction is plenty when nothing covers the code).
  const plainSvg = await QRCode.toString(URL, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 4,
    color: { dark: '#1e1b2e', light: '#ffffff' },
  })
  await writeFile(path.join(OUT_DIR, 'kanakanji-qr.svg'), plainSvg)
  const plainBytes = await renderPng(plainSvg, path.join(OUT_DIR, 'kanakanji-qr.png'))

  // Branded QR: high error correction (H = ~30% recoverable) so the centered
  // icon (~20% of the width, i.e. ~4% of the area) is safely below tolerance.
  const brandedBase = await QRCode.toString(URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 4,
    color: { dark: '#1e1b2e', light: '#ffffff' },
  })
  const iconData = (await readFile(ICON_PATH)).toString('base64')
  // qrcode's svg output uses a viewBox of (modules + 2*margin) units.
  const viewBox = brandedBase.match(/viewBox="0 0 (\d+) (\d+)"/)
  const units = Number(viewBox[1])
  const iconUnits = units * 0.2
  const iconPos = (units - iconUnits) / 2
  const pad = iconUnits * 0.08
  const overlay = `
  <rect x="${iconPos - pad}" y="${iconPos - pad}" width="${iconUnits + pad * 2}" height="${iconUnits + pad * 2}" rx="${iconUnits * 0.18}" fill="#ffffff"/>
  <image x="${iconPos}" y="${iconPos}" width="${iconUnits}" height="${iconUnits}" href="data:image/png;base64,${iconData}"/>
</svg>`
  const brandedSvg = brandedBase.replace('</svg>', overlay)
  const brandedPath = path.join(OUT_DIR, 'kanakanji-qr-branded.png')
  const brandedBytes = await renderPng(brandedSvg, brandedPath)

  await copyFile(brandedPath, PUBLIC_QR_PATH)

  console.log(`[generate-qr] ${URL}`)
  console.log(`[generate-qr] wrote kanakanji-qr.svg, kanakanji-qr.png (${plainBytes} bytes), kanakanji-qr-branded.png (${brandedBytes} bytes)`)
  console.log(`[generate-qr] copied kanakanji-qr-branded.png -> ${path.relative(REPO_ROOT, PUBLIC_QR_PATH)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
