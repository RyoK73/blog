---
title: Next.jsの環境変数についてprocess.envとNEXT_PUBLICを解説
createdAt: "2026-08-05"
category: tech
published: false
---

## はじめに

この記事はNext.jsプロジェクトで環境変数(`.env`)周りの挙動を理解したい人向けの記事です。

この記事で得られるもの

1. Next.jsの環境変数と`process.env`の関係性
2. `NEXT_PUBLIC`接頭辞の役割

## Next.jsではビルド時にprocess.envオブジェクトを生成する

例えば`.env.local`に以下のように記述します。

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="yyyyy"
```

このとき、スクリプトからは以下のように上記環境変数を参照することができます。

```ts
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
// https://xxxx.supabase.co
```

### processとは？

Noede.jsのプロセス全体の情報を扱うオブジェクトのことです。

> ![公式サイト](https://nodejs.org/api/process.html)

環境変数が設定されている場合、`process.env.KEY`で環境変数を取得できるようになります。

### Next.jsによる環境変数の設定

Next.jsはビルド時にプロジェクトルートに存在する`.env*`(ex.`.env.local`,`.env.development`)から`process.env`オブジェクトを**自動で生成**します。

例えば...

`.env.local`に以下を記述

```env
DEV_KEY="DEV_KEY_DAYO"
```

↓

```ts
console.log(process.env.DEV_KEY); // DEV_KEY_DAYO;
```

### `NEXT_PUBLIC`接頭辞でブラウザ側でも環境変数を読めるようにする

上記、`process.env`はNode.jsのオブジェクトであるため、ブラウザ側では参照できません。(同じNode.js環境で実行されてない只のHTMLだから)

そこで、Next.jsはビルド時に、`NEXT_PUBLIC`接頭辞のついた環境変数をブラウザ側のインラインコードに文字列として置換します。
それにより、ブラウザ側からも`NEXT_PUBLIC`接頭辞ありの環境変数は読み込むことができるわけです。

つまるところ、クライアント側だけでその*KEY*を使って処理したい場合`NEXT_PUBLIC`化するというわけです。

```ts
// ビルド前のソースコード
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ビルド後にブラウザに配信されるJSファイル内のコード
const url = "https://xxxx.supabase.co";
```

ただし、インライン化する = ブラウザ側に公開されるということに注意してください。

公開しても問題ないKEYにだけ`NEXT_PUBLIC`を付与してください。

例えばSupabaseの場合、

✅️良い

- supabase anon key
- supabase url

❌️ダメ

- supabase service role key

## さいごに

普段使うシェルスクリプトだと`Source`で毎度環境変数を読み込むか、`.zshrc`に追加する...など環境変数を読み込む処理を記述する必要がありました。

その点、Next.jsは環境変数用のオブジェクトが用意されていることが便利であったと同時に、最初は戸惑いました。

よくわからないまま使うのではなく、理解してから使えるようにしていきたいですね。

この記事がみなさんの理解の深化につながれば幸いです。
