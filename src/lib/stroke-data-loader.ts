// Shared helpers for loading HanziWriter-format stroke data from
// public/data/strokes/{hex}.json (see plan Phase 1 + CLAUDE.md handoff notes).
//
// Files are named by the lowercase hex code point of the character
// (e.g. "水" -> "6c34.json"), matching data-pipeline/build-strokes.mjs.

import type { CharDataLoaderFn, CharacterJson } from 'hanzi-writer'

/** Lowercase hex code point for a single character, matching the data-pipeline naming. */
export function charToHex(char: string): string {
  const codePoint = char.codePointAt(0)
  if (codePoint === undefined) {
    throw new Error(`charToHex: received empty string`)
  }
  return codePoint.toString(16)
}

const cache = new Map<string, CharacterJson>()
const inFlight = new Map<string, Promise<CharacterJson>>()

async function fetchStrokeData(char: string): Promise<CharacterJson> {
  const hex = charToHex(char)
  const cached = cache.get(hex)
  if (cached) return cached

  const existing = inFlight.get(hex)
  if (existing) return existing

  const promise = (async () => {
    const url = `${import.meta.env.BASE_URL}data/strokes/${hex}.json`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to load stroke data for "${char}" (${url}): HTTP ${res.status}`)
    }
    const data = (await res.json()) as CharacterJson
    cache.set(hex, data)
    return data
  })()

  inFlight.set(hex, promise)
  try {
    return await promise
  } finally {
    inFlight.delete(hex)
  }
}

/** charDataLoader for HanziWriter.create(), backed by our own bundled stroke JSON. */
export const strokeDataLoader: CharDataLoaderFn = (char) => fetchStrokeData(char)
