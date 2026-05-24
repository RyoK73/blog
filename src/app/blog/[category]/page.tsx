import { Posts } from "@/components/common/PostList";

const CategoryPage = async ({ params }: { params: Promise<{ category: string }> }) => {
    const { category } = await params;
    return (
        <main>
            <Posts category={category} />
        </main>
    );
};

export default CategoryPage;
