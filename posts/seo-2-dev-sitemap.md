---
title: Vercelデプロイを検索結果に乗せるまで - sitemap.tsの実装 -
createdAt: "2026-06-10"
category: tech
published: false
---

## はじめに

みなさん、ぐんも！

今回は「Vercelデプロイを検索結果に乗せるまで」の第2回目です。
この記事では、`Next.js`プロジェクトにおける**サイトマップ**の作り方について解説します。

## サイトマップとは

検索エンジンやbot等クローラーに対して、このWebサイトがどんなページを持ってるかを示す地図

通常はXMLで出力されますが、`Next.js`の場合`app/sitemap.ts`にWebサイト内のページ情報の配列を返す`sitemap`関数を記述するだけでOKです。

### `app/sitemap.ts`のテンプレ

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

### このブログの場合

以下のようになりました。

```ts
import { MetadataRoute } from "next";
import { getAllPostData } from "@/lib/post";

export const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // 記事一覧を取得
  const posts = await getAllPostData();

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.updatedAt ?? post.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const categoryEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.category}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [
    { url: `${baseUrl}`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    ...categoryEntries,
    ...postEntries,
  ];
};

export default sitemap();
```

`map`の中でだけ、`changeFrequency`に`as const`を付与しています。
これは、`map`で定義されたときだけ*リテラル型*ではなく`string型`を返してしまうためです。

リテラル型については[こちらの記事](/blog/practice-numeric-separator)をどうぞ！

※ `getAllPostData()`は以下のオブジェクトの配列を返します。

```ts
export type PostData = {
  slug: string;
  title: string;
  createdAt: string;
  category: string;
  markdown: string;
  published: boolean;
  updatedAt?: string;
};
```

> 戻り値として、`url`は必須ですが、その他はoptionalです。
> というのも[Google検索エンジンは`priority`と`changeFrequency`は無視しており、`lastModified`は正確である場合のみ読み取るからです](https://support.google.com/webmasters/thread/118121043/%E3%82%B5%E3%82%A4%E3%83%88%E3%83%9E%E3%83%83%E3%83%97%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F?hl=ja)

## Google Search Consoleにsitemapを送信する

[Google Search Console](https://search.google.com/search-console/welcome?hl=ja)に`https://<your-domain>/sitemap.xml`を送信しましょう。

### ドメインを入力する

- mainにマージして挙動確認してから記述する
