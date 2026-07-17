// Compact language <select> shown in NavBar. Changing it updates the
// language context immediately (see lib/i18n/LanguageProvider.tsx) and
// persists the choice to localStorage.

import { SUPPORTED_LANGUAGES } from '../../lib/i18n'
import type { Language } from '../../lib/i18n'
import { useTranslation } from '../../lib/i18n/useTranslation'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <label className="ml-auto flex items-center gap-1.5 text-sm text-slate-500">
      <span className="sr-only">{t.language.label}</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label={t.language.label}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-700"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {t.language.names[lang]}
          </option>
        ))}
      </select>
    </label>
  )
}
