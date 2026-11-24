---
version: alpha
name: Blog Portfolio
description: ポートフォリオとして、墨色と温かい紙色を基調にしたミニマルなデザイン。格子の背景から、大きなタイルが浮いて見える。ライトとダークの両方を持つ。
colors:
  primary: "#1E1A16"
  primary-foreground: "#F8F7F3"
  background: "#F8F7F3"
  foreground: "#1E1A16"
  card: "#FDFCFA"
  muted: "#EFECE8"
  accent: "#ECE9E4"
  muted-foreground: "#67635D"
  border: "#DDDAD5"
  input: "#D3D1CB"
  ring: "#847F7A"
  destructive: "#BE2323"
  brand: "#1F5DC2"
  grid-line: "#E0DED8"
  background-dark: "#2C2A27"
  foreground-dark: "#EDEBE7"
  card-dark: "#363431"
  muted-dark: "#3E3B38"
  accent-dark: "#44423F"
  muted-foreground-dark: "#A7A49F"
  ring-dark: "#A7A49F"
  destructive-dark: "#F7857D"
  brand-dark: "#7CB4FC"
typography:
  hero:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.2
  hero-mobile:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
  section-title:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.3
  section-title-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
rounded:
  base: 10px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  grid: 80px
  grid-sub: 16px
components:
  tile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.base}"
    padding: 32px
  tile-mobile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.base}"
    padding: 20px
  mini-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.base}"
    padding: 16px
---

## Overview

このサイトは、書き手のポートフォリオです。
訪れた人に、作ったもの、考えたこと、読んだものを、短い時間で見せることを目的にします。

見た目は、ミニマルに保ちます。
色は、墨色と少し温かい紙色を基調にし、強調の色は青の1色だけにします。
背景は方眼紙のような格子にして、その上に大きなタイルを浮かせます。

