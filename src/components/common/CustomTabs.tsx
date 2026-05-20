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
        { href: "/", name: "HOME" },
        ...Object.keys(userTags).map((tag) => ({
            href: `/blog/tag/${tag}`,
            name: tag.toUpperCase(),
        })),
    ];

    return (
<<<<<<< HEAD
        <nav
            className={cn("flex h-auto justify-center divide-x divide-border")}
        >
            <Link
                key="home"
                href="/"
                className={cn(getLinkClass("/"), className)}
            >
                {"01.HOME"}
            </Link>
            {Object.keys(userTags).map((tag, index) => {
                const tabLink: string = `/blog/tag/${tag}`;
                const tabName: string = `${(index + 2).toString().padStart(2, "0")}.${tag.toUpperCase()}`;
=======
        <nav className="flex h-auto justify-center divide-x divide-border">
            {tabs.map((tab, index) => {
                const label = `${(index + 1).toString().padStart(2, "0")}.${tab.name}`;
>>>>>>> main
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
            <Link
                key="About"
                href="/about"
                className={cn(getLinkClass("/"), className)}
            >
                {".ABOUT"}
            </Link>
        </nav>
    );
};
