// Loads every stored CharProgress record and exposes it as char -> Mastery,
// for Browse's grid dots (see CLAUDE.md handoff notes: "mastery の色ドットは
// progress-store.getAllProgress() から読む").

import { useEffect, useState } from 'react'
import { getAllProgress } from '../lib/progress-store'
import type { Mastery } from '../lib/types'

export function useMasteryMap(): Map<string, Mastery> {
  const [map, setMap] = useState<Map<string, Mastery>>(new Map())

  useEffect(() => {
    let cancelled = false
    getAllProgress().then((records) => {
      if (cancelled) return
      setMap(new Map(records.map((record) => [record.char, record.mastery])))
    })
    return () => {
      cancelled = true
    }
  }, [])

  return map
}
