---
title: git管理ブログの記事作成CLI構成の紹介 with clack/prompts
createdAt: "2026-06-15"
category: tech
published: true
---

## はじめに

今回は、当ブログで採用しているCLIベースのブログ作成・編集補助機能を紹介します。

[`@clack/prompt`](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)を使用した構成となっており、技術ブログ書き始めの方だけでなく、管理しにくさを感じてる方にもおすすめです。

## `@clack/prompts`について

Node.jsで動作する、**会話式のCLIを構成できるライブラリ**です。

> @clack/prompts is an opinionated, pre-styled wrapper around @clack/core.

> 🤏 80% smaller than other options
> 💎 Beautiful, minimal UI
> ✅ Simple API
> 🧱 Comes with text, password, confirm, date, select, autocomplete, selectKey, multiselect, path, and spinner components

> [公式README.mdより抜粋](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)

## 基本文法

## 実際の構成

実際のファイルは[こちら](https://github.com/RyoK73/blog/blob/main/src/lib/new-post.ts)に。

### 主要なライブラリ

1. `@clack/prompts`: 会話式のCLIを構成するため
2. `child_process`: ターミナル処理を実行するため
3. `concola`: わかりやすい通知を行うため

### コード

紹介するのは記事作成を担う`create`関数です。

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
