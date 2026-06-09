---
title: git worktreeの使い方と便利コマンド
createdAt: "2026-06-09"
category: tech
published: true
---

## はじめに

読者諸君、ぐんも！

この記事では、git worktreeの概要、記述方法、zshで使用可能な便利なコマンドを紹介します。

## git worktreeとは

### 違い

- `git branch`は同じディレクトリ上でファイル追跡branchを生成する。
- `git worktree`はブランチを作る際にディレクトリのコピーを作成する。

つまり、ブランチ作成時にディレクトリをコピーするかどうかが分かれ目となります。

例えばチームで1つのリポジトリを管理するとき、それぞれの作業はリモートリポジトリをそれぞれのPCに`git clone`しますよね？

それと同じことを1つのPC内でやってしまうのが`git worktree`なんです。

## 基本コマンド

### 追加

1. 新しいブランチと作業ディレクトリを作成する
   `../`に`<branch-name>`のディレクトリが作成されます

```bash
git worktree add ../<branch-name>
```

2. 既存ブランチを新しい作業ディレクトリに移す
   現在作業中のブランチを`<directory-name>`に移動します。

```bash
git worktree add <directory-name>
```

3. ブランチ名と作業ディレクトリ名を指定し、特定のコミットからブランチを作成する
   私の使用例では、`<commit-name>`は基本的に`main`を使用します。

```bash
git worktree add add -b <branch-name> <directory-name> <commit-name>
```

4. ブランチ名と作業ディレクトリ名を指定して現在のコミットからブランチを作成する

```bash
git worktree add add -b <branch-name> <directory-name>
```

### 現在のworktreeの一覧表示

```bash
git worktree list
```

### 削除

1. 作業が完了したworktreeを削除します。

```bash
git worktree remove <directory-name>
```

2. 未保存の変更があっても強制定期に削除します。

```bash
git worktree remote --force <directory-name>
```

## zshで使っている便利関数

### git worktreeの作成

現在のディレクトリに対し以下をチェックします。

1. git repositoryか
2. 初回コミットがあるか

その後、`<repository-name>-<branch-name>`というディレクトリを作成し、`<branch-name>`にチェックアウトします。

```bash
function git-plant() {
  if ! git rev-parse --git-dir &>/dev/null; then
    echo "not a git directory"
    return
  elif ! git rev-parse HEAD --git-dir &>/dev/null; then
    echo "commitがありません"
    return
  elif [[ -z "$1" ]]; then
    echo "ブランチ名を指定してください"
    return
  fi
  local branchdir="../$(basename $(git rev-parse --show-toplevel))-$1"
  git worktree add -b "$1" "$branchdir" "${2:-main}"
  cd "$branchdir"
}
```

- `git rev-parse (HEAD) --git-dir &>/dev/null`
  現在の(HEAD コミットへの)git directoryのパスを出力。その際のstdinはtrashします。
  true/falseを判定するために使用

- `git rev-parse --show-toplevel`
  現在のgit directoryのトップレベルのディレクトリパスを出力

- `basename`
  引数のディレクトリ名を出力

### git worktreeの削除

mainにmerge済みのworktreeのディレクトリ・ブランチを削除します。

```bash
function git-cut() {
  git fetch --prune
  git branch -vv | grep ': gone' | awk '{
    if ($1 == "+") {
      gsub(/[()]/,"",$4); print $2,$4
    } else { print $1,"" }
  }' | while read branch wt_path; do
    [[ -n "$wt_path" ]] && git worktree remove "$wt_path"
    git branch -d "$branch"
  done
  echo
  echo 💫残りのローカルブランチ💫
  echo
  git branch
}
```

- `git branch -vv | grep ': gone' | awk`
  mainにmergeされると、`git branch -vv`で`feature/foo  abc1234 [origin/feature/foo: gone]`のように表示されます。
  そのため、`: gone`のブランチに対して`awk`の処理を実行します。

## なぜgit worktreeを使うのか？

最初は`git switch -c <branch-name>`が私の相棒でした。
ところが、ブログを書くようになると、ブログ記事を書くブランチ、ブログ機能を実装するブランチが混ざって混乱することが増えるようになったのです。

また、claude codeを本格的に使うようになったこともあり、ブランチごとにディレクトリをわけて、ファイルに対する変更を混同しなくてすむようにもしたかったからです。

## さいごに

`git branch`のみの運用よりもはるかに利便性が高く、AIとのコーディングとも親和性の高い`git worktree`の紹介でした。

ぜひ皆さんの開発フローに取り入れてみてください。
