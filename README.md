# ソク計算

入力したらすぐ結果がわかる、日本語の無料計算ツール集です。現在 54 種類を収録しています。

ツールは `lib/tools.ts` に1行追加するだけで、タイトル・トップページ・サイトマップの「◯種類」表示に自動反映されます（解説ガイドは `lib/guides.ts` に追記します）。

## 主なツール

- 年収手取り計算
- ふるさと納税上限額計算
- 消費税計算
- 積立投資計算
- パーセント計算
- 年齢計算
- BMI計算
- 住宅ローン計算
- 電気代計算

## 開発

```bash
npm install
npm run dev
```

開発サーバーは通常 `http://localhost:3000` で起動します。

## ビルド

```bash
npm run build
```

## 技術スタック

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## SEO

`robots.txt` と `sitemap.xml` は Next.js の Metadata Routes で生成しています。
