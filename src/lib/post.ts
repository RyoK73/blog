import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";

// contentsのpathの宣言
const postDirectory = path.join(process.cwd(), "posts");

// 関数の戻り値の型宣言
export type PostData = {
    slug: string;
    markdown: string;
    date: string;
    title: string;
    tags: string[];
};
// mdファイルをreactコンポーネントに変換する関数
export const getPostData = async (slug: string): Promise<PostData> => {
    const fullPath = path.join(postDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(fullPath);
    const postData = matter(fileContent);

    // PostDataを返す
    return {
        slug,
        markdown: postData.content,
        date: postData.data.date,
        title: postData.data.title,
        tags: (postData.data.tag as string[]).sort(),
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
