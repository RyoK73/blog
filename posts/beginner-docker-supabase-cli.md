---
title: Dockerを使用したSupabase CLI・インテリセンスの設定方法
createdAt: "2026-07-03"
category: tech
published: false
---

## はじめに

今回はDockerを使用したSupabase CLIの使用方法・インテリセンスの設定方法について解説していきます。

[前回の記事](/tech/beginner-supabase)で紹介したマイグレーションファイルの作成・リモートとの同期以外に、
Dockerを使用してローカルDBを立ち上げることでGUIでの操作やIDEでのインテリセンス・Lintの使用が可能になります。

Windows・Macの場合はDocker Desktopのインストール、Linuxの場合はDocker Engineのインストールで仮想環境の設定なく始められます。

### Dockerを使用してSupabase CLIを使うことのメリット

1. `supabase start`でローカルDBをGUIで操作・確認できる
2. `supabase db diff -f "filename"`で変更内容をマイグレーションファイルにアウトプットできる
3. DB情報と接続することでSQLの記述の際にインテリセンス・型補完...を使用できる

## 起動・終了方法

- 起動方法

```bash
supabase start
```

```
╰> $ supabase start
WARNING: You are running different service versions locally than your linked project:
[+] Pulling 13/13
 ✔ pgmeta Skipped - Image is already present locally                                                                                                            0.0s
 ✔ vector Skipped - Image is already present locally                                                                                                            0.0s
 ✔ db Skipped - Image is already present locally                                                                                                                0.0s
 ✔ gateway Skipped - Image is already present locally                                                                                                           0.0s
 ✔ auth Skipped - Image is already present locally                                                                                                              0.0s
 ✔ studio Skipped - Image is already present locally                                                                                                            0.0s
 ✔ mailpit Skipped - Image is already present locally                                                                                                           0.0s
 ✔ imgProxy Skipped - Image is already present locally                                                                                                          0.0s
 ✔ analytics Skipped - Image is already present locally                                                                                                         0.0s
 ✔ api Skipped - Image is already present locally                                                                                                               0.0s
 ✔ realtime Skipped - Image is already present locally                                                                                                          0.0s
 ✔ storage Skipped - Image is already present locally                                                                                                           0.0s
 ✔ edgeRuntime Skipped - Image is already present locally                                                                                                       0.0s
Starting database from backup...
Starting containers...
Waiting for health checks...
Started supabase local development setup.

╭──────────────────────────────────────╮
│ 🔧 Development Tools                 │
├─────────┬────────────────────────────┤
│ Studio  │ http://127.0.0.1:54323     │
│ Mailpit │ http://127.0.0.1:54324     │
│ MCP     │ http://127.0.0.1:54321/mcp │
╰─────────┴────────────────────────────╯
```

*http://127.0.0.1:54323*をクリックすることでローカルホストのGUIに遷移します。

- 終了方法

```bash
supabase stop
```

## IDEでのインテリセンス使用方法

[公式ページ](https://pg-language-server.com/latest/getting_started/)

今回使用するLSPはSupabaseコミュニティが公開している**postgres-language-server**です。

> NeoVimでのインストール方法を解説します。
> その他のIDEについては[公式ガイド](https://pg-language-server.com/latest/guides/ide_setup/)をもとにインストールしてください。設定方法は大きくは変わらないと思います。

### LSPをインストールする

1. Masonでインストール
   `:MasonInstall postgres-language-server`

2. LSPを有効化する
   コンフィグファイルに以下を追加します。
   LazyVimの場合は`nvim/lua/plugins/lsp.lua`です。(`lsp.lua`がなければ作成してください。)

   ```lua
   return {
   "neovim/nvim-lspconfig",
   opts = {
    vim.lsp.enable("postgres_lsp"),
   },
   }
   ```

   ※ この記述なしでも動作しますが、公式ガイドに記載があったため念の為設定しました。

### コンフィグファイルを作成する

[公式ガイド](https://pg-language-server.com/latest/guides/configure_database/)

プロジェクトルートに`postgres-language-server.jsonc`を作成します。

```jsonc
{
  "$schema": "https://pg-language-server.com/latest/schema.json",
  "db": {
    "host": "127.0.0.1",
    "port": 54322, // supabase startのデフォルトDBポート
    "username": "postgres",
    "password": "postgres",
    "database": "postgres",
    "allowStatementExecutionsAgainst": ["127.0.0.1/*", "localhost/*"],
  },
  // フォーマット設定(保存時)
  "format": {
    "enabled": true,
    "lineWidth": 100,
    "indentSize": 2,
    "indentStyle": "tabs",
    "keywordCase": "upper", // CREATEなどキーワードの大文字(uppser)/小文字(lower)を設定
    "constantCase": "upper", // TRUEなど定数の大文字(uppser)/小文字(lower)を設定

    "typeCase": "lower", // textなどデータ型の大文字(uppser)/小文字(lower)を設定
  },
}
```

`port`のみ、`supabase status`/`supabase start`のDBのポートと合致していることを確認してください。

`format`以降は記述しなくても構いませんが、保存時に勝手に修正されて便利なのでおすすめです。

## コマンド集

## 注意点

### `supabase db diff`の挙動について

このコマンドはあくまで変更前と変更後の差分を比較して、変更後に到達するためのSQLを記述します。
そのため、同じカラム名を削除・再追加などした場合、データ型のキャストとして捉えられエラーが発生することがあります。
例えば、あやまって`int8`で設定したカラムを`uuid`に変更したい場合、**当該カラムを削除して再作成する**方法を取りましたが、この操作は`supabase db diff`的には`int8`から`uuid`へのキャストとして扱われます。

`int8`から`uuid`へのキャスト処理は存在しないため、DB上ではうまくいったにもかかわらずDB再構築時にエラーとなります。

こういった挙動を理解し、必要に応じて操作の分割・手動記述を組み合わせるのがキモになってきます。

正直なところ、普通に記述したほうが早いことも多いです。
例えば、テーブル名のリネームを行う場合、`ALTER TABLE ... RENAME TO ...`で済みますが、GUI経由で行うと`DROP TABLE ...`が記述されてしまいます。

### QA

- ローカルDBの編集内容をマイグレーションファイルに起こしたいとき

```bash
supabase db diff -f "migration-file-name"
```

- DBでの編集内容を取り消したいとき

```bash
supabase start
supabase db reset
```

これで、migrations/ 通りにDBが再構築される。

## さいごに

このプロジェクトでは難しそうだからつかわないでおこうと身構えてたところもありました。
でも使うにあたって必要なことは`supabase start`だけ...

最初は、WebとCLIを行き来してましたが、結局ほとんどローカルだけで完結して作業するようになりました。
みなさんもsupabaseになれたら、`supabase start`を試してみてください！
