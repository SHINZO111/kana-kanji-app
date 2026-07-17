// Native (self-referential) display names for every UI language. Shared by
// all dictionaries (each Dictionary['language']['names'] points at this one
// object) so the LanguageSwitcher always lists each language in its own
// script — 日本語 stays 日本語 whether the app is in English or Korean —
// and adding a language means adding exactly one entry here.

import type { Language } from './types'

export const LANGUAGE_NATIVE_NAMES: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ha: 'Hausa',
  id: 'Bahasa Indonesia',
  ig: 'Igbo',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  vi: 'Tiếng Việt',
  yo: 'Yorùbá',
  zh: '中文',
}
