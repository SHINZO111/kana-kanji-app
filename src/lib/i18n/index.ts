import type { Dictionary, Language } from './types'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { ha } from './ha'
import { id } from './id'
import { ig } from './ig'
import { ja } from './ja'
import { ko } from './ko'
import { pt } from './pt'
import { vi } from './vi'
import { yo } from './yo'
import { zh } from './zh'

export type { Dictionary, Language } from './types'
export { CREDIT_ENTRY_META } from './credit-meta'
export type { CreditEntryId, CreditEntryMeta } from './credit-meta'
export { LANGUAGE_NATIVE_NAMES } from './language-names'

export const DEFAULT_LANGUAGE: Language = 'en'

// Ordered alphabetically by language code; this is also the order the
// LanguageSwitcher dropdown lists them in.
export const SUPPORTED_LANGUAGES: readonly Language[] = [
  'en',
  'es',
  'fr',
  'ha',
  'id',
  'ig',
  'ja',
  'ko',
  'pt',
  'vi',
  'yo',
  'zh',
]

export const LANGUAGE_STORAGE_KEY = 'kana-kanji-language'

const DICTIONARIES: Record<Language, Dictionary> = {
  en,
  es,
  fr,
  ha,
  id,
  ig,
  ja,
  ko,
  pt,
  vi,
  yo,
  zh,
}

export function getDictionary(language: Language): Dictionary {
  return DICTIONARIES[language]
}

export function isSupportedLanguage(value: string | null): value is Language {
  return value !== null && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}
