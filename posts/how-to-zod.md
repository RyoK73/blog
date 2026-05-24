---
title: "TypeScript Zodの使い方 まとめ"
date: "2026-05-24"
category: "tech"
---
# ZODとは
データの検証用ライブラリ
データスキーマを定義し、単純なデータ型から複雑なオブジェクトまで様々なデータを検証することができる

## 参考
https://zod.dev

# 基本的な使い方
```ts
import z from "zod"

const <zod-object> = z.object(<data-schema>)
const result =<zod-object>.safeParse(<object>)
if (!result.success){
  result.error;
} else {
  result.data;
}

```

## data-schemaの定義
```ts
const categoryKeys = ["tech","life","idea"]
const postSchema = z.object({
    title: z.string({ error: "タイトルは必須です" }),
    category: z.enum(categoryKeys, {
        error: `${categoryKeys.join(",")}のいずれかが必須です`,
    }),
    date: z
        .string("日付は必須です")
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            error: "YYYY-MM-DD形式で入力してください",
        }),
    markdown: z.string(),
});
```

## エラーになると...?
### `result.error`の戻り値
```ts
   /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] */
```
この戻り値を使って、エラーメッセージをカスタマイズし処理を行う
- `expected`
- `code`
- `path`
- `message`
### 処理を止めたいなら...
```ts
    if (!result.success) {
        throw new Error(`記事のfrontmatterが不正です。${result.error.message}`);
    }
```

