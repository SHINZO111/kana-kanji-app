# KANAKANJI

ひらがな・カタカナと常用漢字2,136字の書き順・読み・語彙を練習できる、無料・広告なし・完全オフラインの日本語学習アプリです。

[**ライブデモ → kanakanji.pages.dev**](https://kanakanji.pages.dev) &nbsp;|&nbsp;
[**Android APK ダウンロード**](https://kanakanji.pages.dev/download/kanakanji.apk) &nbsp;|&nbsp;
[**GitHub Releases から APK**](https://github.com/SHINZO111/kana-kanji-app/releases/latest/download/kanakanji.apk)

APKダウンロードは
[SHA-256チェックサム](https://kanakanji.pages.dev/download/kanakanji.apk.sha256)
で検証できます(サイト上のダウンロードカードにも同じ値を表示しています)。

English README: [README.md](README.md)

<p align="center">
  <img src="store-assets/screenshots/01-home.png" width="30%" alt="KANAKANJI ホーム画面" />
  <img src="store-assets/screenshots/04-character-detail.png" width="30%" alt="書き順を表示する文字詳細画面" />
  <img src="store-assets/screenshots/05-practice.png" width="30%" alt="なぞり書き練習画面" />
</p>

## 特長

- **なぞり書き学習** — 一画ずつなぞりながらリアルタイムで正誤判定
  ([Hanzi Writer](https://hanziwriter.org/) を使用)
- **書き順番号表示** — すべてのかな・漢字でアニメーション表示・ステップ表示の両方に対応
- **間隔反復(SRS)** — 練習結果から文字ごとの習熟度スケジュールを自動計算し、
  復習が必要な文字を優先的に出題
- **UI 12言語対応** — 英語・スペイン語・フランス語・インドネシア語・日本語・
  韓国語・ポルトガル語・ベトナム語・中国語など完全ローカライズ
  (`src/lib/i18n/` 参照)
- **フルカバレッジ** — ひらがな・カタカナ92字 + 常用漢字2,136字すべてを
  読み・例文語彙付きで収録
- **完全オフライン動作** — PWA または Android アプリとしてインストール可能。
  文字データは事前にすべて同梱/キャッシュ済みで、初回読み込み後はネットワーク通信不要
- **広告・トラッカー・アカウント登録なし** — 進捗はすべて端末内(IndexedDB)に
  保存され、外部に送信されることはありません

## セットアップ

```bash
git clone https://github.com/SHINZO111/kana-kanji-app.git
cd kana-kanji-app
npm install
npm run build:data   # public/data/ を生成(かな・漢字・索引・書き順データ)
npm run dev           # http://localhost:5174
```

`npm run build:data` は KANJIDIC2/JMdict および書き順データの元データを
ダウンロードするため、初回は数分かかることがあります。各ステップの詳細は
下記「データパイプライン」を参照してください。元データに変更がない限り
日常の開発では `npm run dev` だけで十分です。

その他のコマンド:

```bash
npm run build     # プロダクションビルド -> dist/
npm test          # ユニットテスト(vitest)
npm run test:e2e  # E2Eテスト(playwright)
npm run lint       # oxlint
```

## データパイプライン

アプリの文字データ(`public/data/`)は `data-pipeline/` 以下のスクリプトで
生成されており、手書きではありません(ひらがな・カタカナ92字の定義とローマ字
表記のみ `data-pipeline/lib/kana-table.mjs` に手書きされています)。

| スクリプト | 内容 |
|---|---|
| `npm run data:download` | EDRDG から KANJIDIC2・JMdict_e をダウンロード・展開し `data-pipeline/raw/`(gitignore対象)に保存 |
| `npm run data:kana` | 手書きのかなテーブルから `public/data/kana.json` を生成 |
| `npm run data:kanji` | KANJIDIC2 をパースし、常用漢字ごとに `public/data/kanji/{codepoint}.json` を生成 |
| `npm run data:words` | JMdict_e をストリーム処理し、各漢字に最大5件の例文語彙(優先度タグ付き)をマージ |
| `npm run data:strokes` | すべてのかな・漢字について `public/data/strokes/{codepoint}.json`(gitignore対象)を生成 |
| `npm run data:index` | Browse/検索で使う軽量な統合インデックス `public/data/index.json` を生成 |
| `npm run data:check-strokes` | 書き順データが欠けている文字がないか検証 |

`npm run build:data` は上記すべてを順番に実行します。

**書き順データの出典について(要約):** 漢字の書き順データは
[`hanzi-writer-data-jp`](https://github.com/chanind/hanzi-writer-data-jp)
の GitHub リポジトリから取得しています(公開されている npm パッケージには
スタブファイルしか含まれておらず、実データはリポジトリを直接ダウンロードして
取得する必要があります)。このデータセットにはひらがな・カタカナが含まれて
いないため、かなの書き順データは代わりに
[KanjiVG](https://kanjivg.tagaini.net/) の SVG から生成しており、変換には
[Moritz72/KanjiVGToHanziWriterConverter](https://github.com/Moritz72/KanjiVGToHanziWriterConverter)
(MIT)を移植したスクリプトを使用しています。2010年改定常用漢字のうち一部の
異体字はデータセットに正確な字体で存在しないため、見た目がほぼ同一の通用字体
で代替しています(詳細は `data-pipeline/build-strokes.mjs` の
`VARIANT_FALLBACK` を参照)。

`data-pipeline/raw/` と `public/data/strokes/` は生成物のため gitignore
対象です。`public/data/kana.json`・`public/data/kanji/*.json`・
`public/data/index.json` はリポジトリにコミットされています(合計約2.3MB)。

## Android ビルド

Android アプリは [Capacitor](https://capacitorjs.com/) を使い、Web版と
同じビルドをラップしたネイティブシェルです。

**前提条件:** Node.js/npm、JDK 17以上、Android SDK(Platform 36 +
対応する Build-Tools + Platform-Tools。
[Android Studio](https://developer.android.com/studio) の SDK Manager
経由が簡単です)。Gradle には `ANDROID_HOME` 環境変数か
`android/local.properties`(`sdk.dir=...`、gitignore対象)で SDK の場所を
指定してください。

```bash
npm run android:sync    # npm run build && npx cap sync android
npm run android:build   # android:sync 実行後 gradlew assembleDebug
```

デバッグ APK は `android/app/build/outputs/apk/debug/app-debug.apk` に
出力されます。リリース署名は `android/app/build.gradle` に組み込まれており、
gitignore 対象の `android/keystore.properties` を参照します(想定フォーマット
は同ファイル内のコメントを参照)。keystore がない場合、リリースビルドは
未署名にフォールバックします(デバッグビルドには影響しません)。

## データソースとライセンス

KANAKANJI 自体のソースコードは MIT ライセンスです([LICENSE](LICENSE) 参照)。
同梱されている文字・辞書データはそれぞれ独自のライセンスを持ち、MIT の
許諾範囲には**含まれません**。

| データソース | 用途 | ライセンス |
|---|---|---|
| [animCJK](https://github.com/parsimonhi/animCJK) / Make Me a Hanzi (経由: [`hanzi-writer-data-jp`](https://github.com/chanind/hanzi-writer-data-jp)) | 漢字の書き順データ | Arphic Public License / GNU LGPL v3+ |
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) | 漢字の読み・意味 | EDRDG, CC BY-SA 4.0 |
| [JMdict](https://www.edrdg.org/jmdict/j_jmdict.html) | 例文語彙 | EDRDG, CC BY-SA 4.0 |
| [Hanzi Writer](https://hanziwriter.org/) | 書き順描画・アニメーションライブラリ | MIT |

この表は `src/lib/i18n/credit-meta.ts`(アプリ内 Credits ページの正データ)
と対応しています。内容に相違があれば、そちらを正としてください。

## Contributing

バグ報告・機能提案・プルリクエストを歓迎します。詳細は
[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください(翻訳修正の送り先も
記載しています)。

## ライセンス

コード: [MIT](LICENSE)。同梱データ: 上記「データソースとライセンス」を参照。

---

English README: [README.md](README.md)
