---
title: NeoVimで意味のわからないSnippet候補を無効化する方法
createdAt: "2026-06-05"
category: tech
published: true
---

## 問題のやつ

```ts
ts
↳task5~
↳task~
↳task2~
...

```

こういう候補・補完が出てきていた。

どこで使うかもわからないし、はっきり言って書くたびにESCを押さないといけないのがストレスフル

んで30分格闘した結果、`friendly-snippets`が原因じゃないか...と判明したものの、
LazyExtrasの`● coding.blink  blink.cmp  friendly-snippets  blink.compat  catppuccin`がオフにできないという問題が発生

なので`nvim/lua/plugin`から無理やり無効化することに...

```lua
  { "rafamadriz/friendly-snippets", enabled = false },
```

これを書いて、無事解決

NeoVimはこういう設定をいじくり回さなきゃいけないからめんどくさいなと感じます orz
