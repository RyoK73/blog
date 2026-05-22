import { getAllPostData } from "@/lib/post";
import { CustomCard } from "./CustomCard";
import { TagList } from "./TagList";
import Link from "next/link";
import path from "path";

export const Posts = async ({ tag }: { tag?: string }) => {
    const posts = await getAllPostData();
    const sortedPosts = posts.sort((a, b) => b.date.localeCompare(a.date));
    const filteredPosts = tag
        ? sortedPosts.filter((sortedPost) => sortedPost.tags.includes(tag))
        : sortedPosts;
    return (
        <ul>
            {filteredPosts.map((post, index) => (
                <li key={post.slug}>
                    <CustomCard
                        label={`P${(index + 1).toString().padStart(3, "0")}`}
                        className="relative hover:border-foreground hover:transition-colors duration-500"
                    >
                        <time>{post.date}</time>
                        <Link
                            href={path.join("/blog", post.tags[0], post.slug)}
                            className="after:absolute after:inset-0"
                        >
                            <h2 className="text-foreground font-bold text-lg">
                                {post.title}
                            </h2>
                        </Link>
                        <TagList
                            tags={post.tags}
                            className="relative z-1 text-sm"
                        />
                    </CustomCard>
                </li>
            ))}
        </ul>
    );
};
