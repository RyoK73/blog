---
title: next-thmesのConsole Errorを解決する方法
createdAt: "2026-06-06"
category: tech
published: true
---

## どういうErrorなのか？

![NextThemeProvider's Error](/fix-react-19-next-themes-error-1.png)

### React18以前

`<script>`タグをJSX内に書いてもだまって無視されていたらしいです。
(私はReact19以降しか知らないため伝聞です)

そのためshadcn/uiの`NextThemeProviderコンポーネント`などもその仕様に従っています。

### React19(2024年12月リリース)

しかし、React19アップデートを機にJSX内の`<script>`の扱いが変わりました。`async`をつければ、JSX内でも`<script>`を記述できるようになりました。

```jsx
function MyComponent() {
  return (
    <div>
      <script async={true} src="my-script.js"></script>
      Hello World
    </div>
  );
}
```

同時に、`async`なしの`<script>`に対してはちゃんと警告が出るようになりました。
そのため、冒頭のようなエラーが出るというわけです。

### 問題となる点

問題は、next-themesがこのReact19の変更に対しメンテナンスがされていないことです。
実際に[BugとしてIssue](https://github.com/pacocoursey/next-themes/issues/387)もありますが、PRでFixされていません。

現在のところ、[next-themes](https://github.com/pacocoursey/next-themes/issues/387)は2025年5月から一度も新規リリースを行っていません。

### 解決策

上記Issueにもある通り、next-themesのフォークライブラリ[@teispace/next-themes](https://www.npmjs.com/package/@teispace/next-themes)を導入します。

1. CLIでのライブラリの入れ替え

```bash
pnpm remove next-themes
pnpm add @teispace/next-themes
pnpm i # 必要に応じて
```

2. コードの修正

```ts
import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";
import { useTheme } from "@teispace/next-themes";
```

これだけでOKです。

### 注意点

[@teispace/next-themes](https://www.npmjs.com/package/@teispace/next-themes)は`storage`の利用がデフォルトで`hybrid(localStorage + Cookie)`に変わっています。

```md
> Hybrid cookie + localStorage storage, typed themes, View Transitions, scoped sub-trees, Tailwind v4 preset, zero-FOUC SSR, codemod from `next-themes`.

※ node_modules/@teispace/next-themes/README.mdより抜粋
```

そのため、Cookieの使用を避ける場合、以下のように`<ThemeProvider>`に`storage = "local"`の指定が必要です。

```tsx
  <ThemeProvider attribute="class"
    ...
    storage="local"
  >
```

それではよきnext-themesライフを！
