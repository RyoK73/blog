import Link from "next/link";
import path from "path";
import { Badge } from "../ui/badge";

// tagsを受け取って、Linkをバッジ表示する。各リンク先は、./@/app/blog/tag/[tag]へ
const TagList = ({ tags }: { tags: string[] }) => {
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map((tag) => {
                return (
                    <Link key={tag} href={path.join("/blog/tag", tag)}>
                        <Badge variant={"outline"} className="border-vivid/30 text-vivid hover:bg-vivid/10 transition-colors cursor-pointer">{tag}</Badge>
                    </Link>
                );
            })}
        </div>
    );
};
export default TagList;
