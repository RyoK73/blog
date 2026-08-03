---
title: Arch LinuxでGDStash(Grim Dawn)を使用する方法
createdAt: "2026-08-03"
category: tech
published: false
---

## はじめに

この記事では、Grim Dawnの倉庫拡張ツール GDStashをArch Linuxでセットアップする方法を紹介します。
内容自体はRedditのコメントに従ったものを詳細化したものになります。
この記事通りの方法でGDStashの正常起動に成功しています。

> [GDStash](https://forums.crateentertainment.com/t/tool-gd-stash/29036)
> [Redditスレッド](https://www.reddit.com/r/Grimdawn/comments/10dcfpn/grim_dawn_and_gd_stash_setup_on_linux_my/?tl=ja)

### 検証環境

- Archi Linux Omarchy 3.8.2
- Steam
- java-26-openjdk

## GDStashとは

[Grim Dawn](https://store.steampowered.com/app/219990/Grim_Dawn)の倉庫拡張を始めとしたユーティリティ機能を提供するツール

Grim DawnはハックアンドスラッシュジャンルのARPGです。

装備を集めてビルドを構築して、また装備を集める...このループを繰り返すゲームです。

そんな中、悩みが一つ...**倉庫が狭い**ことです。

GDStashは倉庫の保存ファイルを読み書きして外部ファイルに保存することで、ゲーム内の倉庫が狭いという問題を解決しています。

> GDStash自体は、倉庫拡張以外にもキャラクターの編集やアイテムの生成などいわゆるチートが使えますが、今回は倉庫拡張に限定しています。
> またWindows用に作成されているので、動きはしますが操作性は諦めましょう。
> Windowsに近いウィンドウマネージャだと快適かもしれません。

## 導入方法

### 1. OpenJDKをインストールする

> [公式ガイド](https://wiki.archlinux.jp/index.php/Java)

以下表示が出たらOK

```bash
# パッケージマネージャーはご使用のものに読み替えてください。
# arch linuxはpacmanです。
sudo pacman -S jdk-openjdk

archlinux-java status
# ↓
Available Java environments:
  java-26-openjdk (default)
```

> Omarchyだと最初からインストールされていました。

### 2. GDStashをインストールする

1. [GDStash フォーラム](https://forums.crateentertainment.com/t/tool-gd-stash/29036)のダウンロードページから`GDStash_v182g.zip`をダウンロードしました。

> 最新のバージョンのものを利用してください。

2. 次にインストールディレクトリを作成し、zipファイルを展開します。

```bash
cd $HOME
mkdir .gdstash # 名称はご自由に

cd .gdstash

# zipファイルを移動
mv $HOME/Downloads/GDStash_v182g.zip ./

# 展開
unzip GDStash_v182g.zip
```

### 3. Steamで登録する

1. Steamを開く
2. ゲーム > _非Steamゲームをライブラリに追加する_
3. 参照 > すべてのファイル
4. `/path/to/GDStash/install/directory/GDStash.jar`を追加する
   ファイルパスはご自分のパスに読み替えてください。
5. プロパティ > ショートカット > 起動オプション
6. `java -jar "/path/to/GDStash/install/directory/.gdstash/GDStash.jar" %command%`
   ここで追加する`/path/to/GDStash/install/directory/.gdstash/GDStash.jar`は*ショートカット > リンク先*をコピーするとよいです。
7. *プレイ*する

### 4. GDStashの設定

1. ゲーム・セーブディレクトリの設定
   *configuration*タブで設定します。

- install directory
  SteamのGrim Dawnの*ローカルファイルを閲覧*から確認できます。
  大体`$HOME/.local/share/Steam/steamapps/common/Grim Dawn`です。

- save data directory

```bash
# セーブファイルの拡張子.gdcを検索
find . -name "*.gdc"

```

GDStashの利用の際は、クラウドセーブはオフにする必要があります。

現在クラウドセーブを利用している人は後述の移行方法を実施した後、続けてください。

ローカルセーブの場合は、`./.local/share/Steam/steamapps/compatdata/219990/pfx/drive_c/users/steamuser/Documents/'My Games'/'Grim Dawn'/save/main/`にありました。

- language: 日本語化可能です。
- テーマ: Nimbusが一番見やすかったです。

> 忘れずに*設定を保存*しましょう

2. データベースのインポート
   結構時間かかりますね...

### Grim Dawn クラウドセーブからローカルセーブへの移行方法

以下コマンドでセーブデータと共有データを移行します。
各ディレクトリパスはご自分のものに読み替えてください。

```bash
# save dataの移行
cp -r ~/.local/share/Steam/userdata/1069899094/219990/remote/save/main/* ~/.local/share/Steam/steamapps/compatdata/219990/pfx/drive_c/users/steamuser/Documents/'My Games'/'Grim Dawn'/save/main/

# 設計図の収集状況や共有倉庫データの移行
cp  ~/.local/share/Steam/userdata/1069899094/219990/remote/save/*.gst ~/.local/share/Steam/steamapps/compatdata/219990/pfx/drive_c/users/steamuser/Documents/'My Games'/'Grim Dawn'/save/

# ゲームメニュー設定?の移行
cp  ~/.local/share/Steam/userdata/1069899094/219990/remote/save/*.cpn ~/.local/share/Steam/steamapps/compatdata/219990/pfx/drive_c/users/steamuser/Documents/'My Games'/'Grim Dawn'/save/
```

ゲームを起動しデータが移行されていることを確認しましょう

## おまけ: GDStashのFAQからいくつか抜粋

> すべて読みたい方は、gdstashのdocからどうぞ。

1. Steam Cloudで使えますか？
   A. No ローカルセーブのみで機能します。

   > Steam Cloudの保存処理とGDStashの読み書き処理が被っちゃうからみたいですね。

2. プレイ中に共有倉庫を編集できますか？
   A. Yes 共有倉庫をゲーム内で開いていないときに編集できます。

3. プレイ中にキャラクターを編集できますか？
   A. No 現在プレイ中のキャラクターを編集することはできません。

4. バックアップできますか？
   A. 100MBまでならできます。ツール内の*Export DB stash*を使用してください。
   > 詳しくはFAQを確認してください。

## おまけ2: ローカルセーブを自動バックアップする

> 詳しくは[@ryok73/auto-backup-steam-saves](https://github.com/RyoK73/auto-backup-steam-saves.git)を参照

クラウドセーブでなくなったことで、セーブファイルが複数端末で同期されなくなります。
そこでGithubで管理することにしました。

- How To: Steamの起動オプションからラッパースクリプトでゲームが起動するようにして、ゲーム終了時に自動でcommit & pushされるようにします。
- 100時間くらいプレイしたデータでsave全体の容量は17Mだったので、Githubの規約(1GB)にも引っかからないです。

1. 初期設定

```bash
# ディレクトリをremoteに追加
cd ~/.local/share/Steam/steamapps/compatdata/219990/pfx/drive_c/users/steamuser/Documents/'My Games'/'Grim Dawn'/save/
git init

git add .
git commit -m "feat: 初期ファイルを追加"

git remote add origin https://github.com/RyoK73/grim_dawn_save.git # private

git push origin main
```

2. スクリプトをセットアップする

```bash
#! /bin/bash

# launch game and wait for finish
"$@"

unset LD_LIBRARY_PATH
unset LD_PRELOAD

BACKUP_LOCATION="$(cd "$(dirname "$(dirname "$(readlink -f "$0")")")" && pwd)/save-backup.log"

function output-log() {
	message="$1"
	echo "$(date '+%Y-%m-%d %H:%M:%S'): $message" >>"$BACKUP_LOCATION"
}

# commit & push
SAVE_DATA_LOCATION="$HOME/.local/share/Steam/steamapps/compatdata/219990/pfx/drive_c/users/steamuser/Documents/My Games/Grim Dawn/save"

cd "$SAVE_DATA_LOCATION" || {
	output-log "fail to cd $SAVE_DATA_LOCATION"
	exit 1
}
git add -A
git commit -m "Auto Backup $(date '+%Y-%m-%d %H:%M:%S')" || {
	output-log "nothing to commit"
	exit 1
}
git push >>"$BACKUP_LOCATION" 2>&1 || {
	output-log "fail to git push"
	exit 1
}

output-log "succesfully backedup"
```

## おわりに

GDStashを導入したことで、トレハン時の「欲しいけど倉庫に入らないから捨てざるを得ない」というジレンマが解決しました。

今後は、どんどん装備を掘ってビルドを構築していきたいですね！

Linuxでプレイされてる方はどうぞ試してみてください〜！
