"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import userCategories from "@/user-category.json";

type Tab = {
    href: string;
    name: string;
    prefix: boolean;
};

const tabStyle = {
    active: "border border-vivid text-vivid",
    semiactive: "border-b border-b-vivid text-vivid",
    inactive: "bg-background/0 text-input",
};

export const CustomTabs = ({ className }: { className?: string }) => {
    const pathName = usePathname();

    const getTabStyle = (tab: Tab): string => {
        if (pathName === tab.href) {
            return tabStyle.active;
        } else if (tab.href !== "/" && pathName.startsWith(tab.href)) {
            return tabStyle.semiactive;
        } else return tabStyle.inactive;
    };

    // aboutのみ特別なタブとして、indexなしの "."のみのタブとなる
    const tabs: Tab[] = [
        { href: "/", name: "HOME", prefix: true },
        ...Object.keys(userCategories).map((category) => ({
            href: `/blog/${category}`,
            name: category.toUpperCase(),
            prefix: true,
        })),
        { href: "/about", name: "ABOUT", prefix: false },
    ];

    return (
        <nav className="flex h-auto justify-center divide-x divide-border">
            {tabs.map((tab, index) => {
                const label = `${tab.prefix ? (index + 1).toString().padStart(2, "0") : ""}.${tab.name}`;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "flex justify-center items-center",
                            getTabStyle(tab),
                            className,
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
};
