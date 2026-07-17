// Runtime validation of the i18n dictionaries (src/lib/i18n).
// The Dictionary type already forces key parity at compile time; these
// tests re-verify it at runtime (guarding against `as` casts or future
// untyped loading) and exercise every function-valued entry to prove the
// placeholders actually interpolate.

import { describe, expect, it } from 'vitest'
import { en } from '../../src/lib/i18n/en'
import { es } from '../../src/lib/i18n/es'
import { fr } from '../../src/lib/i18n/fr'
import { ha } from '../../src/lib/i18n/ha'
import { id } from '../../src/lib/i18n/id'
import { ig } from '../../src/lib/i18n/ig'
import { ja } from '../../src/lib/i18n/ja'
import { ko } from '../../src/lib/i18n/ko'
import { pt } from '../../src/lib/i18n/pt'
import { vi } from '../../src/lib/i18n/vi'
import { yo } from '../../src/lib/i18n/yo'
import { zh } from '../../src/lib/i18n/zh'
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getDictionary,
  isSupportedLanguage,
} from '../../src/lib/i18n'

const DICTIONARIES = { en, es, fr, ha, id, ig, ja, ko, pt, vi, yo, zh } as const

const NON_ENGLISH_LANGUAGES = ['es', 'fr', 'ha', 'id', 'ig', 'ja', 'ko', 'pt', 'vi', 'yo', 'zh'] as const

/** Flattens a dictionary into path -> typeof leaf ('string' | 'function' | ...). */
function shapeOf(value: unknown, prefix = ''): Map<string, string> {
  const shape = new Map<string, string>()
  if (typeof value !== 'object' || value === null) return shape
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof child === 'object' && child !== null) {
      for (const [subPath, type] of shapeOf(child, path)) shape.set(subPath, type)
    } else {
      shape.set(path, typeof child)
    }
  }
  return shape
}

describe('dictionary key parity', () => {
  const enShape = shapeOf(en)

  it('en has a non-trivial shape', () => {
    expect(enShape.size).toBeGreaterThan(50)
  })

  for (const lang of NON_ENGLISH_LANGUAGES) {
    it(`${lang} has exactly the same keys and leaf types as en`, () => {
      const langShape = shapeOf(DICTIONARIES[lang])
      const missing = [...enShape.keys()].filter((k) => !langShape.has(k))
      const extra = [...langShape.keys()].filter((k) => !enShape.has(k))
      expect(missing, `missing in ${lang}: ${missing.join(', ')}`).toHaveLength(0)
      expect(extra, `extra in ${lang}: ${extra.join(', ')}`).toHaveLength(0)
      for (const [path, type] of enShape) {
        expect(langShape.get(path), `type mismatch at ${path}`).toBe(type)
      }
    })
  }
})

describe('string leaves are non-empty', () => {
  for (const [lang, dict] of Object.entries(DICTIONARIES)) {
    it(`${lang}: every string value is non-empty`, () => {
      const empty: string[] = []
      const visit = (value: unknown, path: string) => {
        if (typeof value === 'string') {
          if (value.trim() === '') empty.push(path)
        } else if (typeof value === 'object' && value !== null) {
          for (const [k, v] of Object.entries(value)) visit(v, `${path}.${k}`)
        }
      }
      visit(dict, lang)
      expect(empty, empty.join(', ')).toHaveLength(0)
    })
  }
})

describe('function entries interpolate their placeholders', () => {
  for (const [lang, dict] of Object.entries(DICTIONARIES)) {
    it(`${lang}: numeric formatters embed their arguments`, () => {
      expect(dict.home.masteredOf(12, 345)).toContain('12')
      expect(dict.home.masteredOf(12, 345)).toContain('345')
      expect(dict.browse.searchResultsFor('QUERY-X')).toContain('QUERY-X')
      expect(dict.browse.resultCount(42)).toContain('42')
      expect(dict.practice.progressLabel(3, 46)).toContain('3')
      expect(dict.practice.progressLabel(3, 46)).toContain('46')
      expect(dict.progress.overallMastered(7, 99)).toContain('7')
      expect(dict.progress.masteryRate(85)).toContain('85')
      expect(dict.progress.totalAttempts(17)).toContain('17')
      expect(dict.progress.categoryCount(80)).toContain('80')
      expect(dict.progress.lastPracticed('DATE-X')).toContain('DATE-X')
      expect(dict.progress.reviewDueToday(23)).toContain('23')
    })

    it(`${lang}: gradeLabel handles school grades and grade 8 (other jouyou)`, () => {
      for (const grade of [1, 2, 3, 4, 5, 6]) {
        expect(dict.detail.gradeLabel(grade)).toContain(String(grade))
      }
      const other = dict.detail.gradeLabel(8)
      expect(other.length).toBeGreaterThan(0)
      expect(other).not.toContain('8') // grade 8 renders as a name, not a number
    })

    it(`${lang}: singular/zero variants return non-empty strings`, () => {
      for (const n of [0, 1, 2]) {
        expect(dict.progress.reviewDueToday(n).length).toBeGreaterThan(0)
        expect(dict.progress.totalAttempts(n).length).toBeGreaterThan(0)
      }
    })
  }
})

describe('language helpers', () => {
  it('exposes all 12 languages with en as the default', () => {
    expect(SUPPORTED_LANGUAGES).toEqual([
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
    ])
    expect(DEFAULT_LANGUAGE).toBe('en')
  })

  it('getDictionary returns the matching dictionary object', () => {
    for (const [lang, dict] of Object.entries(DICTIONARIES)) {
      expect(getDictionary(lang as keyof typeof DICTIONARIES)).toBe(dict)
    }
  })

  it('isSupportedLanguage accepts only supported codes', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(isSupportedLanguage(lang)).toBe(true)
    }
    expect(isSupportedLanguage('de')).toBe(false)
    expect(isSupportedLanguage('in')).toBe(false) // legacy Indonesian code, mapped in LanguageProvider only
    expect(isSupportedLanguage(null)).toBe(false)
    expect(isSupportedLanguage('')).toBe(false)
  })

  it('every language name map covers all supported languages', () => {
    for (const dict of Object.values(DICTIONARIES)) {
      for (const lang of SUPPORTED_LANGUAGES) {
        expect(dict.language.names[lang].length).toBeGreaterThan(0)
      }
    }
  })
})
