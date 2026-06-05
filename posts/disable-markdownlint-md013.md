---
title: markdownlintのルールを無効化・カスタムする方法
createdAt: "2026-06-05"
category: tech
published: true
---

## markdownlintとは？

[markdownlint](https://github.com/DavidAnson/markdownlint)

makrdownの正しい書き方(?)を注意してくれるプラグイン
しかし、「必要かな？」と思うルールもあり使ってるうちにいくつか無効化したくなってくる。

ただ問題は、リポジトリにルールのカスタム・無効化方法が書いてないって点

## カスタム・無効化方法

### 1. 任意のディレクトリに`.markdownlint-cli2.yaml`を作成する

今回は`~/.config/makrdownlint/`に作成。
各種ルールに関しては[DavidAnson/markdonwlint](https://github.com/DavidAnson/markdownlint#rules--aliases)を参照

```yaml
# MD013を無効化する
config:
    MD013: false
```

### 2. `nvim/lua/plugins/`に`lint.lua`を作成する

※ ファイル名は何でもいい

```lua
  return {
    {
      ,
      opts = {
        linters = {
          ["markdownlint-cli2"] = {
            args = {
              "--config",
              os.getenv("HOME") .. "/.config/markdownlint/.markdownlint-cli2.yaml",
              "--",
            },
          },
        },
      },
    },
  }
```

ここまでやってNeoVimを再起動したら完了！

### ソース

1. `.markdown-cli2.yaml` : [LazyExtras markdown; How to configure markdownlint-cli2?](https://github.com/LazyVim/LazyVim/discussions/4094#discussioncomment-13234962)
2. `lint.lua` : [Feature request: global config](https://github.com/DavidAnson/markdownlint-cli2/issues/651#issuecomment-3500664954)

## 終わりに

ここで30分くらい格闘してました。
どなたかの役に立てば幸いです。
