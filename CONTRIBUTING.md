# Contributing to KANAKANJI

Thanks for your interest in contributing! Issues and pull requests are both
welcome.

## Getting set up

See [README.md](README.md#getting-started) for cloning, installing
dependencies, and running the app locally (`npm install`, `npm run
build:data`, `npm run dev`).

## Running tests

```bash
npm test          # unit tests (vitest)
npm run test:coverage
npm run test:e2e  # end-to-end tests (playwright)
npm run lint       # oxlint
npm run build      # tsc -b && vite build — also catches type errors
```

Please make sure `npm test`, `npm run lint`, and `npm run build` pass before
opening a pull request. If you're changing behavior that's covered (or
should be covered) by tests, add or update tests alongside the change.

## Reporting issues

When filing a bug, include:
- What you expected vs. what happened
- Steps to reproduce
- Browser/OS (or Android version, if it's the native app)

Feature requests are welcome too — a short description of the problem you're
trying to solve is more useful than a fully-specified solution.

## Translation contributions are especially welcome

KANAKANJI's UI is localized into 12 languages, with dictionaries living as
individual files under `src/lib/i18n/` (e.g. `en.ts`, `ja.ts`, `es.ts`, one
file per language, all implementing the shared `Dictionary` type from
`types.ts`). Several of these — particularly **Hausa, Yoruba, Igbo, and
Vietnamese** — were drafted without a native-speaker review pass and would
benefit enormously from one. If you're a native or fluent speaker of any
supported language and spot phrasing that's awkward, unnatural, or outright
wrong, a pull request against that language's file is very welcome, even for
just a handful of strings.

A few things that make translation PRs easy to review:
- Because every dictionary implements the same `Dictionary` TypeScript type,
  a missing or mistyped key shows up as a **type error** — running `npm run
  build` (or your editor's TypeScript checker) will catch incomplete
  translations before you even open a PR.
- Keep placeholders/interpolation tokens (e.g. `{{count}}`) intact — only
  translate the surrounding text.
- Proper nouns, license names, and URLs in `src/lib/i18n/credit-meta.ts` are
  intentionally language-agnostic and shouldn't be translated; only the
  per-language *description* text in each dictionary's `credits.entries`
  section should change.
- Small, focused PRs (one language, or one section of strings) are easier to
  review than large mixed ones.

## Code style

The project favors small, focused files (see `CLAUDE.md` for the internal
conventions used during development) and TypeScript strictness — `npm run
build` runs a full `tsc` project check, not just a transpile.

---

## 日本語での要約

バグ報告・機能提案・プルリクエストを歓迎します。開発環境のセットアップは
[README.ja.md](README.ja.md#セットアップ) を参照してください。PR を送る前に
`npm test` / `npm run lint` / `npm run build` が通ることを確認してください。

**特に翻訳の改善を歓迎しています。** UI 辞書は `src/lib/i18n/` 以下に言語ごと
のファイル(`en.ts`・`ja.ts`・`es.ts` など)として置かれており、すべて
`types.ts` の共通 `Dictionary` 型を実装しています。中でも**ハウサ語・
ヨルバ語・イボ語・ベトナム語**はネイティブレビューを経ずに作成された下訳の
ため、ネイティブスピーカーの方によるレビュー・修正 PR を特に歓迎します。
翻訳漏れがあれば `Dictionary` 型の型チェック(`npm run build`)でコンパイル
エラーとして検出される仕組みになっているので、キーの抜けを心配せず一部の
文字列だけの修正 PR でも歓迎です。`src/lib/i18n/credit-meta.ts` 内の固有名詞
・ライセンス名・URL は言語非依存のため翻訳不要です(各辞書の
`credits.entries` にある説明文のみが翻訳対象です)。
