import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";
import z from "zod";
import userCategories from "@/user-category.json";

// contentsのpathの宣言
const postDirectory = path.join(process.cwd(), "posts");

// 関数の戻り値の型宣言
export type PostData = {
    slug: string;
    markdown: string;
    date: string;
    title: string;
    category: string;
};

const categoryKeys = Object.keys(userCategories);
const frontMatterSchema = z.object({
    title: z.string({ error: "タイトルは必須です" }),
    category: z.enum(categoryKeys, {
        error: `${categoryKeys.join(",")}のいずれかが必須です`,
    }),
    date: z.string("日付は必須です").regex(/^\d{4}-\d{2}-\d{2}$/, {
        error: "YYYY-MM-DD形式で入力してください",
    }),
});

export const getPostData = async (slug: string): Promise<PostData> => {
    const fullPath = path.join(postDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(fullPath);
    const postData = matter(fileContent);

    const result = frontMatterSchema.safeParse(postData.data);
    if (!result.success) {
        throw new Error(`記事のfrontmatterが不正です。${result.error.message}`);
    }

    // PostDataを返す
    return {
        slug,
        title: postData.data.title,
        category: postData.data.category,
        date: postData.data.date,
        markdown: postData.content,
    };
};

// ./posts/のコンテンツを取得して、PostData[]を返す
export const getSlugs = async (): Promise<string[]> => {
    const posts = await fs.readdir(postDirectory);
    return posts.map((post) => path.parse(post).name);
};

export const getAllPostData = async (): Promise<PostData[]> => {
    const slugs = await getSlugs();
    const postDatasPromise = slugs.map(async (slug) => await getPostData(slug));
    return Promise.all(postDatasPromise);
};
