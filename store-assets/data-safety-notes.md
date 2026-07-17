# Play Console Data Safety — draft answers

Location in Play Console: **App content → Data safety** (questionnaire,
answered manually — nothing is uploaded).

These drafts reflect what the app actually does as of commit `0f7cf2e`
(verified against source: no network calls, no analytics/telemetry SDKs,
no accounts; storage is IndexedDB + localStorage on-device only). The
developer account holder is responsible for the final declaration.

## Overview questions

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** |
| Is all of the user data collected by your app encrypted in transit? | Not applicable — no data is collected or transmitted |
| Do you provide a way for users to request that their data is deleted? | Not applicable in the form once "No" is selected above. (Factually: all data is on-device; uninstalling or clearing app storage deletes everything. There is no server-side copy.) |

Answering **No** to the first question skips the per-category data
sections entirely, and the store listing shows "No data collected" /
"No data shared with third parties".

## Why "No" is the accurate answer

Play's definition of "collected" is data transmitted off the device.
KANAKANJI:

- makes no network requests at runtime (fully offline; the Android build
  bundles all character/dictionary data in the APK/AAB)
- has no accounts or login
- includes no ads, analytics, crash reporting, or tracking SDKs
- stores practice progress (IndexedDB), UI language and last practice
  set (localStorage) **on-device only** — Play explicitly does not count
  on-device-only storage as collection

## Related Play Console items (nearby forms, for convenience)

| Item | Suggested answer |
|---|---|
| App content → Privacy policy | URL to the hosted copy of `PRIVACY.md` (host the file publicly, e.g. the repository's raw GitHub URL, and paste that URL) |
| App content → Ads | This app does not contain ads |
| App content → App access | All functionality is available without special access (no login credentials needed for review) |
| App content → Content ratings questionnaire | Reference/educational app; no user-generated content, no violence, etc. |
| App content → Target audience | Choose per your store strategy; the app has no child-directed features and collects no data either way |
| App content → Data safety → Security practices | No data collected → the security-practices subsection does not apply |
