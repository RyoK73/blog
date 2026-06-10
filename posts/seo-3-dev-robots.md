---
title: Vercelデプロイを検索結果に乗せるまで - robots.tsの実装 -
createdAt: "2026-06-10"
category: tech
published: true
---

## はじめに

みなさん、ぐんも！

今回は「Vercelデプロイを検索結果に乗せるまで」の第2回目です。
この記事では、`Next.js`プロジェクトにおける**robots.ts**の作り方について解説します。

## robots.tsとは

検索エンジンのクローラーに対して、**サイト内のページに対するクロールの許可を明示するテキストファイル**です。
Next.jsの場合、`app/robots.ts`から自動で`app/robots.txt`を生成します。

### robots.tsのテンプレート

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // userAgentの名称
      allow: "/", // 許可するページのURL
      disallow: "/private/", // 許可しないページのURL
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

### 特定のユーザーエージェントに対して指定したい場合

以下のように指定可能です。

```ts
{
  userAgent: "<user-agent-name>",
  allow: "<allow-page-url>",
  disallow:"<disallow-page-url>"
}
```

### 注意点 robots.txtはあくまで紳士協定！

`robots.txt`自体は検索エンジンのための道案内です。
悪意あるクローラー・Botに対する防護壁ではありません。

もし必要であれば、より強固な対策を講じる必要があります。

## おわりに

さて、次回は[metadataの実装](/blog/tech/seo-4-metadata)を行います！

ヾ('ω'⊂ )))Σ≡ｻﾗﾊﾞ!!
