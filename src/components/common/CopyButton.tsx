"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LuCopy } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";

type CopyButtonProps = {
    code: string;
    className?: string;
};
export const CopyButton = ({ code, className }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            className={cn("transform", className)}
            onClick={() => handleCopy()}
        >
            {copied ? <LuCheck /> : <LuCopy />}
        </button>
    );
};

export default CopyButton;
