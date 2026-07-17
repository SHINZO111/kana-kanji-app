# KANAKANJI プロジェクト規約

日本語文字練習アプリ「KANAKANJI」(Web + Android, React + Vite + TypeScript)。
実装計画はこのリポジトリ外(ローカルのプランニング資料)で管理。

## Sonnetへの指示

- フェーズ順に実装し、各フェーズ末尾の検証を通過してから `feat: phase N ...` 形式でコミット
- 技術選定(hanzi-writer等)は本計画から変更しない。困ったら代替を探すのではなく計画のフォールバックに従う
- ファイルは小さく分割(1ファイル400行以内目安)。データ取得系は hooks に、ストレージは lib/progress-store.ts に集約
- UI文字列は `src/lib/constants.ts` に集約(将来のi18nのため)
- 検証はブラウザプレビュー(モバイル幅375pxのタッチ確認含む)+ `npm run build` を必ず実施
