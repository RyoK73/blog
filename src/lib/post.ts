import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";
import z from "zod";
import userCategories from "@/user-category.json";

// contentsのpathの宣言
const postDirectory = path.join(process.cwd(), "posts");

export type PostData = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  category: string;
  markdown: string;
  published: boolean;
  updatedAt?: string;
  charCount: number;
  readingMinutes: number;
};

// 読了時間の目安算出に使う日本語の想定読了速度（文字/分）
const READING_SPEED_CHARS_PER_MINUTE = 500;

const countPlainTextChars = (markdown: string): number => {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, "") // コードブロック
    .replace(/`[^`]*`/g, "") // インラインコード
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 画像
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // リンク→テキストだけ残す
    .replace(/[#>*_~`-]/g, "") // 装飾記号
    .replace(/\s/g, ""); // 空白・改行
  return plainText.length;
};

const categoryKeys = Object.keys(userCategories) as [string, ...string[]];

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: "yyyy-MM-dd形式で書いてください",
  })
  .refine((val) => !isNaN(new Date(val).getTime()), {
    error: "有効な日付ではありません",
  });

const frontMatterSchema = z.object({
  title: z.string({ error: "タイトルは必須です" }),
  category: z.enum(categoryKeys, {
    error: `${categoryKeys.join(",")}のいずれかが必須です`,
  }),
  createdAt: dateStringSchema,
  published: z.boolean().default(false),
  updatedAt: dateStringSchema.optional(),
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
  const description =
    postData.content
      .replace(/^---[\s\S]*?---/, "") // frontmatterを除去
      .replace(/#+\s.+$/gm, "") // 見出し
      .replace(/\n{2,}/g, "") // 改行を削除
      .replace(/\*\*|__|~~|`/g, "") // 装飾
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // リンク→テキストだけ残す
      .trim()
      .slice(0, 120) + "...";

  const charCount = countPlainTextChars(postData.content);
  const readingMinutes = Math.max(
    1,
    Math.ceil(charCount / READING_SPEED_CHARS_PER_MINUTE),
  );

  return {
    slug,
    title: result.data.title,
    description: description,
    category: result.data.category,
    createdAt: result.data.createdAt,
    markdown: postData.content,
    published: result.data.published,
    updatedAt: result.data.updatedAt ?? undefined,
    charCount,
    readingMinutes,
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
