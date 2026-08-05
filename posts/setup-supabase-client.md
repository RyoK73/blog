---
title: Next.jsのSupabase Clientの設定方法
createdAt: "2026-08-05"
category: tech
published: false
---

## はじめに

この記事は、はじめてNext.jsプロジェクトでSupabaseを使ったアプリを開発する人向けの記事です。

**この記事で得られるもの**

- Supabase Clientの作成方法
- クライアント用・サーバー用のSupabase Clientの違い

**この記事で得られないもの**

- Supabaseの基本概念

> [Supabaseの基本とCLIの使い方](/tech/beginner-supabase)で詳しく解説しています。

## Supabase Clientとは？

通常、databaseを持つアプリケーションを開発する場合、以下のような処理を実装する必要があります。

- SQLでのアクセス
- 認証・セッション管理
- トークンの保持
- リクエストに対するセキュリティチェック

Supabaseを使うときはこれらを自分で実装する必要がありません。
`Supabase Client`というアプリとSupabase DBのアクセスを仲介するインスタンスを作成することにより、多くの処理を実装せずに開発を進めることができます。

## 設定手順

### 必要なライブラリのインストール

```bash
pnpm add @supabase/ssr @supabase/supabase-js
```

### 環境変数の設定

SupabaseDBへのアクセスには、*SupabaseプロジェクトへのURL*と*SupabaseDBへのANON key*が必要になります。

> ANON keyは、RLSを介してアクセスする際に必要になるものです。

その2つをローカル環境・サーバー環境どちらからでも読み込むために`.env`を作成し、`process.env`オブジェクトを介してKEYを取得します。

> Next.jsはビルド時に、プロジェクトルートにある`.env`のKEYをプロパティとして持つ`process.env`オブジェクトを自動で生成します。
> 詳しくは [Next.jsの環境変数についてprocess.envとNEXT_PUBLICを解説](/tech/nextjs-process-env-and-nextpublic-prefix)を参照してください。

プロジェクトルートに`.env.local`を作成します。

```env
NEXT_PUBLIC_SUPABSE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABSE_ANON_KEY="xxxxxxxxxxx"
```

- `SUPABASE_URL`:
  - プロジェクトダッシュボードの左上に表示されています。(26.8.5現在)
  - もしくは`https://"Project ID".supabase.co`でもOK
    ProjectIDについては[Supabaseの基本とCLIの使い方](/tech/beginner-supabase)を参照してください。
- SUPABASE_ANON_KEY:
  - *Project Setting > API Keys > Publishable key*から作成・取得可能です。

*NEXT_PUBLIC*接頭辞については次項で解説します。

> 本記事の`.env`のKEYは[Supabaseの命名](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs#5-declare-supabase-environment-variables)に従っています。

### Supabase Clientの作成

#### クライアントコンポーネント用

厳密に言えば、
*クライアントコンポーネント用*ではなく、
*サーバーと通信せずにSupabaseDBへアクセスする処理用*のSupabase Clientです。

その最たる例がクライアント側でレンダリング・再レンダリングされるクライアントコンポーネントです。

`lib/supabase/client.ts`として作成

```ts
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
```

クライアント(ブラウザ)がcookieの読み書きを担当するため、Supabase Client自体にその機能をもたせる必要はありません。

#### サーバー用

サーバーコンポーネント用ではないことに注意してください。

クライアント(ブラウザ)とSupabase Clientの間にサーバーの処理が挟まる場合こちらを使用します。

例えば、ログイン処理によってユーザーごとのログインページのサーバーコンポーネントを返す場合が挙げられます。

`lib/supabase/server.ts`として作成

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // server componentから呼ばれた場合は無視
          }
        },
      },
    },
  );
};
```

サーバーとの処理の中にも2つ種類があり、それぞれでcookieへの対応方法が異なります。

1. Route HandlerやServer Actionなどレンダリングを伴わない処理
   `cookies`オブジェクトの`getAll`,`setAll`メソッドが使用されます。

1. サーバーコンポーネントの更新などレンダリングを伴う処理
   `cookies`オブジェクトの`getAll`メソッドのみ使用されます。
   サーバーコンポーネントはストリーミングSSRのため、レンダリング中にSet-Cookieヘッダーを書き換えることができません。
   その制約により`setAll`を使用することができないため、エラーを`catch`してもなにも処理せず無視しています。

   ただし、サーバーコンポーネントの更新でのCookieの更新の処理自体は実装する必要があるため、middleware.tsを作成するという流れになります。

   > cookieとmiddlewareに関しては[Next.js Supabase構成におけるcookieとmiddlewareの扱い方](/tech/supabase-client-cookie-middleware)で詳しく解説しています。

ToDo: middlewareの実装について、ログイン処理の記事を引用する

### Supabase Clientの呼び出し

```ts
import { createClient } from "@/lib/supabase/server.ts";

const supabase = await createClient();
const { data } = await supabase.from("items").select();
```

## つまずきポイント

### `!`について

`process.env.NEXT_PUBLIC_SUPABASE_URL!`のように、`!`を末尾に付与しています。
TypeScriptでは、変数の中身がnullになることがあります。
`!`をつけることで、コンパイラにその変数が`null`ではないことを明示することができます。
ただし、この影響でその変数に対して`null`かどうか検証されなくなることは留意しておきましょう。

### `cookies`オブジェクトの`getAll`,`setAll`の厳密な役割

一見、ブラウザのCookieそのものを読み書きしているように思えますが、
これらはHTTPSリクエスト・レスポンス内のCookieの読み取り、更新しか行えません。

サーバーはブラウザとは別のマシン・プロセスで動いているため、物理的にブラウザのCookieを更新することは不可能です。

いかなる場合においても、Cookieを更新できるブラウザだけです。

## おわりに

さて、フロントエンドのみの実装から打って変わり、HTTPS通信の仕組みやNext.js固有の特徴などかなりコアな処理に入ってきました。
しかし、最初に受けた印象とは裏腹に一度理解してみれば、明快でわかりやすい仕組みであることに気づきます。

ぜひ、DBを利用することを恐れず、皆さんのアプリでも試してみてください。
