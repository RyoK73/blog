---
title: git管理ブログの記事作成CLI構成の紹介 with clack/prompts
createdAt: "2026-06-15"
category: tech
published: true
---

## はじめに

今回は、当ブログで採用しているCLIベースのブログ作成・編集補助機能を紹介します。

この記事を読むと、`@clack/prompts` で記事作成 CLI を自作し、`pnpm post` 一発で frontmatter 付きの MDファイルを生成できるようになります

[`@clack/prompts`](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)を使用した構成となっており、技術ブログ書き始めの方だけでなく、管理しにくさを感じてる方にもおすすめです。

## `@clack/prompts`について

Node.jsで動作する、**会話式のCLIを構成できるライブラリ**です。

> @clack/prompts is an opinionated, pre-styled wrapper around @clack/core.

> 🤏 80% smaller than other options
> 💎 Beautiful, minimal UI
> ✅ Simple API
> 🧱 Comes with text, password, confirm, date, select, autocomplete, selectKey, multiselect, path, and spinner components

> [公式README.mdより抜粋](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)

## 基本文法

### `p.intro()` / `p.outro()`

CLIセッションの開始・終了を示すメッセージを表示します。ボックスで囲まれた見た目になり、処理の区切りが一目でわかります。

```ts
p.intro("セットアップ開始");
// ... 処理 ...
p.outro("完了!");
```

### `p.text()`

テキストを入力させるプロンプトです。`validate` を渡すと入力値のバリデーションができます。

```ts
const name = await p.text({
  message: "名前を入力してください",
  placeholder: "例: Taro",
  validate(value) {
    if (!value) return "入力必須です";
  },
});
```

### `p.select()`

`options` の配列から一つを選ばせるプロンプトです。

```ts
const lang = await p.select({
  message: "言語を選んでください",
  options: [
    { value: "ts", label: "TypeScript" },
    { value: "js", label: "JavaScript" },
  ],
});
```

### `p.date()`

カレンダー形式で日付を選ばせるプロンプトです。`format` で表示形式、`initialValue` で初期値を指定できます。

```ts
const date = await p.date({
  message: "日付を選んでください",
  format: "YMD",
  initialValue: new Date(),
});
```

### `p.confirm()`

はい/いいえを確認するプロンプトです。`boolean` が返ります。

```ts
const ok = await p.confirm({ message: "続けますか？" });
```

### `p.isCancel()` / `p.cancel()`

ユーザーが `Ctrl+C` を押してキャンセルした場合、各プロンプトはキャンセルシンボルを返します。`p.isCancel()` でそれを検知し、`p.cancel()` でメッセージを表示して終了します。

```ts
if (p.isCancel(result)) {
  p.cancel("キャンセルしました");
  process.exit(0);
}
```

### `p.group()`

複数のプロンプトをまとめて実行し、全結果を一つのオブジェクトで受け取ります。`onCancel` にキャンセル処理を渡せるため、各プロンプトに個別のキャンセル処理を書かずに済みます。

```ts
const result = await p.group(
  {
    name: () => p.text({ message: "名前を入力" }),
    lang: () =>
      p.select({
        message: "言語を選択",
        options: [
          { value: "ts", label: "TypeScript" },
          { value: "js", label: "JavaScript" },
        ],
      }),
  },
  {
    onCancel: () => {
      p.cancel("キャンセルしました");
      process.exit(0);
    },
  },
);
// result.name, result.lang で各値にアクセス
```

## 実際の構成

