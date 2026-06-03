"use client";

import { useState } from "react";
import { LuListPlus, LuListX } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

export const SidebarLayout = ({ className }: { className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("flex gap-5", className)}>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <Sidebar
                className={cn(
                    "fixed top-0 left-0 h-full w-70 z-50 p-5 overflow-y-auto bg-background transition-transform duration-300",
                    "lg:static lg:w-64 lg:h-auto lg:p-0 lg:overflow-visible lg:bg-transparent lg:z-auto lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            />

            <button
                className="fixed bottom-6 right-6 z-50 lg:hidden bg-content-background border border-border rounded-full p-3 shadow-lg"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
            >
                {isOpen ? (
                    <LuListX className="size-6" />
                ) : (
                    <LuListPlus className="size-6" />
                )}
            </button>
        </div>
    );
};
