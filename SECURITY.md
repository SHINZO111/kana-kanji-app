# Security Policy

## Supported Versions

KANAKANJI is a single continuously-deployed web app (no version branches) plus
a downloadable Android APK built from the same `main`/`master` history. Only
the latest deployed build — [kanakanji.pages.dev](https://kanakanji.pages.dev)
— and the latest APK release are supported. There are no LTS or backported
security fixes for older APK downloads; if you installed an old APK, please
update to the latest one linked from the [README](README.md).

## Reporting a Vulnerability

Please report security vulnerabilities privately using GitHub's
[Private vulnerability reporting](https://github.com/SHINZO111/kana-kanji-app/security/advisories/new)
feature (Security tab → "Report a vulnerability") rather than opening a public
issue. This lets us discuss and fix the issue before any details are public.

If Private vulnerability reporting isn't available to you for some reason,
open a normal GitHub issue with as little sensitive detail as possible and
ask for a private channel to share the rest.

Please include, where relevant:

- A description of the vulnerability and its potential impact
- Steps to reproduce (or a proof-of-concept)
- The affected surface (web app, Android APK, or the data-pipeline/CI
  tooling)

### What to expect

- **Acknowledgement**: within a few days of the report.
- **Triage**: an initial assessment of severity and validity, generally
  within a week.
- **Fix timeline**: depends on severity — critical issues (e.g. anything
  allowing remote code execution, data exfiltration, or bypassing the app's
  offline/local-only data model) are prioritized for a fix as soon as
  practical; lower-severity issues are addressed on a best-effort basis.
- **Disclosure**: coordinated disclosure once a fix is available. Credit is
  given to reporters who want it, in the release notes / advisory.

## Scope

KANAKANJI is a client-side, ad-free, offline-first app: it has no backend,
no user accounts, and no server-side storage of personal data (see
[PRIVACY.md](PRIVACY.md)). The most relevant security surface is therefore:

- The web app's Content-Security-Policy and other HTTP security headers
  (`public/_headers`)
- The integrity of the distributed Android APK (see the SHA-256 checksum
  published alongside each download)
- Supply-chain issues in dependencies (tracked via Dependabot alerts)

Reports about the third-party open data/libraries listed in the in-app
Credits page should generally go to those upstream projects, but feel free to
report here too if you're unsure.

---

## セキュリティポリシー(日本語要約)

KANAKANJIは常時最新版のみをサポートするWebアプリ(+同じソースからビルドするAndroid
APK)です。脆弱性を発見した場合は、公開Issueではなく GitHub の
[Private vulnerability reporting](https://github.com/SHINZO111/kana-kanji-app/security/advisories/new)
(Securityタブ→「Report a vulnerability」)から非公開で報告してください。数日以内に確認し、
重大度に応じて修正します。修正後は協調的開示(coordinated disclosure)を行います。
