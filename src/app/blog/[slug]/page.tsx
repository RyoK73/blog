import getPostData from "@/lib/post";
import TagList from "@/components/common/TagList";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { consola } from "consola";

// ブログ記事の個別ページ
const BlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const pageContent = await getPostData(slug);
    consola.info(pageContent);
    return (
        <article className="prose">
            <header>
                <h1>{pageContent.title}</h1>
                <time>{pageContent.date}</time>
                <TagList tags={pageContent.tag} />
            </header>
            <Markdown remarkPlugins={[remarkGfm]}>{pageContent.contentMarkdown}</Markdown>
        </article>
    );
};

export default BlogPage;
