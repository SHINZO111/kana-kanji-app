import { useContext } from 'react'
import { LanguageContext, type LanguageContextValue } from './language-context'

/** Current language + dictionary + setter. Must be used within <LanguageProvider> (see App.tsx). */
export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
