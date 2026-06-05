import * as p from "@clack/prompts";
import { format } from "date-fns";
import userCategories from "@/user-category.json";
import path from "path";
import fs from "fs/promises";
import consola from "consola";
import matter from "gray-matter";
import { spawn } from "child_process";

const editor = process.env.EDITOR ?? "vi";
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

const edit = async () => {
    p.intro("記事編集のセットアップを開始します");

    const postsDir = path.join(process.cwd(), "posts");
    const files = await fs.readdir(postsDir);
    const slugs = files
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));

    if (slugs.length === 0) {
        p.cancel("編集可能な記事が見つかりません");
        process.exit(0);
    }

    let parsed: matter.GrayMatterFile<string> | undefined;

    const result = await p.group(
        {
            slug: () =>
                p.select({
                    message: "編集する記事を選んでください",
                    options: slugs.map((slug) => ({
                        value: slug,
                        label: slug,
                    })),
                }),
            published: async ({ results }) => {
                const raw = await fs.readFile(
                    path.join(postsDir, `${results.slug}.md`),
                    "utf-8",
                );
                parsed = matter(raw);
                return p.confirm({
                    message: "公開状態を設定してください（published）",
                    initialValue:
                        (parsed.data.published as boolean | undefined) ?? false,
                });
            },
            updatedAt: () =>
                p.date({
                    message: "更新日付を選んでください（updatedAt）",
                    format: "YMD",
                    initialValue: parsed?.data.updatedAt
                        ? new Date(parsed.data.updatedAt as string)
                        : new Date(),
                }),
        },
        {
            onCancel: () => {
                p.cancel("キャンセルしました");
                process.exit(0);
            },
        },
    );

    const postFullPath = path.join(postsDir, `${result.slug}.md`);

    const newFrontmatter: Record<string, unknown> = {
        ...parsed!.data,
        published: result.published,
        updatedAt: format(result.updatedAt, "yyyy-MM-dd"),
    };

    const newContent = matter.stringify(parsed!.content, newFrontmatter);

    try {
        await fs.writeFile(postFullPath, newContent);
    } catch (e) {
        consola.warn(e);
    }

    p.outro("記事の更新完了!");
    consola.info(`${postFullPath} を更新しました`);

    await openByEditor(postFullPath);
};

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

if (process.argv.includes("--edit")) {
    edit();
} else {
    create();
}
