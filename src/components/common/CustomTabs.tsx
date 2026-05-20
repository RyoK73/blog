"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type TabProp = {
    name: string;
    link: string;
};

type Params = { tabs: NonEmptyArray<TabProp> } & { className?: string };

export type NonEmptyArray<T> = [T, ...T[]];

export const CustomTabs = ({ tabs, className }: Params) => {
    const pathName = usePathname();
    return (
        <nav
            className={cn("flex h-auto justify-center divide-x divide-border")}
        >
            {tabs.map((tab) => {
                const isActive =
                    tab.link === pathName ||
                    (tab.link !== "/" && pathName.startsWith(tab.link));
                return (
                    <Link
                        key={tab.name}
                        href={tab.link}
                        className={cn(
                            " bg-background flex justify-center items-center",
                            isActive
                                ? "border border-vivid text-vivid"
                                : "bg-background/0 text-input",
                            className,
                        )}
                    >
                        {tab.name}
                    </Link>
                );
            })}
        </nav>
    );
};
