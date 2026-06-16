---
title: Vercelデプロイを検索結果に乗せるまで 1 - 独自ドメイン/環境変数の設定 -
createdAt: "2026-06-10"
category: tech
published: true
---

## はじめに

Next.js + Vercelでブログを作ってみたものの"dev活"と検索しても検索結果に出てきませんでした...orz
なぜなら、検索結果に表示させるための様々な設定を行っていなかったからです。

そこで今回から4回に分けて、ブログ作成初心者向けにVercelデプロイを検索結果に乗せるための準備を解説していきます。

題して「Vercelデプロイを検索結果に乗せるまで」

このシリーズでは、以下を順に解説します。

1. 独自ドメイン/環境変数の設定
2. `sitemap.ts`の実装
3. `robots.ts`の実装
4. `metadata`の実装

## 独自ドメインを取得する

現在のブログのドメインは、Vercelで自動で割り当てられた`vercel.app`です。
このドメインを独自ドメインに変更する必要があります。

### 理由

#### 1. 検索エンジンから自分のブログとして評価を受けられない

この*vercel.app*というドメインは、VercelでデブロイされたあらゆるWebサービスに割り当てられています。
そのため検索エンジンが評価するのも、このブログただ一つだけでなくその無数のVercelアプリ群となります。

#### 2. ドメインオーソリティが育たない

> ドメインオーソリティ(DA)とは、そのWebサイトが検索エンジンからどの程度評価されているかを示す指標です。
> Googleの場合、[ページへの被リンク数やリンクの質を評価する基準を設けているらしい](https://webtan.impress.co.jp/g/%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E3%82%AA%E3%83%BC%E3%82%BD%E3%83%AA%E3%83%86%E3%82%A3)です。

基本的にWebサービスは他のWebコンテンツからのリンクによってアクセスされます。
そのため、このブログを利用してもらうには、このブログにアクセスしてもらい、如何に評価されるようになるかが重要になります。

その**ブログに対する評価**が`vercel.app`のままだと、`vercel.app`のドメインを持つすべてのアプリに対して分散されてしまいます。

自分のブログの評価として受け取るためには、自分のドメインを設定する必要があります。

#### 3. ユーザー認知が低下する

例えば、`eight-twelve-five.vercel.app`と`myblog.com`であればどちらのほうがURLとして信頼しやすいでしょうか？
ユーザー視点で見たとき、`eight-twelve-five.vercel.app`よりも`myblog.com`のほうが記憶に残りやすく、アクセスされやすいです。

#### 4. 将来のホスティング移行で検索エンジン資産がリセットされる

もし今後、このブログをホスティングサービスをvecelからAWSやCloudflare Pagesに移行する場合、`vercel.app`のドメインは持っていけません。

Vercelのアプリじゃなくなるからです。
独自ドメインを設定しておけば、そのドメインに対する評価も移行できます。

### 取得方法

今回は[Cloudflare Register](https://domains.cloudflare.com)を利用しました。
更新料が年次で増加せず、ダッシュボードが非常に見やすかったからです。

[お名前.com](https://www.onamae.com/),[エックスサーバー](https://www.xdomain.ne.jp/column/get-domain/),[ムームードメイン](https://muumuu-domain.com/)...など色々ありますのでお好みでサービスを選んでください。

> Cloudflare Registerは、何年経っても更新料が同じなのでオヌヌメです！

## 独自ドメインを設定する

### ドメインを変更する

#### Webアプリにアクセスできる仕組み

まずWebアプリにアクセスできる仕組みについておさらいします。

1. ユーザーが`ryok73.dev`を叩く
2. DNSサーバーに「`ryok73.dev`ってどこにある？」と問い合わせる
3. **DNSレコード**を見て「`123.456.789.0`だよ」と返す
4. そのIPアドレスのサーバーに実際にアクセスする

上記のような流れになります。
まず、3で参照するDNSレコードの紐づけを変更する必要があります。

#### 1. DNS Recordsを変更する

今回はVercelから設定します。

1. Overview > Domains
   ![Vercel内でのDomainsの設定箇所](/seo-1-set-domain-variables-domain-place.jpg)
2. Add Existing > Add Domains
   ![Existing Domains追加画面](/seo-1-set-domain-variables-add-domains.jpg)
3. Add configure
   ![設定追加ボタン](/seo-1-set-domain-variables-add-configure.jpg)
4. 画面指示に従う

## 環境変数を設定する

このあと作成する`sitemap.ts`や`robots.ts`でブログのURLを指定する際、`NEXT_PUBLIC_SITE_URL`という環境変数を用います。

ハードコードすると、ドメイン変更のたびにコードを書き換える必要があります。

```ts
// 環境変数を参照
url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/...`;
```

環境変数にしておくと、ドメイン変更時にVercelの画面上で変更するだけで対応可能です。

#### ローカル

`.env.local`というファイルをプロジェクトルートに追加します。

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Vercel

1. Overview > Settings
   ![Settingsの場所](/seo-1-set-domain-variables-setting-location.jpg)
2. Enviroments > Production
   ![Enviromentの場所](/seo-1-set-domain-variables-environment-location.jpg)
3. Add Enviroment Variable

```txt
Key : NEXT_PUBLIC_SITE_URL
Value : <your-site-domain>
```

今後はこの`NEXT_PUBLIC_SITE_URL`を変更するだけで`robots.ts`の内容も更新できます。

## ドメインの戻り値を設定する

最後の仕上げです。

設定したドメインにアクセスした際に

- リダイレクトするか
- ブログのHTMLを返すか

この2つのどちらかを設定する必要があります。

![ドメインの戻り値設定](/seo-1-set-domain-variables-domains-redirect.jpg)

> wwwの有無についてはどちらでもいいですが、片方がもう片方にリダイレクトするように設定するのがベターです。
> 以前はネットワークアクセスにも様々あり、**Webサーバーへのアクセス**であることを明示するために`www`がつかわれました。
> ただ、現在は**Webサーバーへのアクセス**が当たり前になったため省略されるようになってきています。
> しかし、`www.domain.dev`でもアクセスできるようリダイレクトの設定は必要です。

### `Connect to an environment`と`Redirect to Another Domain`の違い

この2つのオプションの違いは、そのドメインにリクエストを送った際に、**何を返すか**です。

- `Connet to an environment`: 先ほど設定した環境変数を参照し、**ブログのHTML**を返します。

- `Redirect to Another Domain`: 他のドメインへのリダイレクトを返します。

そのため、自分のブログのドメインとして利用したいものに`Connet to an environment`を設定しましょう。
他のドメインは`Redirect to Another Domain`とし、`🔍️<your-domain>`にリダイレクトするよう設定します。

> `Connet to an environment`を2つ以上のドメインに設定した場合、ブログにアクセス可能なドメインが複数存在することになります。
> その場合、SEO的に重複コンテンツとみなされ検索順位に悪影響が出る...らしいです。

## おわりに

濃厚な内容でしたが、いかがでしたか？
自分の知らない設定を行うと、次々と*なぜ？*が増えて知識が増えていくのが楽しくなります。

さて、次回は[sitemap.tsの設定](/blog/tech/seo-2-dev-sitemap)を行います！

ヾ('ω'⊂ )))Σ≡ｻﾗﾊﾞ!!
