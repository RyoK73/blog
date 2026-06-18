---
title: 2026年6月のGit Tips集
createdAt: "2026-06-18"
category: tech
published: false
---

## はじめに

この記事では2026年6月の開発作業で気づいたGit関連のTipsを記載します。

## ローカルとリモートで異なる履歴を持ってしまった場合

### 日付

2026/6/18

### 概要

こういうパターンです。

- ローカル: create-next-app で作った Initial commit がある
- リモート: README と issues がある（別の歴史を持つリポジトリ）

Git的には「無関係な2つの歴史」が存在する状態

こうなった理由は、先に構想をねってREADMEやIssueを作成してしまっており、その後`create-next-app`を実行したためです。

### 解決方法

#### remoteを追加する

```bash
git remote add origin ...
```

#### fetchする

```bash
git fetch origin
```

## mergeコンフリクトの解決方法

### 日付

2026/6/18

### 概要

いつもmerge/rebaseしたときにコンフリクトメッセージがファイルに残ったままになってしまい、レビュー時に怒られていました。

コンフリクトの概念は知っていましたが、対処法はしりませんでした。

### コンフリクトマーカーの読み方

このマーカーが残っている状態が**未解決**であるということ。

```md
<<<<<<< HEAD
// 自分のブランチの内容
=======
// 取り込もうとしているブランチの内容

> > > > > > > feature/xxx
```

### 解決方法

1. ファイルに入り手動で必要な変更を残す
2. 変更が終わったら、`git merge` or `git rebase --continue`

### git rebaseについて

- `git rebase main`: rebaseを開始する
- `git rebase continue`:中断中のrebaseを開始する。次のコンフリクトがあればまた止まる。
- `git rebase --abort`: rebase自体をなかったことにして下に戻す
- `git rebase --skip`: 今のコミットを丸ごとスキップして次へ

迷ったら、`git rebase --abort`で巻き戻せるので安心
