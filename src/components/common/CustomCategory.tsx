import Link from "next/link";
import path from "path";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

// categoryを受け取って、Linkをバッジ表示する。各リンク先は、./@/app/blog/category/[category]へ
type CategoryProps = {
    category: string;
    className?: string;
};
export const CustomCategory = ({ category, className }: CategoryProps) => {
    return (
        <Link href={path.join("/blog", category)}>
            <Badge
                variant={"outline"}
                className={cn(
                    "cursor-pointer border-border border-flow hover:text-vivid rounded-none text-card-foreground p-2",
                    className,
                )}
            >
                {category}
            </Badge>
        </Link>
    );
};
