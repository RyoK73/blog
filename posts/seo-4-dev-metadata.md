---
title: Vercelデプロイを検索結果に乗せるまで - metadataの実装 -
createdAt: "2026-06-10"
category: tech
published: true
---

## はじめに

今回は「Vercelデプロイを検索結果に乗せるまで」の第4回目です。
この記事では、metadataに関する設定について解説します。

## metadataとは

HTML上で`<head>`要素に含まれる`title`や`description`などのそのページがどういうものかを定義するパラメータです。
HTMLでは`<head>`タグ内で定義しますが、Next.jsでは`metadata`関数を定義することで自動的に生成されます。

## Next.jsでのmetadataの実装方法

各`page.tsx`に以下の関数を置きます。

```tsx
export const metadata: Metadata = {
  title: "タイトル",
  description: "説明",
};
```

## おわりに

4回にわたる「Vercelデプロイを検索結果に乗せるまで」シリーズ、お疲れ様でした。

このシリーズを通してブログが検索エンジンから見つけられるようになったはずです。

それでは... ($・・)/~~~
