import { getAllPostData, getPostData } from "@/lib/post";
import { CustomCategory } from "@/components/common/CustomCategory";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import React from "react";
import CodeBlock from "@/components/common/CodeBlock";
import { Metadata } from "next";

type Props = {
  category: string;
  slug: string;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Props>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return {
    title: postData.title,
    description: postData.description,
  };
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

  if (!postData.published) notFound();
  if (postData.category !== category) notFound();

  return (
    <article className="prose dark:prose-invert max-w-full border border-border p-5">
      <header>
        <h1>{postData.title}</h1>
        <time>{postData.createdAt}</time>
        {postData.updatedAt && <time>更新日: {postData.updatedAt}</time>}
        <CustomCategory category={postData.category} />
      </header>
      <Markdown
        remarkPlugins={[[remarkGfm]]}
        components={{
          pre: (props) => {
            if (!React.isValidElement(props.children)) {
              return <pre>{props.children}</pre>;
            }
            // react-markdownの仕様上、props.childrenはchildren:React.ReactNodeのReactElementなため、asでキャストしている。
            return (
              <CodeBlock>
                {
                  props.children as React.ReactElement<{
                    children: React.ReactNode;
                  }>
                }
              </CodeBlock>
            );
          },
        }}
      >
        {postData.markdown}
      </Markdown>
    </article>
  );
};

export default BlogPage;
