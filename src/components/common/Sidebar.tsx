import { CustomCard } from "./CustomCard";
import { TagList } from "./TagList";
import { getAllPosts } from "@/lib/post";
const posts = await getAllPosts()
export const Sidebar = () => {

    return (
        <div className="col-span-1 flex flex-col gap-5 m-5">
            <CustomCard title={"About"}>
                <div className="flex flex-col items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-full  from-vivid to-vivid-end flex items-center justify-center text-white text-2xl font-bold select-none">
                        D
                    </div>
                    <h1 className="text-xl font-bold  from-vivid to-vivid-end bg-clip-text text-transparent">
                        DEV活
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    Web系ソフトウェアエンジニアを志望。
                    開発記録や個人的な技術に対する思いを綴ります。
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-3 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-vivid/10 text-vivid border border-vivid/20">
                        個人開発
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-vivid/10 text-vivid border border-vivid/20">
                        Arch Linux
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-vivid/10 text-vivid border border-vivid/20">
                        設計
                    </span>
                </div>
            </CustomCard>
            {/* タグ一覧を配置予定 */}
            {/* <CustomCard title={"Tag"}>
                <TagList tags={allTags} />
            </CustomCard> */}
        </div>
    );
};
