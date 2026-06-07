---
title: teispace/next-themesを使用するときの注意点
createdAt: "2026-06-07"
category: tech
published: true
---

## おさらい

[以前の記事](/blog/tech/fix-react19-next-themes-error)で紹介した[@teispace/next-themes](https://www.npmjs.com/package/@teispace/next-themes)
[next-themes](https://github.com/pacocoursey/next-themes/)との違いは、React19の`<script>`の扱いに対応しているかどうか

### next-themes

- React19以前の仕様に準拠
  React19以降の開発では*Console Error*が発生する。
- `storage="local"`がデフォルト。初期設定でCookieを使用しない。

### @teispace/next-themes

- React19の仕様に準拠
  React19以降の開発でも*Console Error*が発生しない。
- `storage="hybrid"`がデフォルト。初期設定でCookieを使用する。
- `attribute="data-theme"`がデフォルト(**New!!**)

## attribute="data-theme"

これは`<ThemeProvider>`のthemeを指定するための属性を指定するオプションです。
従来の`next-themes`の場合、`attribute="class"`がデフォルトでした。

しかし、*teispace/next-themes*を使用する場合、`attribute="data-theme"`がデフォルトとなります。
そのため、Tailwind CSSを利用している場合、themeの指定方法に違いが発生します。

**結果的に、ダークテーマが無効化されてしまうこともあります。**

### data-themeとは？

HTML5より`data-*`でカスタム属性を追加することができるようになりました。

```html
<html data-theme="dark"></html>
<div data-user-id="123"></div>
<button data-loading="true"></button>
```

```css
[data-theme="dark"]{...}
[data-loading="true"]{...}
```

```js
document.documentElement.dataset.theme; // デフォルト:"dark"
document.documentElement.dataset.theme = "light";
```

htmlの属性追加が可能になりました。

### 記述方法 : attribute="class"の場合

```ts
<ThemeProvider
  ...
  attribute="class"
```

```css
@custom-variant dark (&:is(.dark *));
```

### 記述方法 : attribute="data-theme"の場合

```ts
<ThemeProvider
  ...
  attribute="data-theme"
```

```css
@custom-variant dark (&:is([data-theme="dark"] *));
```

## 最後に

ご利用の際はご注意を〜〜 ﾉｼ
