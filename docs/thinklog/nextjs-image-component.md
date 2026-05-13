---
date: 2026-05-14
tags: [next-image, tailwindcss, magic-number, static-assets, header]
---

# Next.js の画像コンポーネント設計

## 背景・問題意識

Header コンポーネントの `<img src="../../app/topImage.png">` という書き方が正しいのか疑問に思ったことがきっかけ。

## 出た案・選択肢

- 相対パス (`../../app/topImage.png`) で `<img>` タグを使う（現状）
- `public/` に移して `next/image` の `<Image>` コンポーネントで参照する
- `width` / `height` を固定値で指定する
- `rounded-full` + `object-cover` で丸形アイコンにする

## 反論・懸念点

- `width={64}` のような固定値はマジックナンバーになるのでは？
- Tailwind でも `p-4` など数値指定しているのに、今さら気にすることか？

## 決定・方向性

- 静的画像は `public/` に置き、`<Image>` コンポーネントで参照する
- `src/app/` の `favicon.ico` は Next.js の特別ルール。通常の画像とは別物
- `width={64} height={64}` を設定し、ビヨーン問題を解消
- マジックナンバーの是非は「読んだ人が困るか？」が実用的な判断基準。一箇所で文脈が明確ならば過度な抽象化は不要
- 丸形切り抜きは `rounded-full` + `object-cover` で対応可能

## 積み残し・次のアクション

- 丸形切り抜きの実装確認（`rounded-full` + `object-cover` を実際に適用）
