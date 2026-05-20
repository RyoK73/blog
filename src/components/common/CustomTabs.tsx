"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import userTags from "@/user-tag.json";

export const CustomTabs = ({ className }: { className?: string }) => {
    const pathName = usePathname();

    const isActiveTab = (href: string): boolean => {
        return href === pathName || (href !== "/" && pathName.startsWith(href));
    };

    const tabs = [
        { href: "/", name: "HOME", prefix: true },
        ...Object.keys(userTags).map((tag) => ({
            href: `/blog/${tag}`,
            name: tag.toUpperCase(),
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
                            " bg-background flex justify-center items-center",
                            isActiveTab(tab.href)
                                ? "border border-vivid text-vivid"
                                : "bg-background/0 text-input",
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
