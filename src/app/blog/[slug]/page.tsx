import { getPostData } from "@/lib/post";
import { TagList } from "@/components/common/TagList";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ブログ記事の個別ページ
const BlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const postData = await getPostData(slug);
    return (
        <article className="prose">
            <header>
                <h1>{postData.title}</h1>
                <time>{postData.date}</time>
                <TagList tags={postData.tags} />
            </header>
            <Markdown remarkPlugins={[remarkGfm]}>{postData.markdown}</Markdown>
        </article>
    );
};

export default BlogPage;
