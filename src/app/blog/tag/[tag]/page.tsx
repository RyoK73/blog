import { Posts } from "@/components/common/PostList";

const TagPage = async ({ params }: { params: Promise<{ tag: string }> }) => {
    const { tag } = await params;
    return (
        <main>
            <Posts tag={tag} />
        </main>
    );
};

export default TagPage;
