// Wraps the whole app (see App.tsx) so every page/component can call
// useTranslation() (see useTranslation.ts) instead of importing
// lib/constants.ts text objects directly.
//
// Persistence: the chosen language is saved to localStorage and restored on
// next load. If nothing is stored yet, we take one guess from the browser's
// own language setting (navigator.language) before falling back to English
// — a nicety on top of the plan's explicit localStorage requirement, not a
// replacement for it.

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './language-context'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  getDictionary,
  isSupportedLanguage,
} from './index'
import type { Language } from './types'

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (isSupportedLanguage(stored)) return stored

  // Prefix match: "pt-BR" -> pt, "ja-JP" -> ja, "ko-KR" -> ko, etc. Every
  // supported code is 2 letters, so slicing the BCP 47 tag's primary subtag
  // covers all region variants of the 9 UI languages.
  const browserLanguage = window.navigator?.language?.slice(0, 2)
  // Legacy quirk: some Android WebViews still report Indonesian as "in-ID"
  // (the pre-1989 ISO code) instead of "id".
  if (browserLanguage === 'in') return 'id'
  const match = SUPPORTED_LANGUAGES.find((lang) => lang === browserLanguage)
  return match ?? DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage)

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    // Lets screen readers / browser UI (e.g. spellcheck, translate prompts)
    // know the page's actual content language.
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: getDictionary(language),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
