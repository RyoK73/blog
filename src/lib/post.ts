import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";
import z from "zod";
import { format } from "date-fns";
import userCategories from "@/user-category.json";

// contentsのpathの宣言
const postDirectory = path.join(process.cwd(), "posts");

export type PostData = {
    slug: string;
    title: string;
    date: string;
    category: string;
    markdown: string;
    published: boolean;
    updatedAt?: string;
};

const categoryKeys = Object.keys(userCategories) as [string, ...string[]];

const frontMatterSchema = z.object({
    title: z.string({ error: "タイトルは必須です" }),
    category: z.enum(categoryKeys, {
        error: `${categoryKeys.join(",")}のいずれかが必須です`,
    }),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            error: "yyyy-MM-dd形式で書いてください",
        })
        .refine((val) => !isNaN(new Date(val).getTime()), {
            error: "有効な日付ではありません",
        }),
    published: z.boolean(),
    updatedAt: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            error: "yyyy-MM-dd形式で書いてください",
        })
        .refine((val) => !isNaN(new Date(val).getTime()), {
            error: "有効な日付ではありません",
        })
        .optional(),
});

export const getPostData = async (slug: string): Promise<PostData> => {
    const fullPath = path.join(postDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(fullPath);
    const postData = matter(fileContent);

    const result = frontMatterSchema.safeParse(postData.data);
    if (!result.success) {
        throw new Error(
            `${postData.data.title}のfrontmatterが不正です。${result.error.message}`,
        );
    }

    return {
        slug,
        title: result.data.title,
        category: result.data.category,
        date: format(result.data.date, "yyyy-MM-dd"),
        markdown: postData.content,
        published: result.data.published,
        updatedAt: result.data.updatedAt ? format(result.data.updatedAt, "yyyy-MM-dd") : undefined,
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
    const postDatas = await Promise.all(postDatasPromise);
    return postDatas.filter((post) => post.published);
};
