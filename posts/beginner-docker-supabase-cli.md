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
