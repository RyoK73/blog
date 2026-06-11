import { Posts } from "@/components/common/PostList";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> => {
  const { category } = await params;
  return {
    title: `dev活ブログの${category.toUpperCase()}カテゴリ記事一覧`,
    description: `dev活ブログの${category.toUpperCase()}カテゴリ記事一覧です`,
  };
};

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  return (
    <main>
      <Posts category={category} />
    </main>
  );
};

export default CategoryPage;
