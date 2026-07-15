"use client";

import { useState } from "react";
import { LuListPlus, LuListX } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

export const SidebarLayout = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Sidebar
        className={cn(
          "bg-background/80 fixed top-0 left-0 z-50 h-full w-75 overflow-y-auto p-5 transition-transform duration-300",
          "lg:static lg:z-auto lg:h-auto lg:w-74 lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      />

      <button
        className="bg-content-background border-border fixed right-6 bottom-15 z-50 rounded-full border p-3 shadow-lg lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
      >
        {isOpen ? (
          <LuListX className="size-6" />
        ) : (
          <LuListPlus className="size-6" />
        )}
      </button>
    </>
  );
};
