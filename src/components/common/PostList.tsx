import { getAllPostData } from "@/lib/post";
import { CustomCard } from "./CustomCard";
import { CustomCategory } from "./CustomCategory";
import Link from "next/link";
import path from "path";

export const Posts = async ({ category }: { category?: string }) => {
  const posts = await getAllPostData();
  const sortedPosts = posts.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
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
            <span className="absolute -top-3 right-3 px-1 z-10 bg-background text-vivid font-medium text-sm">
              {post.updatedAt
                ? `Updated: ${post.updatedAt}`
                : `Created: ${post.createdAt}`}
            </span>
            <Link
              href={path.join("/blog", post.category, post.slug)}
              className="after:absolute after:inset-0"
            >
              <h2 className="text-foreground font-bold text-lg">
                {post.title}
              </h2>
            </Link>
            <p>{post.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                約{post.readingMinutes}分で読めます・{post.charCount}文字
              </p>
            </div>
          </CustomCard>
        </li>
      ))}
    </ul>
  );
};
