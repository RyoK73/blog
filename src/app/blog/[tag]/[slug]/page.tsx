import { getAllPostData, getPostData } from "@/lib/post";
import { TagList } from "@/components/common/TagList";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

type Props = {
    tag: string;
    slug: string;
};
export const generateStaticParams = async () => {
    const posts = await getAllPostData();
    return posts.map((post) => ({
        tag: post.tag,
        slug: post.slug,
    }));
};

const BlogPage = async ({ params }: { params: Promise<Props> }) => {
    const { tag, slug } = await params;
    const postData = await getPostData(slug);

    if (postData.tag !== tag) notFound();

    return (
        <article className="prose">
            <header>
                <h1>{postData.title}</h1>
                <time>{postData.date}</time>
                <TagList tag={postData.tag} />
            </header>
            <Markdown remarkPlugins={[remarkGfm]}>{postData.markdown}</Markdown>
        </article>
    );
};

export default BlogPage;
