---
title: TypeScriptの型推論問題に学ぶ数値セパレーターとデータ型
createdAt: "2026-06-09"
category: tech
published: true
---

## はじめに

みなさん、ぐんも！

今回は[Xで出題されていた](https://x.com/pt_kokoro/status/2062055805231456386?s=20)、TypeScriptのデータ型推論問題についてTypeScript学習者向けに解説します。

この記事を読めば、

1. 数値セパレーター
2. リテラル型

について理解を深めることができます。

## 出題

```ts
const rates = {
  "Node.js": 800_000,
  Rust: 900_000,
} as const;

type Rate = (typeof rates)["Node.js"];
```

> このとき、`Rate`に推論される型はなんでしょうか？

1. number
2. 800000
3. string
4. never

   ...

> 答えは... `800000`でした！！

(この記事を書いたということはつまり、私は間違えたということです笑)

## Numeric Separator(数値セパレーター)

まず、`"Node.js": 800_000`について...
この`_`が曲者です。私は知りませんでした。

結論、`_`は一般的には`,`として使われる数値を区切る記号です。

プログラミング以外の場面では、金額表記や、2進数表記などで数値を区切る場面が多々存在します。

- 300,000円
- 0001 1110(2)

このような数値の区切りを表したいとき、

```ts
const rates = {
 "Node.js": 800,000,
  Rust: 800 000
};

```

上記のように書くことはできません。
その代わりとして、`_`が使われています。

また、プログラム上はあくまで**区切り**としての意味しか持たないため、`800_000`は`800000`として扱われます。

## `as const`

オブジェクトや配列を完全に読み取り専用とし、リテラル型に固定するTypeScript構文です。

### リテラル型

[リテラル型](https://typescriptbook.jp/reference/values-types-variables/literal-types)
これは**プリミティブ型の特定の値だけを代入可能にする型**のことです。

今回の出題でれば、`rates["Node.js"]`は`800000`という値しか受け付けないということになります。

最もシンプルに書くならば以下のように記述します。

```ts
const isTrue: true = true;
const numelic: 345 = 345;
const greeting: "こんにちは" = "こんにちは";
```

---

そして、これをオブジェクトや配列に適用するとき`as const`を使用します。

```ts
const fruits = {
  favorite: "みかん",
  soso: "りんご",
} as const;
```

このとき、`fruits.favorite`に格納できる値は**みかん**のみとなります。
また、`fruits`の**値の型**は`"みかん" | "りんご"`のunion型となります。

### リテラル型の利点

このようにリテラル型で宣言するメリットとして以下が挙げられます。

1. 定数の型定義として使用することができる
2. 関数の引数などで、型・バリデーション・補完を引数だけで記述できる

具体例で見てみましょう。

リテラル型で定義することで、気づきにくいタイポを防ぐことができます。

```ts
const DIRECTION = { UP: "up", DOWN: "down" } as const;

// 1. 定数の型定義としての利用
// OK例 タイポにならない
if (direction === DIRECTION.UP) {
}

// NG例 タイポ
if (direction === "uo") {
}
```

リテラル型を使うことで関数を呼び出した時点で、補完はもちろん引数のバリデーション(正しいか)、データ型のチェックまで行うことができます。

```ts
const DIRECTION = { UP: "up", DOWN: "down" } as const;

// 関数 リテラル型で定義
function move(dir: "up" | "down") {
  // ここに来た時点で、"up" | "down" であることが保証される
}

move(DIRECTION.UP);

// リテラル型を使わずに定義
function move(dir: string) {
  // 実行時に"up" | "down"が検証される
  if (dir !== "up" && dir !== "down") {
    throw new Error("invalid!");
  }
}
```

## さいごに

`(typeof rates)["Node.js"]`はリテラル型`800000`として解決されます。
そのため、`Rate`のデータ型は`800000`となります。

みなさんは正解できましたか？
