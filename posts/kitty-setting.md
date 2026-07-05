---
title: Omarchyでghostty + Mozcの変換候補ウィンドウ表示バグをkittyへの乗換で解決する
createdAt: "2026-07-04"
category: tech
published: true
---

## はじめに

これまでLinuxターミナルはghosttyを使っていました。
これはOmarchyディストリビューションの初期設定であり、特に不満がなかったためです。

しかし、最近日本語変換(Mozc)の変換ウィンドウのバグが発生するようになりました。

以下のIssueで指摘されてる現象と同一です。

[ghostty Discussion #5645](https://github.com/ghostty-org/ghostty/discussions/5645)

端的に言えば、画面Windowのおよそ1/8よりの位置で日本語入力を行うと変換候補ウィンドウが入力位置に被さってしまいます。

リアルブラインドタッチになってしまいます。
また、Nvim・Claude Codeなどターミナルベースのアプリも同様にこのバグの影響を受けます。

そこでこのバグが発生しない*kitty*に乗り換えることに決めました。

本記事では乗り換え時の設定やコンフィグファイルなどをまとめていきます。
今回はOmarchyユーザー向けの解説になってますが、Linuxであれば大体似たようなディレクトリ構造なので置き換えて読んでいただれば幸いです。

## Omarchyでのターミナルの切り替え方法

このブログを見ている人でOmarchyユーザーがどれほどいるかわかりませんが、念の為書いておきます。

以下の順に操作すれば起動時や*Super + Enter*時の起動ターミナルを変更可能です。

1. _Super + Alt + Space_
2. Install
3. Terminal
4. Kitty

## 各種設定ファイルの配置

### ghostty

- コンフィグ: `~/.config/ghostty/config`
- テーマ: `~/.config/omarchy/current/theme/ghostty.conf`
  コンフィグ内で`config-file = ?"~/.config/omarchy/current/theme/ghostty.conf"`で参照されています。

### kitty

- コンフィグ: `~/.config/kitty/kitty.conf`
- テーマ: `~/.config/omarchy/current/theme/kitty.conf`
  コンフィグ内で`include ~/.config/omarchy/current/theme/kitty.conf`で参照されています。

## フォント

### 書き方テンプレ

[公式ガイド](https://sw.kovidgoyal.net/kitty/kittens/choose-fonts/#font-spec-syntax)

```conf
font_family family="PlemolJP Console NF" style="SemiBold"
font_size        13

```

### 色

例えばこんなふうに書けます。

```conf
background        #1a1b1e
foreground         #cdd6f4
background_opacity 1

```

ただ、kittyにはthemeを指定できる`kitten`という仕組みが用意されています。

```bash
# テーマ一覧を表示
kitten themes

# テーマを指定(今回はAtom)
kitten themes Atom
```

他にも拡張要素を設定できるようですので、機を見て触ってみてください。

## おわり

以上でkittyに乗り換え、変換候補ウィンドウの表示バグとはおさらばです！

今までコーディングや記事執筆で煩わしく思っていた問題がやっと解決できて感動しています笑

Linux + 日本語入力という非常にマイナーな環境ですが、どこかで困っている人の役に立てると嬉しいです。