この文書は、レイアウト刷新(#124)、About(#125)、Works、ランディング(#127, #139)の各Issueが、前提にする方針です。
決めるのは、色、タイポグラフィ、余白、ナビ形式、トップのタイルの形までです。
詳細ページの内部レイアウトと、既存コンポーネントの撤去や再設計は、各Issueで扱います。

## Colors

色の配色は、墨色の文字、青の強調、温かい紙色の背景、炭色のダークで構成します。
トークン名は、shadcn の変数名(`--background`、`--foreground`、`--card` など)を起点にしています。
`-dark` の接尾辞があるトークンはダーク用の値で、接尾辞がないものはライト用、または両モード共通です。
`src/app/globals.css` には、これらを oklch に変換して定義しています。

### Shared

- **primary / foreground (`#1E1A16`)**: 墨の色です。
  文字と、主要ボタンの塗りに使います。
- **brand (`#1F5DC2`)**: 強調の青で、唯一の有彩色です。
  `globals.css` では `--vivid` として定義しています(ダークは `#7CB4FC`)。
  リンクのホバー、現在地、`border-flow` のホバー枠に使います。
  主要ボタンの塗りには使いません。
- **destructive (`#BE2323`)**: エラーと削除です。
  意味を持つ色は、これだけです。

### Light mode

- **background (`#F8F7F3`)**: ページの地の色で、少し温かい白です。
  半透明にはせず、不透明にします。
- **card (`#FDFCFA`)**: タイルとポップアップの塗りです。
  不透明で、背景の格子を隠します。
  `popover` も同じ色です。
- **muted (`#EFECE8`) / accent (`#ECE9E4`)**: ホバーや控えめな面に使います。
  `secondary` は `muted` と同じ色です。
- **muted-foreground (`#67635D`)**: 補助的な文字です。
- **border (`#DDDAD5`) / input (`#D3D1CB`) / ring (`#847F7A`)**: 細い区切り、入力欄の枠、フォーカスリングです。
- **grid-line (`#E0DED8`)**: 背景の格子の太線です。
  細線(`--grid-subline`)は、同じ色を50%の濃さにします。

### Dark mode

暗すぎない、持ち上げた炭色です。
真っ黒は使いません。

- **background-dark (`#2C2A27`) / card-dark (`#363431`)**: ページとタイルです。
  `card` は不透明です。
- **foreground-dark (`#EDEBE7`)**: 文字です。
  `primary` も同じ色で、`primary-foreground` は `background-dark` です。
- **muted-dark (`#3E3B38`) / accent-dark (`#44423F`)**: ホバーや控えめな面に使います。
- **muted-foreground-dark (`#A7A49F`)**: 補助的な文字です。
- **destructive-dark (`#F7857D`) / brand-dark (`#7CB4FC`)**: ダーク用に明るくした値です。
- **ring-dark (`#A7A49F`)**: フォーカスリングです。
- 区切りは白の12%(`border`)、入力欄の枠は白の15%(`input`)、格子の太線は白の8%、細線は白の3%で表します。

### 色の出典

配色は、別アプリの `DESIGN.md` の色を、ほぼそのまま採用しています。
ただし、`ring-dark` と、ダークの `input`(白の15%)は、元の `DESIGN.md` に値がなかったため、このサイト用に決めています。

## Typography

フォントは、現状のまま `Geist`(本文・見出し)と `Geist Mono`(コード)を使います。
`layout.tsx` で読み込んでいるものを変えません。

| 役割          | モバイル(`lg` 未満) | `lg` 以上 | 太さ | 行間 | 使う場所                             |
| ------------- | ------------------- | --------- | ---- | ---- | ------------------------------------ |
| hero          | 30px                | 48px      | 700  | 1.2  | Who I Am の2行                       |
| section-title | 24px                | 30px      | 600  | 1.3  | 各タイルの見出し                     |
| body          | 16px                | 16px      | 400  | 1.7  | 本文、カードの説明                   |
| label         | 14px                | 14px      | 500  | 1.4  | ボタン、「もっと見る」、補助的な文字 |

Tailwind では、次のクラスに対応します。

- hero は `text-3xl lg:text-5xl font-bold`。
- section-title は `text-2xl lg:text-3xl font-semibold`。
- body は `text-base`。行間は `leading-[1.7]` にします。
- label は `text-sm font-medium`。

## Layout

### 余白

余白は、4px を基準にした 4 / 8 / 16 / 24 / 48px のスケールを使います。
背景の格子は、太線 80px、細線 16px のまま維持します。
タイルの寸法は、格子の倍数には揃えません。

### トップのタイル

トップ `/` は、4つのセクションを縦に並べます。
各セクションは、背景から浮いた大きなタイルにします。

| 順  | セクション   | 画像の位置 | 遷移先   |
| --- | ------------ | ---------- | -------- |
| 1   | Who I Am     | 左         | `/about` |
| 2   | What I Build | 右         | `/build` |
| 3   | What I Think | 左         | `/think` |
| 4   | What I Read  | 右         | `/read`  |

- タイルの最大幅は 1152px(`max-w-6xl`)で、中央に置きます。
- タイル間の gap は 48px です。
- タイル内の padding は、`lg` 以上が 32px、`lg` 未満が 20px です。
- 画像は、タイル幅の約1/3を占めます。
  縦横比は、`lg` 以上が 4:3、`lg` 未満が 16:9 です。
  画像は、セクションごとの固定画像です。
- Who I Am は、画像の横に、文字2行の hero を置きます。
- Build / Think / Read は、画像の横の空きに、section-title と、小タイル(`mini-card`)3つ程度を並べます。
- `lg` 未満では、左右交互をやめます。
  画像を上、コンテンツを下にした縦積みにします。
  小タイルは、1列、または横スクロールにします。

### ナビ

ナビは、廃止します。

- ヘッダーは、ロゴ(トップへ戻る)とテーマ切替だけにします。
- 詳細ページ(`/about` `/build` `/think` `/read`)へは、トップの各タイルの「もっと見る」から遷移します。
- モバイルの下部固定タブは、設けません。

## Elevation & Depth

タイルは、塗り、細い枠、強めの影の3つで、背景から浮かせます。

- 塗りは `card`、枠は 1px の `border` です。
- 影は、ライトが `0 12px 32px -8px oklch(0 0 0 / 0.18)`、ダークが `0 12px 32px -8px oklch(0 0 0 / 0.5)` です。
- 別アプリの `DESIGN.md` には「強い影は使わない」という方針がありました。
  このサイトでは、タイルを背景から浮かせるために、意図的に強い影を使います。
- 影を付けるのは、タイルだけにします。
  `mini-card` やボタンには、影を付けません。

## Shapes

枠は、現状の直線と角丸を維持します。
角丸の基準は `--radius`(0.625rem = 10px)です。
別アプリの手描き風の歪んだ枠(`brush-a` / `brush-b`)は、採用しません。

## Components

- **tile**: トップの大きなセクション枠です。
  塗りは `card`、文字は `foreground` です。
- **mini-card**: タイルの中に並べる小さなカードです。
  塗りは `card`、枠は 1px の `border` で、影は付けません。
- **ポップアップ**: 検索や、メニューなどのポップアップは、`popover` を使います。
  `popover` は `card` と同じ色です。
- **border-flow**: 既存のホバーアニメーションで、残します。
  枠の色は `--vivid` に追従するため、青になります。
- 既存の `CustomCard`、`CustomTabs`、`CustomCategory`、`SidebarLayout` の撤去や再設計は、別Issue(#124, #130 など)で扱います。

## Do's and Don'ts

コントラスト比は、WCAG の式で、このリポジトリの色の組み合わせから計算した値です。

### Both modes

- 主要な操作の塗りは、墨の `foreground` にします。
  青を、主要ボタンの塗りに使わないでください。
- 強調の青は、`brand` の1色だけです。
  ほかの有彩色を、装飾に足さないでください。
- 格子の線(`grid-line`)は、装飾です。
  ライトの背景との比は 1.25:1 と低いため、情報を伝える線には使わないでください。
- 別アプリの `Zen Kurenaido` と `paint-*` は、採用しません。

### Light mode

| 組み合わせ                        | コントラスト比 | 判定                                   |
| --------------------------------- | -------------- | -------------------------------------- |
| `foreground` / `background`       | 16.13:1        | 本文に使える                           |
| `foreground` / `card`             | 16.86:1        | 本文に使える                           |
| `muted-foreground` / `background` | 5.57:1         | 補助的な文字に使える(AA)               |
| `muted-foreground` / `card`       | 5.82:1         | 補助的な文字に使える(AA)               |
| `brand` / `background`            | 5.76:1         | 青の文字に使える(AA)                   |
| `brand` / `card`                  | 6.02:1         | 青の文字に使える(AA)                   |
| `destructive` / `background`      | 5.67:1         | エラーの文字に使える(AA)               |
| `destructive` / `card`            | 5.93:1         | エラーの文字に使える(AA)               |
| `ring` / `background`             | 3.70:1         | フォーカスリングに使える(UI部品の 3:1) |
| `border` / `background`           | 1.30:1         | 区切りの装飾で、情報を伝えない         |

### Dark mode

| 組み合わせ                                  | コントラスト比 | 判定                                   |
| ------------------------------------------- | -------------- | -------------------------------------- |
| `foreground-dark` / `background-dark`       | 12.02:1        | 本文に使える                           |
| `foreground-dark` / `card-dark`             | 10.42:1        | 本文に使える                           |
| `muted-foreground-dark` / `background-dark` | 5.76:1         | 補助的な文字に使える(AA)               |
| `muted-foreground-dark` / `card-dark`       | 5.00:1         | 補助的な文字に使える(AA)               |
| `brand-dark` / `background-dark`            | 6.67:1         | 青の文字に使える(AA)                   |
| `brand-dark` / `card-dark`                  | 5.79:1         | 青の文字に使える(AA)                   |
| `destructive-dark` / `background-dark`      | 5.86:1         | エラーの文字に使える(AA)               |
| `destructive-dark` / `card-dark`            | 5.09:1         | エラーの文字に使える(AA)               |
| `ring-dark` / `background-dark`             | 5.76:1         | フォーカスリングに使える(UI部品の 3:1) |

## 今回の範囲外

- 詳細ページ(`/about` `/build` `/think` `/read`)の内部レイアウトは、各Issueで決めます。
  共通の前提は、この文書の色とタイポグラフィのトークンを使うことだけです。
- ナビ、レイアウト、各コンポーネントのコードの変更は、別Issueで行います。
- `sidebar-*`、`chart-*`、`--bg-code`、`--content-background` のトークンは、今回は変更していません。
  記事機能と Sidebar の撤去(#124, #130)で、あわせて見直します。
