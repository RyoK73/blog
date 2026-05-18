import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";

// contentsのpathの宣言
const postDirectory = path.join(process.cwd(), "posts");

// 関数の戻り値の型宣言
export type PostData = {
    slug: string;
    contentMarkdown: string;
    date: string;
    title: string;
    tag: string[];
};
// mdファイルをreactコンポーネントに変換する関数
const getPostData = async (slug: string): Promise<PostData> => {
    const fullPath = path.join(postDirectory, `${slug}.md`);
    // mdファイルの取得
    const fileContent = await fs.readFile(fullPath);
    // gray-matterでmdファイルのfrontmatterを取得
    const mdData = matter(fileContent);

    // PostDataを返す
    return {
        slug,
        contentMarkdown: mdData.content,
        date: mdData.data.date,
        title: mdData.data.title,
        tag: (mdData.data.tag as string[]).sort(),
    };
};

// ./posts/のコンテンツを取得して、PostData[]を返す
export const getAllPosts = async (): Promise<PostData[]> => {
    const postFiles = await fs.readdir(postDirectory);
    const postContents = postFiles.map(async (postFile) => {
        const slug = path.parse(postFile).name;
        return await getPostData(slug);
    });
    return await Promise.all(postContents);
};
