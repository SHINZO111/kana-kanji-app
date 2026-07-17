import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { useTranslation } from '../lib/i18n/useTranslation'
import type { Dictionary } from '../lib/i18n/types'
import { loadCharacterIndex } from '../lib/character-index'
import { getLastPracticeSetId } from '../lib/last-practice-set'
import { getAllProgress } from '../lib/progress-store'
import { isDueToday } from '../lib/srs'
import { isIOSDevice } from '../lib/platform'

interface HomeStats {
  totalCount: number
  masteredCount: number
  reviewCount: number
}

// Matches the URL encoded into store-assets/qr/kanakanji-qr-branded.png (see
// store-assets/scripts/generate-qr.mjs) — kept as a single source of truth
// for the text shown next to the QR code on the Share card below.
const SHARE_URL = 'https://kanakanji.pages.dev'

export default function Home() {
  const { t } = useTranslation()
  const lastSetId = getLastPracticeSetId()
  const [stats, setStats] = useState<HomeStats | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([loadCharacterIndex(), getAllProgress()]).then(([index, progress]) => {
      if (cancelled) return
      setStats({
        totalCount: index.length,
        masteredCount: progress.filter((p) => p.mastery === 3).length,
        // Matches practice-sets.ts loadReviewSet's definition of "due" —
        // see lib/srs.ts (Phase 7 SRS).
        reviewCount: progress.filter((p) => p.mastery > 0 && isDueToday(p.dueDate)).length,
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const continueHref = lastSetId ? `/practice?set=${lastSetId}` : '/practice'
  const continueLabel = lastSetId
    ? `${t.home.continuePractice}: ${t.practice.sets[lastSetId]}`
    : t.home.startPracticing

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">{t.home.title}</h1>
      <p className="mt-2 text-slate-600">{t.home.subtitle}</p>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to={continueHref}
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          {continueLabel}
        </Link>

        {stats && stats.reviewCount > 0 ? (
          <Link
            to="/practice?mode=review"
            className="rounded-md border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50"
          >
            {t.home.todaysReview} ({stats.reviewCount})
          </Link>
        ) : (
          <span className="rounded-md border border-slate-200 px-4 py-2 text-slate-400">
            {t.home.noReview}
          </span>
        )}
      </div>

      {stats && (
        <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-sm font-medium text-slate-500">{t.home.statsHeading}</h2>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {t.home.masteredOf(stats.masteredCount, stats.totalCount)}
          </p>
        </div>
      )}

      {/* Native-app install guides: pointless inside the native app itself, so
          they're hidden there (mirrors the register-sw.ts native-platform gate).
          iOS has no APK equivalent — Safari's "Add to Home Screen" is the only
          install path there, so it gets its own card instead. */}
      {!Capacitor.isNativePlatform() && (
        <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          {isIOSDevice() ? (
            <>
              <IosInstallCard t={t} />
              <AndroidInstallCard t={t} />
            </>
          ) : (
            <>
              <AndroidInstallCard t={t} />
              <IosInstallCard t={t} />
            </>
          )}
        </div>
      )}

      {/* Unlike the install-guide cards above, this is shown inside the
          native app too — someone with the app already installed can still
          hand their phone to a friend and let them scan their way in. */}
      <div className="mt-6 rounded-lg border border-slate-200 px-6 py-5 text-left">
        <h2 className="text-sm font-medium text-slate-500">{t.home.share.heading}</h2>
        <p className="mt-1 text-slate-700">{t.home.share.description}</p>
        <img
          src="/qr.png"
          alt={t.home.share.qrAlt}
          width={200}
          height={200}
          className="mx-auto mt-4 w-full max-w-[200px]"
        />
        <p className="mt-3 text-center text-sm text-slate-500">{SHARE_URL}</p>
      </div>
    </main>
  )
}

function AndroidInstallCard({ t }: { t: Dictionary }) {
  return (
    <div className="rounded-lg border border-slate-200 px-6 py-5">
      <h2 className="text-sm font-medium text-slate-500">{t.home.androidApp.heading}</h2>
      <p className="mt-1 text-slate-700">{t.home.androidApp.description}</p>
      <a
        href="/download/kanakanji.apk"
        download
        className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        {t.home.androidApp.downloadButton}
      </a>
      <p className="mt-3 text-sm text-slate-500">{t.home.androidApp.unknownSourceNote}</p>
      <p className="mt-1 text-sm text-slate-500">{t.home.androidApp.pwaAlternative}</p>
    </div>
  )
}

function IosInstallCard({ t }: { t: Dictionary }) {
  const steps = [t.home.iosApp.step1, t.home.iosApp.step2, t.home.iosApp.step3]
  return (
    <div className="rounded-lg border border-slate-200 px-6 py-5">
      <h2 className="text-sm font-medium text-slate-500">{t.home.iosApp.heading}</h2>
      <p className="mt-1 text-slate-700">{t.home.iosApp.description}</p>
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-700">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )
}
