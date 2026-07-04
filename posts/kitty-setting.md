---
title: kittyの設定ファイル・設定方法まとめ
createdAt: "2026-07-04"
category: tech
published: false
---

## はじめに

これまでLinuxターミナルはghosttyを使っていました。
これはOmarchyディストリビューションの初期設定であり、特に不満がなかったためです。

しかし、最近日本語変換(Mozc)の変換ウィンドウのバグが発生するようになりました。

以下のIssueで指摘されてる現象と同一です。

[ghostty Issue #5645](https://github.com/ghostty-org/ghostty/discussions/5645)

端的に言えば、画面Windowのおよそ1/8よりの位置で日本語入力を行うと変換候補ウィンドウが入力位置に被さってしまいます。

リアルブライドタッチになってしまいます。

そこでこのバグが発生しない*kitty*に乗り換えることに決めました。

本記事では乗り換え時の設定やコンフィグファイルなどをまとめていきます。

## Omarchyでのターミナルの切り替え方法

このブログを見ている人でOmarchyユーザーがどれほどいるかわかりませんが、念の為書いておきます。

以下の順に操作すれば起動時や*Super + Enter*時の起動ターミナルを変更可能です。

1. _Super + Alt + Space_
2. Install
3. Terminal
4. Kitty
