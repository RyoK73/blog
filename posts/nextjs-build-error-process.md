---
title: Next.jsで環境変数が未設定のときにビルドエラーを発生させる方法
createdAt: "2026-06-11"
category: tech
published: true
---

## はじめに

この記事では、Next.jsにおけるアプリビルドに必須なプロパティを受け取れなかったときのビルドエラーの実装方法について紹介します。

## どういう状況で？

通常、ファイルがない、必要なプロパティがないといった場合、コードの中でエラーハンドリング・フォールバックを実装しますよね？
しかし、そのエラーがアプリビルドにおいて致命的である場合はそもそもビルドできないようにする必要があります。

例えば、当ブログではドメインをenvファイルの`NEXT_PUBLIC_SITE_URL`というプロパティから読み取っています。
ただ、サーバーで設定されていなかったり、ローカルにenvファイルが存在していない場合、当然このプロパティは読み取れません。

そうなった場合、サイトマップやmetadataでURLを正しく設定することができなくなりSEOに重大な悪影響を与えることになります。

## 実装方法

### 本番環境対策

`next.config.ts`にエラーハンドリングを実装します。

```ts
if (
  !process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
}
```

※ `const nextConfig: NextConfig`の外に記述します。

### 開発環境対策

`NEXT_PUBLIC_SITE_URL`を使用するサイトマップやmetadataを利用するファイルに、"http://localhost:3000"へのフォールバックを実装します。

当ブログでは、`app/sitemap.ts`と`app/robots.ts`に実装しました。

```ts
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
```

## おわりに

環境変数で管理するところまではちゃんと実装できていたのですが、エラーハンドリングまでは気が回っていませんでした。

今回の実装で、本番環境でも開発環境でも誤ったURLが生成されなくなり安心です。

それでは...

ヾ('ω'⊂ )))Σ≡ｻﾗﾊﾞ
