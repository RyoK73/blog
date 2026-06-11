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
HTMLでは`<head>`要素内で定義しますが、Next.jsでは`metadata`関数を定義することで自動的に生成されます。

また、`openGraph`というリンク先で表示される見た目を定義するものもあります。
今回は説明を割愛しますが、また別の記事で紹介したいと思います。

## Next.jsでのmetadataの実装方法

各`page.tsx`に以下の関数を置きます。

### 静的metadata

特定のページに対しては値が決まっている静的なmetadata定数を定義します。

```tsx
export const metadata: Metadata = {
  title: "タイトル",
  description: "説明",
};
```

### 動的metadata

ブログ記事のような`[slug]`に配置する`page.tsx`は、記事ごとの`slug`によって`<head>`要素の内容が変わります。
そのため、動的にmetadataを生成するため`generateMetadata`関数を定義します。

```tsx
// app/blog/[category]/[slug]/page.tsx
export const generateMetadata = async ({
  params,
}: {
  params: Promise<Props>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return {
    title: postData.title,
    description: postData.description,
  };
};

// getPostData関数は以下のPostDataオブジェクトを返します。
export type PostData = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  category: string;
  markdown: string;
  published: boolean;
  updatedAt?: string;
};
```

また、ここで`description`として利用するために記事コンテンツをmd記法を置換した文字列に変換する処理も実装しました。

```ts
const description =
  postData.content
    .replace(/^---[\s\S]*?---/, "") // frontmatterを除去
    .replace(/#+\s.+$/gm, "") // 見出し
    .replace(/\n{2,}/g, "") // 改行を削除
    .replace(/\*\*|__|~~|`/g, "") // 装飾
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // リンク→テキストだけ残す
    .trim()
    .slice(0, 120) + "...";
```

## おわりに

4回にわたる「Vercelデプロイを検索結果に乗せるまで」シリーズ、お疲れ様でした。

改めて4回の内容を振り返ります。

1. 独自ドメイン/環境変数の設定
2. Next.jsでのサイトマップの生成方法
3. Next.jsでのrobots.tsの設定
4. metadataの静的/動的な設定方法

今回、改めてドメイン・DNSへの理解を深めることができました。
正直、今回までドメインという用語だけ知ってるような状態でした(・・;)

また、metadataの設定、特に`description`の生成処理の実装により、
記事リストへのサマリー追加など別機能の実装にもつながり、より一層ブログをアップグレードすることができました。

2,3のサイトマップ・robots.tsに関しては、完全に初見だったにもかかわらず簡単に実装できたので、Next.js様様だなと感じています。

次回は`openGraph`を記事から動的に生成するコンポーネントについて書く予定です。

それでは... ヾ('ω'⊂ )))Σ≡ｻﾗﾊﾞ
