import { getAllPostData, getPostData } from "@/lib/post";
import { CustomCategory } from "@/components/common/CustomCategory";
import markdownToHtml from "zenn-markdown-html";
import "zenn-content-css";
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

    const html = await markdownToHtml(postData.markdown);
    return (
        <article className="">
            <header>
                <h1>{postData.title}</h1>
                <time>{postData.date}</time>
                <CustomCategory category={postData.category} />
            </header>
            <div className="znc" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
    );
};

export default BlogPage;
