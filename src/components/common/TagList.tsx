import Link from "next/link";
import path from "path";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import tagJson from "@/user-tag.json";

// tagsを受け取って、Linkをバッジ表示する。各リンク先は、./@/app/blog/tag/[tag]へ
type TagProps = {
    tags: string[];
    className?: string;
};
export const TagList = ({ tags, className }: TagProps) => {
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {tags
                .filter((tag) => Object.keys(tagJson).includes(tag))
                .map((tag) => {
                    return (
                        <Link key={tag} href={path.join("/blog/tag", tag)}>
                            <Badge
                                variant={"outline"}
                                className={cn(
                                    "cursor-pointer rounded-none text-card-foreground border border-border p-2",
                                    className,
                                )}
                            >
                                {tag}
                            </Badge>
                        </Link>
                    );
                })}
        </div>
    );
};
