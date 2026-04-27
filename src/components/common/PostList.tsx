import type { PostData } from "@/lib/post";
import { getAllPosts } from "@/lib/post";
import TagList from "@/components/common/TagList";
import Link from "next/link";
import path from "path";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// postsで./posts/のコンテンツ一覧を受け取りリストを表示する
const PostList = (posts: PostData[]) => {
    const sortedPost = posts.sort((a, b) => b.date.localeCompare(a.date));
    return (
        <ul className="flex flex-col gap-3">
            {sortedPost.map((post) => {
                return (
                    <li key={post.slug}>
                        <Card className="rounded-sm group transition-all duration-200 shadow shadow-vivid/30 hover:-translate-y-1 hover:shadow-md hover:shadow-vivid/50 hover:ring-vivid/40">
                            <CardHeader>
                                <Link
                                    key={post.slug}
                                    href={path.join("/blog", post.slug)}
                                >
                                    <time className="text-xs font-mono text-muted-foreground tracking-wider">{post.date}</time>
                                    <CardTitle className="text-foreground transition-colors group-hover:text-vivid">{post.title}</CardTitle>
                                </Link>
                                <TagList tags={post.tag} />
                            </CardHeader>
                        </Card>
                    </li>
                );
            })}
        </ul>
    );
};

// tagで./posts/*.mdをフィルターし適合するpostsをリストで表示する
export const PostListByTag = async ({ tag }: { tag?: string }) => {
    const posts = await getAllPosts();
    const postsByTag = tag
        ? posts.filter((post) => {
              return post.tag.includes(tag);
          })
        : posts;
    return PostList(postsByTag);
};
