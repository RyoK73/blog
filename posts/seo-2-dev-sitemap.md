---
title: Vercelデプロイを検索結果に乗せるまで 2 - sitemap.tsの実装 -
createdAt: "2026-06-10"
category: tech
published: true
updatedAt: "2026-06-12"
---

## はじめに

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
import userCategory from "@/user-category.json";

const categories = Object.keys(userCategory);

export const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // 記事一覧を取得
  const posts = await getAllPostData();

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.updatedAt ?? post.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/blog/${category}`,
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

export default sitemap;
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

### URLプレフィックスを入力する

![プロパティタイプの登録画面](/seo-2-select-url-prefix.jpg)

**URL プレフィックス**へ`https://<your-domain>/`を入力します。

今回は当ブログの`https://ryok73.dev/`を入力しました。

確認状態をチェックしています。というダイアログが表示された後、**所有権の確認**に移ります。

### 所有権の確認

そのWebサイトの所有権を証明する必要があります。
方法は以下の5種類

1. HTMLファイルのアップロード
2. HTMLタグの埋め込み
3. Googleアナリティクスアカウントでの設定
4. Googleタグマネージャーでの設定
5. DNSレコードの紐づけ

> 詳しくは[Search Console ヘルプ](https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-%E3%82%BF%E3%82%B0)へ

今回は*2 HTMLタグの埋め込み*で所有権の確認を行います。

[Vercelデプロイを検索結果に乗せるまで - metadataの実装 -へのリンク](/tech/seo-4-dev-metadata)で紹介する`metadata`オブジェクトに`verification`プロパティを追加します。

```tsx
export const metadata: Metadata = {
  ...,
  verification: {
    google: "<verification code>",
  },
};
```

`"<verification code>`はHTMLタグとして画面に表示されるmetaタグの`content=`の文字列です。
`<meta name="google-site-verification" content="verification code" />;`

その後、所有権の確認が完了すると設定ページへ遷移します。

### サイトマップの登録

> インデックス作成 > サイトマップ

![sitemapの送信画面](/seo-2-sitemap-register.jpg)
**新しいサイトマップの追加**にて`sitemap.xml`を入力して送信すると、登録完了です。

これで数日すれば、Googleのクローラーがあなたのページを見に来ることでしょう。

## おわりに

複雑に見えますが、基本的にテンプレート通りに記述すれば簡単に実装できますね。
テンプレートに使用する関数もブログ構築時に作成してあったため、作業が少なくて済みました。

さて、次回は[robots.tsの設定](/blog/tech/seo-3-dev-robots)を行います！

ヾ('ω'⊂ )))Σ≡ｻﾗﾊﾞ!!
