---
title: コード設計の際には副作用を持たせないように考えよう
createdAt: "2026-06-05"
category: tech
published: false
---

## 副作用とは

基本的に1つの関数が返すのは1つの結果である。
1つの目的の達成のために関数を書くとも言える。

この目的・結果を**主作用**だとすると、これらの結果以外に達成しようとする目的が**副作用**となる

例えば以下のようなパターン

```ts
let favoriteFruits: string[];

const getDislikeFruits = async () => {
    const fruits = await getFruits();
    const favoriteFruits = fruits.favorite;
    return fruits.dislike;
};
```

極端ではあるが、`getDislikeFruits()`で期待するのは`fruits.dislike`であるのに対し、
内部では`fruits.favorite`も返している。

つまり、嫌いな果物を取得するつもりが、好きな果物も取得してしまっており、`getDislikeFruits()`関数の責任が分離できていないことになる。

そのため以下のように書いたほうがよい。

```ts
const fruits = await getFruits();

const getDislikeFruits = () => {
    return fruits.dislike;
};

const getFavoriteFruits = () => {
    return fruits.favorite;
};
```

(正直関数化する必要ないですが...)

今回は簡単すぎる例であるが、このように関数は一つの結果を返すよう設計するべきである。
