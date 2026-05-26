import { getAllPostData, getPostData } from "@/lib/post";
import { CustomCategory } from "@/components/common/CustomCategory";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

type Props = {
    category: string;
    slug: string;
};
export const generateStaticParams = async () => {
    const posts = await getAllPostData();
    return posts.map((post) => ({
        category: post.category,
        slug: post.slug,
    }));
};

const BlogPage = async ({ params }: { params: Promise<Props> }) => {
    const { category, slug } = await params;
    const postData = await getPostData(slug);

    if (postData.category !== category) notFound();

    return (
        <article className="prose dark:prose-invert max-w-full border border-border p-5">
            <header>
                <h1>{postData.title}</h1>
                <time>{postData.date}</time>
                <CustomCategory category={postData.category} />
            </header>
            <Markdown remarkPlugins={[remarkGfm]}>{postData.markdown}</Markdown>
        </article>
    );
};

export default BlogPage;
