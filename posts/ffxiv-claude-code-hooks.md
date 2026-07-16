---
title: FFXIV-HOOKSがログインしました
createdAt: "2026-05-02"
category: tech
published: true
---

## プロフィール

はじめまして。光の戦士 RyoK73です。

みなさんはFinal Fantasy XIVというオンラインゲームをご存知でしょうか？

[Final Fantasy XIV](https://jp.finalfantasyxiv.com)

2013年に**新生エオルゼア**として復活し、現在まで約13年続くスクエア・エニックス提供のMMORPGです。

私は6番目の拡張パッケージ「黄金の遺産(レガシー)」リリース直前に開始し、現在はストーリーを攻略中です。
また、2027年1月には第7段拡張パッケージ「白銀のワンダラー」の発売が予定されています。

### details 拡張パッケージ発売変遷

| 発売日        | パッケージ名               |
| ------------- | -------------------------- |
| 2013年8月27日 | 新生エオルゼア             |
| 2015年6月23日 | 蒼天のイシュガルド         |
| 2017年6月20日 | 紅蓮の解放者(リベレーター) |
| 2019年7月2日  | 漆黒の反逆者(ヴィランズ)   |
| 2021年12月7日 | 暁月の終焉(フィナーレ)     |
| 2024年7月2日  | 黄金の遺産(レガシー)       |
| 2027年1月予定 | 白銀の探求者(ワンダラー)   |

## FFXIV × Claude Codeという体験

実は、ゲーム内にも**マクロ**と呼ばれる簡易的なシェルスクリプトが実装されています。
私がFFXIVにはまったきっかけでもあり、プログラミングがますます好きになった理由の一つでもあります。

そんな私にとって思い出深いFFXIVですが、ストーリーやゲーム内システム以外にも、魅力が多くあり、その中の一つが**サウンドエフェクト**(**SE**)です。

プレイ中に幾度となく耳にするSE...お気に入りのものから、もう聞きたくない...と言ったものまで様々あります(笑)

1. マルチプレイマッチング時に*シャキーン*というSEが流れることから転じて、
   マッチングを待つことが**シャキ待ち**と呼ばれたり...
2. 新生エオルゼア編に登場する**ミンフィリア**というキャラクターの
   チャット時の*フォンフォンフォン*というSEにはうんざりしている人も数多くいることでしょう(笑)

この馴染み深く、素晴らしいSEを開発体験にも活用できないだろうか...
そんな思いつきから、今回、Claude CodeのHooksをFFXIVのSEで通知できるリポジトリを作成するに至りました。

[claude-code-ffxiv-hooks](https://github.com/RyoK73/claude-code-ffxiv-hooks)

導入すると、Claude Codeで開発しながら、まるでFFXIVのゲームをしているような気分になれます。
もはやhookがトリガーするのが楽しみでしょうがなくなり、開発モチベーションも爆上がりです...！

### 各hookとゲーム内SEの対応表

| Hook                                 | デフォルトSE           | ゲーム内体験                                       |
| ------------------------------------ | ---------------------- | -------------------------------------------------- |
| `Stop`                               | Notification           | ログイン後の通知 (設定でオフにしてる人多いかも...) |
| `SubagentStop`                       | Guildleve Complete     | 新生編のギルドリーヴ完了時                         |
| `Notification`                       | Linkshell Transmission | おなじみリンクシェル着信音(ミンフィリア...)        |
| `PermissionRequest`                  | Feature Unlocked       | ID/フライングマウント解放                          |
| `PostToolUse` (Bash 成功)            | Confirm                | タブ切り替え時/セリフ選択時...                     |
| `PostToolUse` (Bash 失敗)            | Error                  | エラー音(私もあまり聞き覚えがないです...)          |
| `PostToolUse` (Edit/Write/MultiEdit) | Obtain Item            | アイテム取得時                                     |

## 課題と設計

### `hooks-config.json`で`.claude/settings.json`を再設計する

Claude Codeは今やエンジニアだけのものではありません。
コードに触れていない人だって利用しています。

しかし、今回のようにサウンドを好きなゲームのものに設定して...とするのは煩雑です。
また、変更があるたびに`.claude/settings.json`を編集する必要もあります。

そこで、今回はすべての設定を行うための`hooks-config.json`というファイルを用意し、`.claude/settings.json`は`hooks-config.json`を参照するだけという構成にしました。
https://github.com/RyoK73/claude-code-ffxiv-hooks/blob/main/hooks-config.json

利用する際に`.claude/settings.json`を編集する必要はありません。

- 再生ソフト
- 通知音量
- hookEvent
- サウンドエフェクトファイル
- 有効・無効

これらが`hooks-config.json`を編集するだけで即座に通知に反映されます。

---

### スコープ設計と実行権限

Claude Codeは起動ディレクトリを信頼境界としてコマンドを実行します。
そのため、**起動ディレクトリより上位のパスにあるファイルを実行できませんでした**。

そこで、Claude Codeの起動スコープごとに動作フローを分岐させています。

#### `install.sh --local (ref)`の場合

1. `(ref)/.claude/settings.json`を生成します。
2. Claude Code起動時、`settings.json`から`claude-code-ffxiv-hooks/scripts/play.sh`を実行しようとします。
   ただし、先述のとおりClaude Codeは起動ディレクトリより上位を参照できないため`..play.sh`を実行することができませんでした。

3. そのため、

```md
ref
└── .claude/
├── play.sh
├── play_bash_result.sh
├── settings.json
├── settings.local.json
└── settings_backups/
└── settings.*.json（バックアップ5件）
```

と実行ファイルも同時にコピーする設計にしました。

> `ref/.claude/play.sh`から`claude-code-ffxiv-hooks/hooks-config.json`を参照することは問題なく可能です。
> あくまでClaude Codeの実行権限への回避設計となります。

#### `install.sh --global`の場合

1. `$HOME/.claude/settings.json`を生成します。
2. Claude Code起動時は、`$HOME`権限で`claude-code-ffxiv-hooks/scripts/play.sh`を実行します。
   ここでは、`$HOME`より下位のディレクトリを参照するため、実行ファイルをコピーすることはありません。

## スクエア・エニックス コンテンツポリシー

本リポジトリでは、Final Fantasy XIV Fan Kitのスマートフォン向け着信音を使用し通知しています。

今回利用させていただく`/sounds/ffxiv_sounds/` に含まれるサウンドエフェクトは **SQUARE ENIX CO., LTD.** の著作物です。MITライセンスの適用範囲外となります。

> © SQUARE ENIX

ご利用の際は[ファイナルファンタジーXIV 著作物利用ルール](http://support.jp.square-enix.com/rule.php?id=5381&la=0&tag=authc)を必ずご確認ください。
**非営利・個人利用の範囲内**でのみご使用いただけます。商用・営利目的での利用は禁止されています。

そのため、リポジトリ内にはSEファイル自体は含めず、利用する際に直接Fan Kitからダウンロードする形を採用しています。

## 最後に

Claude Codeと開発していたら、いつの間にかFFXIVをプレイしている気分になっていた。
そんな体験が私が作りたいものを教えてくれました。

今後の開発人生を通して、私は**楽しさ**を生み出すコンテンツを作っていきたいです。

どうやって時間を短縮するか・工数を削減するか...
そんな殺伐とした側面だけでなく、如何に**ユーザーの体験の質を向上させるか**・どうやったら**もっと毎日を幸せに過ごせるだろうか**...そういう点に貢献できるプロダクトを生み出していきたいです！
