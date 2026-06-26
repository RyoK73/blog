---
title: pnpmでモノレポの初期設定を行うには？
createdAt: "2026-06-23"
category: tech
published: false
---

## はじめに

この記事では`pnpm workspace`を使用したモノリポジトリの初期設定方法について記録します。

フロントエンドのみのアプリケーション開発から、バックエンド,Web & CLI開発に進む開発者にオススメです。

アプリケーション構成として、Webアプリケーション・CLI・バックエンド...など動作環境・場所が異なるパッケージを単一リポジトリで管理することができます。

モノレポを採用する利点としては、

1. レポジトリ管理の煩雑さを軽減する
2. READMEなどドキュメントに差異が発生するのを防ぐ
3. モノレポの開発経験がないので実装経験を積みたい

ということで、本記事ではpnpmにてモノレポを一から構築する方法を解説していきます。

## 構築方法

### 基本のディレクトリ構成

以下のようにリポジトリを作成します。

```bash
 root/
  ├── pnpm-workspace.yaml   ← ワークスペース定義
  ├── package.json          ← ルートのpackage.json
  ├── tsconfig.base.json    ← 共通設定のtsconfig.json
  ├── apps/
  │   ├── web/              ← フロントエンド等
  │   └── cli/              ← CLIツール等
  │      └── tsconfig.json  ← 個別設定のtsconfig.json
  └── packages/
      ├── ui/               ← 共有UIコンポーネント
      ├── config/           ← 共有設定（eslint, tsconfig等）
      └── utils/            ← 共有ユーティリティ
```

今回は、CLIをnpmパッケージとして配布するため`apps`,`packages`を採用していますが、自分の判別しやすい名称であれば何でも構いません。
ただし、アプリなのか、ライブラリなのかを判別しやすい名称にしておくことがオススメです。

### `pnpm-workspace.yaml`に設定を記述する

どのディレクトリにパッケージが配置されるかを定義します。

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `package.json`に設定を記述する

```json
{
  "private": true, // 原則true,npmパッケージとして公開したいものにだけfalseを設定する。デフォルト値はfalse
  "scripts": {
    "build": "pnpm -r build", // -r はrecursiveのこと。サブディレクトリまで再帰的にbuildされる
    "dev": "pnpm --filter @apps/web dev" // どこからでもwebアプリのみローカルホストで起動する。なくても可
  }
}
```

### `tsconfig.json`を作成する

プロジェクトルートには`tsconfig.base.json`
個別パッケージには`tsconfig.json`を配置する

#### `tsconfig.base.json`

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    "esModuleInterop": "true",

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Recommended Options
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

#### `tsconfig.json`

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // File Layout
    "rootDir": "./src",
    "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Next.jsonの`tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017",
    ...
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

## Tips

### パッケージ間の依存設定

例：もし、`apps/web`から`packages/utils`を使用する場合

```json
// apps/web/package.json
{
  "dependencies": {
    "@myapp/utils": "workspace:*"
  }
}
```

`workspace:*`と書けばローカルのものを参照します。書かない場合、npmレジストリを探しに行くので注意です。

### よく使うコマンド

| コマンド                             | 意味                                                 |
| ------------------------------------ | ---------------------------------------------------- |
| `pnpm install`                       | `package.json`に書かれた全パッケージ一括インストール |
| `pnpm -r build`                      | 全パッケージでbuild実行                              |
| `pnpm --filter @app/web dev`         | 特定パッケージのみ実行                               |
| `pnpm add lodash --filter @apps/web` | 特定パッケージに依存(ライブラリ・モジュール)追加     |

※ 原則、ライブラリ・依存管理はパッケージごとに行います。

### .gitignoreの扱い

パッケージごとに`pnpm create next-app`など初期化コマンドを走らせた場合、.gitignoreが作成されることがあります。
その場合の選択肢としては2つ

1. ルートの.gitignoreにマージする
   ルートで一元管理できます
2. そのまま残す
   そのまま残しておいても実害はありません。gitが両方を適用してくれるので問題ないです。
   **パッケージ毎に追加の無視ルール**を設定できるという利点もあります。

.gitignoreは[githubがテンプレートを用意してくれている](https://github.com/github/gitignore/blob/main/Node.gitignore)ので活用しましょう。
Node.jsの場合は、**Node.gitignore**がおすすめです。
