// Fetches per-character detail data with an in-memory cache.
//
// Kanji: one JSON file per character at public/data/kanji/{hex}.json.
// Kana: all 92 characters live together in public/data/kana.json (see
// CLAUDE.md handoff notes), so that file is fetched once and cached whole.

import { useEffect, useState } from 'react'
import type { CharacterData } from '../lib/types'
import { charToHex } from '../lib/stroke-data-loader'

const kanjiCache = new Map<string, CharacterData>()
let kanaCache: Map<string, CharacterData> | null = null
let kanaPromise: Promise<Map<string, CharacterData>> | null = null

function isKana(char: string): boolean {
  const codePoint = char.codePointAt(0) ?? 0
  // Hiragana U+3040-309F, Katakana U+30A0-30FF.
  return (codePoint >= 0x3040 && codePoint <= 0x309f) || (codePoint >= 0x30a0 && codePoint <= 0x30ff)
}

async function loadKanaMap(): Promise<Map<string, CharacterData>> {
  if (kanaCache) return kanaCache
  if (!kanaPromise) {
    kanaPromise = (async () => {
      const url = `${import.meta.env.BASE_URL}data/kana.json`
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to load kana data (${url}): HTTP ${res.status}`)
      }
      const list = (await res.json()) as CharacterData[]
      const map = new Map(list.map((entry) => [entry.char, entry]))
      kanaCache = map
      return map
    })()
  }
  return kanaPromise
}

async function loadKanjiEntry(char: string): Promise<CharacterData> {
  const cached = kanjiCache.get(char)
  if (cached) return cached

  const hex = charToHex(char)
  const url = `${import.meta.env.BASE_URL}data/kanji/${hex}.json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load character data for "${char}" (${url}): HTTP ${res.status}`)
  }
  const data = (await res.json()) as CharacterData
  kanjiCache.set(char, data)
  return data
}

async function fetchCharacterData(char: string): Promise<CharacterData> {
  if (isKana(char)) {
    const map = await loadKanaMap()
    const entry = map.get(char)
    if (!entry) {
      throw new Error(`No kana data found for "${char}"`)
    }
    return entry
  }
  return loadKanjiEntry(char)
}

interface UseCharacterDataResult {
  data: CharacterData | null
  loading: boolean
  error: string | null
}

export function useCharacterData(char: string | undefined): UseCharacterDataResult {
  const [data, setData] = useState<CharacterData | null>(null)
  const [loading, setLoading] = useState(Boolean(char))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!char) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCharacterData(char)
      .then((result) => {
        if (cancelled) return
        setData(result)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setData(null)
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [char])

  return { data, loading, error }
}
