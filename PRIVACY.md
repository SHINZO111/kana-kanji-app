# KANAKANJI Privacy Policy

**App:** KANAKANJI (`com.kanakanji.app`)
**Last updated:** 2026-07-17

KANAKANJI is a Japanese character practice app (hiragana, katakana, and
jōyō kanji stroke-order tracing, readings, example words, and spaced
repetition review). This policy describes what data the app handles. The
short version: **KANAKANJI collects no data and sends nothing off your
device.**

## Data collection: none

- KANAKANJI has **no accounts, sign-up, or login** of any kind.
- KANAKANJI makes **no network requests at runtime**. After installation
  it works fully offline; the Android app bundles all character and
  dictionary data inside the app package.
- KANAKANJI contains **no advertising** and no ad SDKs.
- KANAKANJI contains **no analytics, telemetry, crash reporting, or
  tracking** libraries of any kind.
- KANAKANJI requests no sensitive device permissions (no location,
  camera, microphone, contacts, or storage access beyond its own app
  data).

## Data stored on your device only

The app stores a small amount of data locally, on your device, purely so
it can function:

| Data | Where | Purpose |
|---|---|---|
| Per-character practice records (mastery level, attempt counts, spaced-repetition schedule) | IndexedDB (database `kana-kanji-progress`) | Tracks your learning progress and schedules reviews |
| Chosen interface language (English / Español / 中文) | `localStorage` | Restores your language preference |
| Last-used practice set | `localStorage` | Powers the "Continue practicing" shortcut |

This data never leaves your device. It is not transmitted, synced,
backed up to any server, or shared with anyone — there is no server to
send it to.

## Data deletion

Because all data lives on your device, you are in full control:

- **Android:** uninstall the app, or use *Settings → Apps → KANAKANJI →
  Storage → Clear storage*. Either removes all practice data.
- **Web/PWA:** clear the site's data in your browser settings.

There is no server-side copy, so no deletion request process is needed —
nothing exists outside your device to delete.

## Children

KANAKANJI is suitable for general audiences. Because it collects no data
from anyone, it collects no data from children.

## Third-party content licenses

KANAKANJI ships with openly licensed language data and libraries. These
are content licenses only — none of these projects receives any data
from the app:

| Project | License | Used for |
|---|---|---|
| [animCJK](https://github.com/parsimonhi/animCJK) | GNU LGPL v3+ | Kana (hiragana/katakana) stroke data |
| [animCJK / Make Me a Hanzi (via hanzi-writer-data-jp)](https://github.com/chanind/hanzi-writer-data-jp) | Arphic Public License | Kanji stroke-order data |
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) | EDRDG, CC BY-SA 4.0 | Kanji readings, meanings, grades |
| [JMdict](https://www.edrdg.org/jmdict/j_jmdict.html) | EDRDG, CC BY-SA 4.0 | Example vocabulary |
| [Hanzi Writer](https://hanziwriter.org/) | MIT — David Chanin | Stroke animation and trace-quiz engine |

Full attribution is also shown on the in-app Credits page.

## Changes to this policy

If a future version of the app ever changes how data is handled (for
example, adding an optional cloud sync), this policy will be updated
before that version is released, and the change will be reflected in the
Play Store data safety declaration.

## Contact

Questions about this policy: [contact email — set in Play Console]
