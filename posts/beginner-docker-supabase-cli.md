---
title: Dockerを使用したSupabase CLIの使い方 with ローカルDB
createdAt: "2026-07-03"
category: tech
published: false
---

## はじめに

今回はDockerを使用したSupabase CLIの使用方法について解説していきます。

[前回の記事](/tech/beginner-supabase)で紹介したマイグレーションファイルの作成・リモートとの同期以外に、
Dockerを使用してローカルDBを立ち上げることでGUIでの操作やIDEでのインテリセンス・Lintの使用が可能になります。

Windows・Macの場合はDocker Desktopのインストール、Linuxの場合はDocker Engineのインストールで仮想環境の設定なく初められます。

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
