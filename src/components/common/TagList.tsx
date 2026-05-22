import Link from "next/link";
import path from "path";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

// tagsを受け取って、Linkをバッジ表示する。各リンク先は、./@/app/blog/tag/[tag]へ
type TagProps = {
    tag: string;
    className?: string;
};
export const TagList = ({ tag, className }: TagProps) => {
    return (
        <Link key={tag} href={path.join("/blog", tag)}>
            <Badge
                variant={"outline"}
                className={cn(
                    "cursor-pointer border-border border-flow hover:text-vivid rounded-none text-card-foreground p-2",
                    className,
                )}
            >
                {tag}
            </Badge>
        </Link>
    );
};
