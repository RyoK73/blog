import { getAllPostData } from "@/lib/post";
import { CustomCard } from "./CustomCard";
import { CustomCategory } from "./CustomCategory";
import Link from "next/link";
import path from "path";

export const Posts = async ({ category }: { category?: string }) => {
  const posts = await getAllPostData();
  const sortedPosts = posts.sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate),
  );
  const filteredPosts = category
    ? sortedPosts.filter((sortedPost) => sortedPost.category === category)
    : sortedPosts;
  return (
    <ul className="flex w-full flex-col gap-5">
      {filteredPosts.map((post, index) => (
        <li key={post.slug}>
          <CustomCard
            label={`P${(index + 1).toString().padStart(3, "0")}`}
            className="hover:border-foreground relative duration-500 hover:transition-colors"
          >
            <span className="bg-background text-vivid absolute -top-3 right-3 z-10 px-1 text-sm font-medium">
              {post.updatedAt
                ? `Updated: ${post.updatedAt}`
                : `Created: ${post.createdAt}`}
            </span>
            <Link
              href={path.join("/blog", post.category, post.slug)}
              className="after:absolute after:inset-0"
            >
              <h2 className="text-foreground text-lg font-extrabold">
                {post.title}
              </h2>
            </Link>
            <p>{post.description}</p>
            <div className="mt-2 flex gap-3">
              <CustomCategory
                category={post.category}
                className="relative z-1 text-sm"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                約{post.readingMinutes}分で読めます・{post.charCount}文字
              </p>
            </div>
          </CustomCard>
        </li>
      ))}
    </ul>
  );
};
