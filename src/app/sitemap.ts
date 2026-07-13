import { MetadataRoute } from "next";
import { getAllPostData } from "@/lib/post";
import userCategory from "@/user-category.json";

const categories = Object.keys(userCategory);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // 記事一覧を取得
  const posts = await getAllPostData();

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.updatedAt ?? post.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/blog/${category}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [
    { url: `${baseUrl}`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    ...categoryEntries,
    ...postEntries,
  ];
}
