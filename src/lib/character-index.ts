// Shared loader for public/data/index.json (the lightweight per-character
// index used by both Practice's set builder and Browse's grid/search).
// Kept as a single module-level cache so both call sites share one fetch.

import type { IndexEntry } from './types'

let indexCache: IndexEntry[] | null = null
let indexPromise: Promise<IndexEntry[]> | null = null

export async function loadCharacterIndex(): Promise<IndexEntry[]> {
  if (indexCache) return indexCache
  if (!indexPromise) {
    indexPromise = (async () => {
      const url = `${import.meta.env.BASE_URL}data/index.json`
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to load character index (${url}): HTTP ${res.status}`)
      }
      const data = (await res.json()) as IndexEntry[]
      indexCache = data
      return data
    })()
  }
  return indexPromise
}

/** Case-insensitive substring match against the character itself, its kana readings, and its English meanings. */
export function matchesQuery(entry: IndexEntry, trimmedQuery: string): boolean {
  if (!trimmedQuery) return true
  const lowerQuery = trimmedQuery.toLowerCase()

  if (entry.char.includes(trimmedQuery)) return true
  if (entry.readings.some((reading) => reading.includes(trimmedQuery))) return true
  if (entry.romaji?.includes(lowerQuery)) return true
  return entry.meanings.some((meaning) => meaning.toLowerCase().includes(lowerQuery))
}

export function searchCharacterIndex(entries: IndexEntry[], query: string): IndexEntry[] {
  const trimmed = query.trim()
  if (!trimmed) return entries
  return entries.filter((entry) => matchesQuery(entry, trimmed))
}
