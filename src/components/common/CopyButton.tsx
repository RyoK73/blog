"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LuCopy } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";
import consola from "consola";

type CopyButtonProps = {
    code: string;
    className?: string;
};
export const CopyButton = ({ code, className }: CopyButtonProps) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            if (e instanceof Error) {
                consola.warn("code copy failed...", e.message);
            } else {
                consola.error("unkown error:", e);
            }
        }
    };
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);
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
