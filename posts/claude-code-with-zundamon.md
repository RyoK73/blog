---
title: ずんだもん報告リポジトリ mcp-simple-voicevoxの紹介
createdAt: "2026-07-16"
category: tech
published: false
---

## はじめに

今回は*Takuto Tanaka*さんが開発した[ずんだもんでclaude codeを通知するリポジトリ](https://github.com/t09tanaka/mcp-simple-voicevox)を紹介します。

このリポジトリを導入することでclaude codeの報告・通知を[VOICEVOX](https://voicevox.hiroshiba.jp)のキャラクターたちにしてもらえるようになります。
私は特に[ずんだもん](https://voicevox.hiroshiba.jp/product/zundamon/)というキャラクターが好きなので、この子に設定することにしました。

また、今までMCPという言葉しか知らなかったので、MCPサーバーの設定等もまじえて解説していきます。

## VOICEVOXのインストール

ローカルのVOICEVOXアプリのAPIを叩く仕組みのため、[VOICEVOXクライアント](https://voicevox.hiroshiba.jp/product/zundamon/)をインストールします。

Windows,Mac,Linuxのいずれでも利用可能です。

今回はLinux向けに解説します。

> インストール方法はダウンロードしたパッケージに記載されていますが、念の為こちらでも解説します。

1. パッケージのダウンロード
   私のPCはGPUを積んであるので*GPU/CPU(x64)*をダウンロードしました。

> VOICEVOX.Installer.0.25.2.Linux.sh

2. パッケージのインストール

```bash
# .shファイル実行権限を付与
chmod +x VOICEVOX.Installer.0.25.2.Linux.sh

# インストール
./VOICEVOX.Installer.0.25.2.Linux.sh
```

## リポジトリのインストール

ターミナルで以下のコマンドを実行します。

```bash
npm i -g @t09tanaka/mcp-simple-voicevox
```

## MCPサーバーの設定

### MCPサーバーを設定(`.claude.json`)に追加する

ローカルコマンドで起動する場合はこの基本構文に従います。

```bash
claude mcp add "mcp-server-name" [options] -- "command" [args...]
```

今回は`[options]`にスコープを指定します。

- `local`（デフォルト・省略時）: そのプロジェクトの .claude/settings.local.json に保存、自分専用
- `project`: .mcp.json に保存、リポジトリにコミットしてチーム共有
- `user`: ~/.claude.json に保存、全プロジェクト共通

今回はローカル上ですべての通知に対応したいので、`-s user`で設定します。

> パフォーマンス上の懸念点はコンテキスト消費の増加と軽微なので`-s user`にしました。
> 心配な方は適当なプロジェクトに`-s local`でインストールしてもいいと思います。

```bash
claude mcp add voicevox -s user -- npx @t09tanaka/mcp-simple-voicevox
```

> `~`で`claude mcp add voicevox -- npx @t09tanaka/mcp-simple-voicevox`するのとは挙動が違うので必ず`-s user`が必要です(一敗)

### VOICEVOX MCPを有効化する

```bash
# Claude Codeを起動する
claude code

```

以下のように表示されたら設定完了です。

```bash
# Claude Codeにて
/mcp

# User MCPs (/home/taruroma/.claude.json)
#  ❯ voicevox · ✔ connected · 1 tool
```

## CLAUDE.mdにコンテキストを追加する

VOICEVOXで通知するようルールを設定します。

> 作成者さんの記事から引用

```md
### Voice Notification Rules

- **全てのタスク完了時には必ずVOICEVOXの音声通知機能を使用すること**
- **重要なお知らせやエラー発生時にも音声通知を行うこと**
- **音声通知の設定: speaker=1, speedScale=1.3, async: trueを使用すること**
- **英単語は適切にカタカナに変換してVOICEVOXに送信すること**
- **VOICEVOXに送信するテキストは不要なスペースを削除すること**
- **1回の音声通知は100文字以内でシンプルに話すこと**
- **以下のタイミングで細かく音声通知を行うこと：**
  - 命令受領時: 「了解です」「承知しました」
  - 作業開始時: 「〜を開始します」
  - 作業中: 「調査中です」「修正中です」
  - 進捗報告: 「半分完了です」「もう少しです」
  - 完了時: 「完了です」「修正完了です」
- **詳しい技術的説明は音声通知に含めず、結果のみを簡潔に報告すること**
```

## 補足

### 再生ソフトがインストールされていないと音声が再生されません。

[voicevox-client.ts](https://github.com/t09tanaka/mcp-simple-voicevox/blob/main/src/voicevox-client.ts)のL90では`aplay`で再生するよう記述があります。

これがインストールされていなかったため再生されませんでした。

```bash
sudo pacman -S alsa-utils
```

### speakツールの設定

CLAUDE.mdに以下の箇所を編集しましょう。

```md
- **音声通知の設定: speaker=1, speedScale=1.3, async: trueを使用すること**
```

speaker IDは以下のコマンドで確認できます。

```bash
curl http://localhost:50021/speakers | jq .

```

ずんだもんの場合は、

```bash
curl http://localhost:50021/speakers | jq '.[] | select(.name == "ずんだもん")'
{
  "name": "ずんだもん",
  "speaker_uuid": "388f246b-8c41-4ac1-8e2d-5d79f3ff56d9",
  "styles": [
    {
      "name": "ノーマル",
      "id": 3,
      "type": "talk"
    },
    {
      "name": "あまあま",
      "id": 1,
      "type": "talk"
    },
    {
      "name": "ツンツン",
      "id": 7,
      "type": "talk"
    },
    {
      "name": "セクシー",
      "id": 5,
      "type": "talk"
    },
    {
      "name": "ささやき",
      "id": 22,
      "type": "talk"
    },
    {
      "name": "ヒソヒソ",
      "id": 38,
      "type": "talk"
    },
    {
      "name": "ヘロヘロ",
      "id": 75,
      "type": "talk"
    },
    {
      "name": "なみだめ",
      "id": 76,
      "type": "talk"
    }
  ],
  "version": "0.16.0",
  "supported_features": {
    "permitted_synthesis_morphing": "SELF_ONLY"
  }
}
```

設定の詳細については[公式ドキュメント](https://github.com/t09tanaka/mcp-simple-voicevox/blob/main/docs/specification.md)を確認してください。

## 使用してみる

VOICEVOXを起動しておきます。

以下のコマンドに戻り値があれば起動は完了しています。

```bash
curl http://localhost:50021/speakers
```

```bash
claude

> speakツールを使ってテストして
# 正常に動作していれば音声が再生されます。
```

## ずんだもん最高

音声で通知されるだけで途端にペアプログラミング感がましてきました。

気になった方はぜひ試してみてください！