実際のファイルは[こちら](https://github.com/RyoK73/blog/blob/main/src/lib/new-post.ts)に。

### 主要なライブラリ

1. `@clack/prompts`: 会話式のCLIを構成するため
2. `child_process`: シェルコマンドを実行するため。`@clack/prompts`ではシェルコマンドの実行を行えません。
3. `consola`: わかりやすい通知を行うため

### コード

紹介するのは記事作成を担う`create`関数です。

記事ファイル作成に必要な

- slug
- 記事タイトル
- 作成日
- カテゴリ

の入力を促します。

それらでMDファイルの`frontmatter`を構成し記事の作成を行っています。

#### 補助関数

```ts
const openByEditor = async (path: string) => {
  const shouldOpen = await p.confirm({ message: `${editor}で開きますか？` });
  if (shouldOpen) {
    const child = spawn(editor, [path], { stdio: "inherit" });
    child.on("error", (err: Error) => {
      consola.warn("起動失敗:", err.message);
    });
  }
};

const cancel = () => {
  p.cancel("キャンセルしました。");
  process.exit(0);
};
```

#### メイン関数

```ts
const create = async () => {
  p.intro("記事作成のセットアップを開始します");

  const result = await p.group(
    {
      slug: () =>
        p.text({
          message: "slugを入力してください",
          placeholder: "input-slug-title",
          validate(value) {
            if (!value) return "slugを入力してください";
            if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
              return "英小文字・数字・ハイフンのみ使用可";
            }
            return;
          },
        }),

      title: () =>
        p.text({
          message: "ブログタイトルを入力してください",
          placeholder: "ブログタイトル...",
          validate(value) {
            if (!value) return "タイトルを入力してください";
          },
        }),

      createdAt: () =>
        p.date({
          message: "日付を選んでください",
          format: "YMD",
          initialValue: new Date(),
        }),

      category: () =>
        p.select({
          message: "記事カテゴリを選んでください",
          options: Object.entries(userCategories).map(([key, value]) => {
            return { value: key, label: key, hint: value };
          }),
        }),
    },
    {
      onCancel: () => cancel(),
    },
  );

  if (p.isCancel(result)) {
    cancel();
    return;
  }

  const postFullPath = path.join(process.cwd(), "posts", `${result.slug}.md`);

  const frontmatter: Record<string, unknown> = {
    title: result.title,
    createdAt: format(result.createdAt, "yyyy-MM-dd"),
    category: result.category,
    published: false,
  };
  try {
    await fs.writeFile(postFullPath, matter.stringify("", frontmatter));
  } catch (e) {
    consola.warn(e);
  }

  p.outro("記事作成完了!");

  consola.info(`${postFullPath}を作成しました`);

  await openByEditor(postFullPath);
};
```

```json
"scripts": {
  "dev": "next dev & sleep 2 && xdg-open http://localhost:3000",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "post": "npx tsx src/lib/new-post.ts"
},

```

### 手こずった点

`group`処理のあとのこちらの記述、一見`group`内でキャンセル処理を行っているため到達できないデッドコードのように見えます。
しかし、`group`のキャンセル処理は内部の記述に対して渡されるだけであり、`group`処理自体のキャンセルに対しては適用されません。

そのため、この記述がない場合、`group`そのもののキャンセル処理が行われずに後続の処理自体が実行されてしまっていました。

```ts
if (p.isCancel(result)) {
  cancel();
  return;
}
```

## おわりに

**Gitで技術ブログ管理**はエンジニア向けブログとしては非常に一般的なものですが、どうやって管理するかにフォーカスして語られることは少ないように感じます。

特に画像対応や記事管理については、専用のGUIを持つブログサービスに数歩劣ります。
また、正直にいって、Next.jsでの個人テックブログは世の中にテンプレートも出回っており、過度にカスタムしなければさほど難易度も高くありません。

そのため、それらに対し如何に*書きやすさ*や*管理しやすさ*、独自の魅力で勝負するかが、個人テックブログに求められていると思っています。

この`clack/prompts`によるCLIの魅力は、なんといっても**作成したいときに一瞬で作成できる**ことにあります。

`pnpm post`だけで記事作成時の諸設定を簡単に完了できます。

今後も、より使いやすくなるよう改善していきたいですね。

それでは... ヾ('ω'⊂ )))Σ≡ｻﾗﾊﾞ
