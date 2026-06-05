import { getAllPostData } from "@/lib/post";
import { CustomCard } from "./CustomCard";
import { CustomCategory } from "./CustomCategory";
import Link from "next/link";
import path from "path";

export const Posts = async ({ category }: { category?: string }) => {
    const posts = await getAllPostData();
    const sortedPosts = posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const filteredPosts = category
        ? sortedPosts.filter((sortedPost) => sortedPost.category === category)
        : sortedPosts;
    return (
        <ul className="w-full flex flex-col gap-5">
            {filteredPosts.map((post, index) => (
                <li key={post.slug}>
                    <CustomCard
                        label={`P${(index + 1).toString().padStart(3, "0")}`}
                        className="relative hover:border-foreground hover:transition-colors duration-500"
                    >
                        <time>{post.createdAt}</time>
                        <Link
                            href={path.join("/blog", post.category, post.slug)}
                            className="after:absolute after:inset-0"
                        >
                            <h2 className="text-foreground font-bold text-lg">
                                {post.title}
                            </h2>
                        </Link>
                        <CustomCategory
                            category={post.category}
                            className="relative z-1 text-sm"
                        />
                    </CustomCard>
                </li>
            ))}
        </ul>
    );
};
