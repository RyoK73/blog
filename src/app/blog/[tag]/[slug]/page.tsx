import { getPostData } from "@/lib/post";
import { TagList } from "@/components/common/TagList";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

type Props = {
    tag: string;
    slug: string;
};

// ブログ記事の個別ページ
const BlogPage = async ({ params }: { params: Promise<Props> }) => {
    const { tag, slug } = await params;
    const postData = await getPostData(slug);

    if (postData.tags[0] !== tag) notFound();

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
