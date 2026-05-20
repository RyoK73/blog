"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import userTags from "@/user-tag.json";

export const CustomTabs = ({ className }: { className?: string }) => {
    const pathName = usePathname();
    const getLinkClass = (tabLink: string): string[] => {
        return [
            " bg-background flex justify-center items-center",
            isActiveTab(tabLink)
                ? "border border-vivid text-vivid"
                : "bg-background/0 text-input",
        ];
    };
    return (
        <nav
            className={cn("flex h-auto justify-center divide-x divide-border")}
        >
            <Link
                key={"home"}
                href={"/"}
                className={cn(getLinkClass("/"), className)}
            >
                {"01.HOME"}
            </Link>
            {Object.keys(userTags).map((tag, index) => {
                const tabLink: string = `/blog/tag/${tag}`;
                const tabName: string = `${(index + 2).toString().padStart(2, "0")}.${tag.toUpperCase()}`;
                return (
                    <Link
                        key={tag}
                        href={tabLink}
                        className={cn(getLinkClass(tag), className)}
                    >
                        {tabName}
                    </Link>
                );
            })}
        </nav>
    );
};

const isActiveTab = (tabLink: string): boolean => {
    const pathName = usePathname();
    return (
        tabLink === pathName ||
        (tabLink !== "/" && pathName.startsWith(`/blog/tag/${tabLink}`))
    );
};
