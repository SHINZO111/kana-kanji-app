// Formats CharProgress.lastPracticed (an ISO timestamp, or '' for
// markViewed-only records — see progress-stats.ts) for display.

import type { Language } from './i18n/types'

/** BCP-47 locale tag used for Intl date formatting per UI language (see lib/i18n). */
const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  ha: 'ha-NG',
  id: 'id-ID',
  ig: 'ig-NG',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-BR',
  vi: 'vi-VN',
  yo: 'yo-NG',
  zh: 'zh-CN',
}

export function formatPracticedDate(iso: string, language: Language = 'en'): string {
  const date = new Date(iso)
  // Guards against a corrupted/garbage lastPracticed value on disk (see
  // progress-store.ts's read-time sanitation) — new Date() never throws on
  // an unparsable string, it just produces an Invalid Date whose
  // toLocaleDateString() would otherwise render as "Invalid Date".
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString(LOCALE_BY_LANGUAGE[language], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
