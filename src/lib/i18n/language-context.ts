// Plain (non-component) context definition, split out from
// LanguageProvider.tsx / useTranslation.ts so each of those files exports
// only one thing (component / hook respectively) — keeps React Fast Refresh
// happy and matches the "small, single-purpose files" convention.

import { createContext } from 'react'
import type { Dictionary, Language } from './types'

export interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Dictionary
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
