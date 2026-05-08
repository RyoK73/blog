import { PostListByTag } from "@/components/common/PostList";

const TagPage = async ({ params }: { params: Promise<{ tag: string }> }) => {
    const { tag } = await params;
    return (
        <main>
            <PostListByTag tag={tag} />
        </main>
    );
};

export default TagPage;
