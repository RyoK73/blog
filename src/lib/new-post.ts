import * as p from "@clack/prompts";
import { format } from "date-fns";
import userCategories from "@/user-category.json";
import path from "path";
import fs from "fs/promises";
import consola from "consola";

const main = async () => {
    p.intro("記事作成のセットアップを開始します");

    const result = await p.group(
        {
            slug: () =>
                p.text({
                    message: "slugを入力してください",
                    placeholder: "input-slug-title",
                }),

            title: () =>
                p.text({
                    message: "ブログタイトルを入力してください",
                    placeholder: "ブログタイトル...",
                }),

            date: () =>
                p.date({
                    message: "日付を選んでください",
                    format: "YMD",
                    initialValue: new Date(),
                }),

            category: () =>
                p.select({
                    message: "記事カテゴリを選んでください",
                    options: Object.entries(userCategories).map(
                        ([key, value]) => {
                            return { value: key, label: key, hint: value };
                        },
                    ),
                }),
        },
        {
            onCancel: () => {
                p.cancel("キャンセルしました");
                process.exit(0);
            },
        },
    );

    const postFullPath = path.join(process.cwd(), "posts", `${result.slug}.md`);

    // frontmatter生成用にインデントをコード中のインデントを削除
    const frontmatter = `
---
title: ${result.title}
date: ${format(result.date, "yyyy-MM-dd")}
category: ${result.category}
---
    `;
    try {
        await fs.writeFile(postFullPath, frontmatter);
    } catch (e) {
        consola.warn(e);
    }

    p.outro("記事作成完了!");

    consola.info(`${postFullPath}を作成しました`);
};

main();
